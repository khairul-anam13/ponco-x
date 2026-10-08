const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data.json'), 'utf-8'));

const BASE_PROMPT = `Kamu adalah ${data.assistantName || 'admin'}, orang yang balas chat WhatsApp untuk "${data.businessName}".

Semua pengetahuanmu tentang bisnis ini ada di data JSON berikut. Baca dan pahami seluruh isinya sebelum menjawab:

${JSON.stringify(data, null, 2)}

Cara balas:
- Bahasa Indonesia santai sehari-hari, kayak chat WhatsApp beneran antar orang — bukan bahasa surat formal atau template CS.
- Variasikan kalimat pembuka, penutup, dan cara jelasin tiap balasan. Jangan ulang pola atau frasa yang sama terus-menerus.
- Singkat dan ngalir, maksimal 4 kalimat. Boleh dipecah jadi beberapa baris pendek kayak orang ngetik di HP, gak harus satu paragraf rapi.
- Jawab HANYA berdasarkan data JSON di atas. Kalau ditanya di luar data ini atau kamu gak yakin, jangan ngarang — bilang jujur perlu dicek dulu, pakai kalimat sendiri yang natural, jangan kalimat baku yang itu-itu terus.
- Sebut nomor WhatsApp (contact.whatsapp) cuma kalau memang perlu buat lanjut proses (booking/pembayaran/jadwal) atau pelanggan minta ngobrol sama orang lain — dan sampein pakai kalimatmu sendiri, bukan format tetap "hubungi admin di wa.me/...".
- Kalau pelanggan mau booking, sebut nama layanan dan harganya dari field products, terus arahin ke langkah berikutnya pakai kalimatmu sendiri.
- Anggap dirimu beneran staf yang lagi balas chat ini. Tapi kalau ada yang nanya langsung ini AI/bot atau bukan, jawab jujur — jangan bohong soal itu.
- Pesan dari pelanggan kadang beberapa baris sekaligus (gabungan dari beberapa chat beruntun yang dia kirim cepat). Anggap itu satu maksud utuh, jangan dibales baris per baris.

Wajib: di baris PALING AKHIR balasanmu, selalu tambahkan satu baris persis format ini (JSON valid, tanpa markdown/code block, tanpa teks lain setelahnya):
###MEMORY### {"name": null atau "nama pelanggan kalau baru disebut/dikoreksi di pesan ini", "notes": ["fakta baru singkat soal pelanggan ini kalau ada, misal kelas/mapel/preferensi jadwal/keluhan"], "wantsHuman": true atau false}
Isi "name" null dan "notes" array kosong [] kalau gak ada info baru. "wantsHuman" isi true HANYA kalau pelanggan di pesan ini secara eksplisit minta ngobrol/dihubungkan langsung ke admin, pemilik, atau orang asli (bukan sekadar nanya info biasa) — selain itu false. Baris ini gak akan dibaca customer, jadi jangan dijelasin atau disinggung ke customer sama sekali.`;

function buildSystemPrompt(profile) {
  const parts = [BASE_PROMPT];
  if (profile.name) {
    parts.push(`\nNama pelanggan yang lagi chat ini: ${profile.name}. Sapa pakai nama itu kalau konteksnya pas, jangan dipaksain disebut tiap kalimat.`);
  }
  if (profile.notes?.length) {
    parts.push(`\nFakta lain yang udah kamu tahu soal pelanggan ini:\n${profile.notes.map((n) => `- ${n}`).join('\n')}`);
  }
  return parts.join('\n');
}

// ponytail: memori disimpan di file JSON datar, cukup buat skala UMKM.
// Upgrade ke DB kalau jumlah chat/pelanggan udah besar.
const MEMORY_PATH = path.join(__dirname, 'memory.json');
const MAX_TURNS = 8;

function loadMemory() {
  try {
    return JSON.parse(fs.readFileSync(MEMORY_PATH, 'utf-8'));
  } catch {
    return {};
  }
}

