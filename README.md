# PONCO-X

Chatbot CS WhatsApp AI (gratis, pakai Baileys + Groq) — produk jasa yang dijual Levcel.Corp ke pelaku usaha/UMKM.

## Struktur

- `bot/` — chatbot WhatsApp (Node.js + Baileys + Groq AI). Contoh terpasang buat klien demo "All in Task" (bimbingan belajar), isinya diedit lewat `data.json`.
- `data.json` — info bisnis klien yang dilayani bot: nama, tagline, jam buka, kontak, produk/layanan, promo, FAQ. Ganti isinya kalau bot dipasang buat klien lain.
- `web/` — **situs marketing produk PONCO-X** (Next.js + Tailwind), buat jualan jasa chatbot ini ke pelaku usaha. Bukan web punya klien — kontak, harga, dan fitur yang ditampilkan ada di `web/app/page.js`.
- `web-legacy-allintask/` — arsip web promosi statis lama (demo untuk klien "All in Task"), sudah nggak dipakai, disimpan sebagai referensi.

## Setup AI (sekali saja)

Bot pakai [Groq](https://console.groq.com) (gratis, tanpa kartu kredit) supaya balasan natural dan nyambung ke info bisnis di `data.json`, bukan cuma balasan menu kaku.

1. Daftar/login di https://console.groq.com
2. Buat API key di menu **API Keys**
3. Copy `bot/.env.example` jadi `bot/.env`, isi:
   ```
   GROQ_API_KEY=isi_key_disini
   ```

Kalau `bot/.env` belum diisi, bot tetap jalan tapi otomatis jatuh ke balasan menu biasa (lihat bagian "Perintah yang dikenali bot" di bawah) — tidak akan pernah diam.

## Menjalankan chatbot WhatsApp

```bash
cd bot
npm install
npm start
```

Saat pertama kali jalan, QR code muncul di terminal. Scan pakai WhatsApp di HP:
**WhatsApp > Perangkat Tertaut > Tautkan Perangkat**.

Sesi login tersimpan di folder `bot/auth/` (jangan dibagikan/upload, sudah masuk `.gitignore`). Setelah login sekali, bot otomatis connect lagi tanpa scan ulang kecuali logout.

### Cara bot membalas

Kalau `GROQ_API_KEY` terisi: setiap chat masuk dijawab AI (model Llama 3.3 via Groq) yang tahu seluruh isi `data.json` (produk, promo, jam, FAQ, kontak admin) dan membalas natural dalam Bahasa Indonesia — bukan cocok-cocokan kata kunci. Riwayat chat per nomor disimpan sementara di memori supaya obrolan nyambung, tapi hilang kalau bot di-restart.

Kalau AI gagal (key belum diisi, API down, dsb), bot otomatis jatuh ke balasan menu biasa:

- `menu` / `halo` / `hai` — tampilkan menu utama
- `katalog` — daftar produk
- `promo` — promo aktif
- `jam` — jam operasional
- `faq` — pertanyaan umum
- `admin` — minta disambungkan ke admin
- Ketik nama produk + jumlah (contoh: `Produk A 2`) — dicatat sebagai order

Prompt/kepribadian AI bisa diedit di [`bot/ai.js`](bot/ai.js), balasan menu fallback di [`bot/index.js`](bot/index.js).

## Menjalankan web marketing PONCO-X

```bash
cd web
npm install
npm run dev
```

Buka `http://localhost:3000`. Build buat produksi: `npm run build && npm start`.

Isi web (headline, fitur, harga, FAQ, nomor WA) ada langsung di [`web/app/page.js`](web/app/page.js) — ubah konstanta di bagian atas file (`WA_NUMBER`, `pricing`, dll), bukan lewat `data.json`.

## Kustomisasi bot per klien

Edit [`data.json`](data.json) untuk ganti nama bisnis klien, nomor WhatsApp, layanan/produk, promo, jam, dan FAQ yang dijawab bot — perubahan langsung dipakai AI, tidak perlu ubah kode. Tiap klien baru = salin folder `bot/` + `data.json` baru, atau ganti isi `data.json` kalau cuma pegang satu nomor dalam satu waktu.

## Catatan

- Baileys tidak resmi dari WhatsApp. Pakai nomor khusus bisnis (bukan nomor pribadi utama), risiko ditangguhkan selalu ada pada WhatsApp pihak ketiga.
- Untuk online 24 jam, jalankan `bot/` di server/VPS yang nyala terus (mis. pakai `pm2`), bukan cuma di laptop.
- Kalau `npm install` di `web/` error soal `lightningcss`/binary native hilang padahal di Windows: cek `~/.npmrc` ada baris `os=linux` (sisa setup lain), hapus atau jalankan `npm install --os=win32 --cpu=x64` buat pasang ulang binary yang benar.
