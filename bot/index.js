const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

try {
  process.loadEnvFile(path.join(__dirname, '.env'));
} catch {
  // .env opsional kalau GROQ_API_KEY belum diset, bot jatuh ke balasan menu biasa
}

const { getAIReply } = require('./ai');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data.json'), 'utf-8'));

function menuText() {
  return (
    `*${data.businessName}* - ${data.tagline}\n\n` +
    `Ketik salah satu perintah:\n` +
    `1. *katalog* - lihat daftar layanan\n` +
    `2. *promo* - lihat promo aktif\n` +
    `3. *jam* - jam operasional\n` +
    `4. *faq* - pertanyaan umum\n` +
    `5. *admin* - bicara dengan admin\n\n` +
    `Atau ketik nama layanan untuk booking, contoh: Konsultasi Tugas & Skripsi`
  );
}

function catalogText() {
  return data.products.map((p, i) => `${i + 1}. *${p.name}* - ${p.price}\n   ${p.desc}`).join('\n\n');
}

function promoText() {
  if (!data.promo.length) return 'Belum ada promo aktif saat ini.';
  return data.promo.map((p) => `*${p.title}*\n${p.desc}`).join('\n\n');
}

function faqText() {
  return data.faq.map((f) => `*${f.q}*\n${f.a}`).join('\n\n');
}

function findProductOrder(text) {
  const lower = text.toLowerCase();
  return data.products.find((p) => lower.startsWith(p.name.toLowerCase()));
}

// Nomor admin buat notifikasi internal (AI gagal / customer minta admin),
// beda dari data.contact.whatsapp yang ditampilkan ke customer.
function toWhatsAppJid(number) {
  const digits = number.replace(/\D/g, '');
  const withCountryCode = digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
  return `${withCountryCode}@s.whatsapp.net`;
}

const ADMIN_JID = process.env.ADMIN_WHATSAPP ? toWhatsAppJid(process.env.ADMIN_WHATSAPP) : null;

// Fallback kalau jalur AI gagal (jadi gak sempat dapet flag wantsHuman dari AI).
function mentionsAdminRequest(text) {
  return /admin|pemilik|owner|manusia|orang asli|cs\b/i.test(text);
}

function replyFor(text) {
  const cmd = text.trim().toLowerCase();

  if (['menu', 'help', 'start', 'halo', 'hai', 'hi'].includes(cmd)) return menuText();
  if (cmd === 'katalog' || cmd === 'produk') return catalogText();
  if (cmd === 'promo') return promoText();
  if (cmd === 'jam' || cmd === 'jadwal') return `Jam operasional: ${data.hours}`;
  if (cmd === 'faq') return faqText();
  if (cmd === 'admin') return `Admin akan segera membalas chat Anda. Untuk cepat, hubungi langsung: wa.me/${data.contact.whatsapp}`;

  const product = findProductOrder(text);
  if (product) {
    return (
      `Booking dicatat:\n*${product.name}* - ${product.price}\n\n` +
      `Admin akan konfirmasi jadwal & metode pembayaran. Mohon tunggu sebentar ya.`
    );
  }

  return `Maaf, perintah tidak dikenali.\n\n${menuText()}`;
}

// Antrian FIFO global: pesan diproses & dibalas satu-satu sesuai urutan masuk
// (jam:menit:detik), biar gak kebalik pas banyak pesan masuk bareng (lonjakan).
// ponytail: satu antrian global, bukan per-chat — cukup buat skala UMKM.
// Upgrade ke antrian per-chat (biar beda customer bisa paralel) kalau volume besar.
const queue = [];
let processing = false;

function enqueue(job) {
  queue.push(job);
  runQueue();
}