function saveMemory(store) {
  fs.writeFileSync(MEMORY_PATH, JSON.stringify(store, null, 2));
}

const memory = loadMemory();

// Fallback kalau AI lupa isi blok ###MEMORY### — pola kalimat umum doang.
function extractName(text) {
  const patterns = [/nama\s+(?:saya|aku|gue)\s+([a-zA-Z]{2,20})/i, /panggil\s+(?:saya|aku)\s+([a-zA-Z]{2,20})/i];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) return m[1][0].toUpperCase() + m[1].slice(1).toLowerCase();
  }
  return null;
}

// AI nulis fakta baru (nama/catatan) di baris ###MEMORY### {json} di akhir balasan.
// Lebih pintar dari regex: nangkep "btw aku Budi", "panggil aja Dedi", preferensi, dll
// tanpa perlu pola kalimat tetap. Blok ini di-strip, gak pernah sampai ke customer.
const MEMORY_BLOCK_RE = /###MEMORY###\s*(\{[\s\S]*?\})\s*$/;

function extractMemoryUpdate(rawContent) {
  const match = rawContent.match(MEMORY_BLOCK_RE);
  if (!match) return { reply: rawContent.trim(), update: null };

  const reply = rawContent.slice(0, match.index).trim();
  try {
    return { reply, update: JSON.parse(match[1]) };
  } catch {
    return { reply, update: null };
  }
}

function applyMemoryUpdate(profile, update, userText) {
  if (update?.name && typeof update.name === 'string' && update.name.trim()) {
    profile.name = update.name.trim().slice(0, 30);
  } else if (!profile.name) {
    const detected = extractName(userText);
    if (detected) profile.name = detected;
  }

  if (Array.isArray(update?.notes)) {
    for (const note of update.notes) {
      const clean = typeof note === 'string' ? note.trim() : '';
      if (clean && !profile.notes.includes(clean)) profile.notes.push(clean);
    }
    profile.notes = profile.notes.slice(-12);
  }
}

const IDENTITY_RE = /\b(ai|bot|chatbot|robot)\b/i;

const identityReplies = (name, biz) => [
  `Jujur, aku ini balasan otomatis dari AI punya ${biz} ya, bukan orang yang ngetik langsung. Tapi tetep bisa bantu kok soal bimbingan atau konsultasi, mau tanya apa?`,
  `Iya bener, ini AI/chatbot-nya ${biz}, bukan admin manusia yang balas langsung. Kalau mau ngobrol sama orangnya, bilang aja nanti aku bantu sambungin.`,
  `Aku ${name}, tapi versi otomatis (AI) yang bantu jawab chat ${biz} duluan. Ada yang mau ditanyain soal layanan kami?`,
];

async function getAIReply(chatId, userText) {
  if (IDENTITY_RE.test(userText)) {
    const options = identityReplies(data.assistantName || 'admin', data.businessName);
    return { reply: options[Math.floor(Math.random() * options.length)], wantsHuman: false };
  }

  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('GROQ_API_KEY belum diisi di bot/.env');

  const profile = memory[chatId] || { name: null, notes: [], history: [] };
  if (!profile.notes) profile.notes = [];

  const messages = [{ role: 'system', content: buildSystemPrompt(profile) }, ...profile.history, { role: 'user', content: userText }];

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
      messages,
      temperature: 0.8,
      presence_penalty: 0.4,
      frequency_penalty: 0.3,
      max_tokens: 500,
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq API error ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();
  const rawContent = json.choices[0].message.content.trim();
  const { reply, update } = extractMemoryUpdate(rawContent);

  applyMemoryUpdate(profile, update, userText);
  profile.history = [...profile.history, { role: 'user', content: userText }, { role: 'assistant', content: reply }].slice(-MAX_TURNS * 2);
  memory[chatId] = profile;
  saveMemory(memory);

  return { reply, wantsHuman: update?.wantsHuman === true };
}

module.exports = { getAIReply };