async function runQueue() {
  if (processing) return;
  processing = true;
  while (queue.length) {
    const job = queue.shift();
    try {
      await job();
    } catch (err) {
      console.log('Gagal proses pesan dari antrian:', err.message);
    }
  }
  processing = false;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const randomBetween = (min, max) => min + Math.random() * (max - min);

// Jeda "sadar ada chat" sebelum mulai ngetik + durasi ngetik ikut panjang
// balasan, biar pola waktu bales gak seragam/instan kayak bot — salah satu
// ciri yang bikin nomor gampang ditandai spam sama WhatsApp.
// ponytail: angka pengali kira-kira ala kecepatan ngetik manusia, bukan hasil
// riset ketat. Perbesar range kalau masih kerasa terlalu cepat/seragam.
async function humanDelay(sock, jid, replyText) {
  await sleep(randomBetween(500, 1800));

  try {
    await sock.sendPresenceUpdate('composing', jid);
  } catch {}

  const typingMs = Math.min(randomBetween(800, 2000) + replyText.length * randomBetween(15, 35), 7000);
  await sleep(typingMs);

  try {
    await sock.sendPresenceUpdate('paused', jid);
  } catch {}
}

// WA sering kirim satu maksud jadi beberapa bubble beruntun ("halo", "mau tanya",
// "bimbingan matematika ada?"). Tunggu jeda hening sebentar, gabung jadi satu pesan,
// baru diproses — biar AI liat konteks utuh, bukan potongan kalimat satu-satu.
// ponytail: debounce waktu doang, bukan deteksi "kalimat nyambung" pakai NLU.
// Upgrade kalau pelanggan sering jeda lama (>BUBBLE_WAIT_MS) di tengah satu maksud.
const BUBBLE_WAIT_MS = 4000;
const bubbleBuffers = new Map();

function bufferMessage(chatId, text, onFlush) {
  const existing = bubbleBuffers.get(chatId);
  const texts = existing ? [...existing.texts, text] : [text];
  if (existing) clearTimeout(existing.timer);

  const timer = setTimeout(() => {
    bubbleBuffers.delete(chatId);
    onFlush(texts.join('\n'));
  }, BUBBLE_WAIT_MS);

  bubbleBuffers.set(chatId, { texts, timer });
}

async function notifyAdmin(sock, text) {
  if (!ADMIN_JID) return;
  try {
    await sock.sendMessage(ADMIN_JID, { text });
  } catch (err) {
    console.log('Gagal kirim notifikasi ke admin:', err.message);
  }
}

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'auth'));

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrcode.generate(qr, { small: true });
      console.log('Scan QR di atas dengan WhatsApp (Perangkat Tertaut).');
    }

    if (connection === 'close') {
      const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const loggedOut = statusCode === DisconnectReason.loggedOut;
      console.log('Koneksi putus.', loggedOut ? 'Logout, hapus folder auth untuk login ulang.' : 'Menyambung ulang...');
      if (!loggedOut) start();
    } else if (connection === 'open') {
      console.log(`Bot ${data.businessName} aktif dan siap melayani chat.`);
    }
  });

  sock.ev.on('messages.upsert', ({ messages }) => {
    const valid = messages
      .filter((msg) => msg?.message && !msg.key.fromMe && !msg.key.remoteJid?.endsWith('@g.us'))
      .sort((a, b) => (a.messageTimestamp || 0) - (b.messageTimestamp || 0));

    for (const msg of valid) {
      const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
      if (!text) continue;

      const chatId = msg.key.remoteJid;

      bufferMessage(chatId, text, (combinedText) => {
        enqueue(async () => {
          let reply;
          let wantsHuman = false;

          try {
            const result = await getAIReply(chatId, combinedText);
            reply = result.reply;
            wantsHuman = result.wantsHuman;
          } catch (err) {
            console.log('AI gagal, pakai balasan menu biasa:', err.message);
            reply = replyFor(combinedText);
            wantsHuman = mentionsAdminRequest(combinedText);
            await notifyAdmin(
              sock,
              `*AI gagal jawab*\nDari: ${chatId}\nPesan: "${combinedText}"\nError: ${err.message}`
            );
          }

          await humanDelay(sock, chatId, reply);
          await sock.sendMessage(chatId, { text: reply });

          if (wantsHuman) {
            await notifyAdmin(sock, `*Customer minta admin*\nDari: ${chatId}\nPesan: "${combinedText}"`);
          }
        });
      });
    }
  });
}

start();
