import Image from "next/image";
import Logo from "./Logo";
import mascot from "../public/layer-cartoon-character.png";

const WA_NUMBER = "6281393242084";
const WA_LINK = `https://wa.me/${WA_NUMBER}`;

const stats = [
  { value: "<5 detik", label: "rata-rata PONCO-X mulai mengetik balasan" },
  { value: "24/7", label: "aktif tanpa libur, termasuk tengah malam" },
  { value: "0", label: "chat kelewat walau masuk bareng-bareng" },
  { value: "100%", label: "nama & riwayat pelanggan tersimpan tiap sesi" },
];

const features = [
  {
    title: "Balasan natural, bukan robot kaku",
    desc: "AI ngerti bahasa sehari-hari pelanggan, bukan cuma cocok-cocokan kata kunci kayak bot menu biasa.",
  },
  {
    title: "Inget pelanggan",
    desc: "Nama dan riwayat obrolan kesimpen, jadi pelanggan nggak perlu kenalan ulang tiap kali chat.",
  },
  {
    title: "Nggak keteteran pas rame",
    desc: "Pesan yang masuk bareng diantre dan dibales sesuai urutan, nggak ada yang kelewat atau kebalap.",
  },
  {
    title: "Ngerti bubble yang kepisah",
    desc: "Pelanggan ngetik beberapa pesan pendek beruntun? Tetap dibaca sebagai satu maksud utuh, bukan dibales satu-satu.",
  },
  {
    title: "Tahu kapan harus nyerah ke manusia",
    desc: "Admin dapet notifikasi otomatis kalau pelanggan minta ngomong langsung, atau kalau AI nggak yakin jawab.",
  },
  {
    title: "Pola bales kayak orang beneran",
    desc: "Jeda dan status \"mengetik...\" yang acak, supaya nggak keliatan seperti bot yang bales instan.",
  },
];

const steps = [
  {
    title: "Ceritain bisnis Anda",
    desc: "Produk/layanan, harga, jam buka, sampai FAQ — cukup diisi di satu file, nggak perlu ngoding.",
  },
  {
    title: "Kami pasang & sambungin ke WhatsApp",
    desc: "Scan QR sekali di nomor bisnis Anda, PONCO-X langsung aktif dan siap jawab chat.",
  },
  {
    title: "Live, tinggal pantau",
    desc: "Pelanggan chat, PONCO-X yang jawab. Anda tinggal terima notifikasi kalau memang dibutuhkan.",
  },
];

const pricing = [
  {
    name: "Starter",
    price: "Rp 1.500.000",
    period: "sekali bayar",
    desc: "Buat yang mau mulai rapi: bot balas menu, belum pakai AI.",
    items: ["Bot WA balas katalog, promo, jam & FAQ", "1 nomor WhatsApp bisnis", "Setup & scan QR dibantu penuh"],
    highlight: false,
  },
  {
    name: "Pro (AI)",
    price: "Rp 3.500.000",
    period: "sekali bayar + Rp 100rb/bulan",
    desc: "Paket yang dipakai di semua contoh di halaman ini.",
    items: [
      "Semua fitur Starter",
      "Balasan AI natural & inget pelanggan",
      "Antrian anti-numpuk + gabung pesan beruntun",
      "Notifikasi admin otomatis",
      "Biaya bulanan nutup kuota AI & maintenance",
    ],
    highlight: true,
  },
  {
    name: "Custom",
    price: "Mulai Rp 6.000.000",
    period: "sesuai kebutuhan",
    desc: "Buat usaha yang butuh lebih dari sekadar chatbot.",
    items: ["Integrasi pembayaran otomatis", "Dashboard & laporan", "Multi-admin / multi-cabang", "Kebutuhan khusus lainnya"],
    highlight: false,
  },
];

const faqs = [
  {
    q: "Ini pakai WhatsApp resmi?",
    a: "PONCO-X jalan di nomor WhatsApp biasa (bukan WhatsApp Business API berbayar), jadi biayanya bisa ditekan. Ada risiko kecil diblokir WhatsApp, makanya kami pasang jeda dan pola bales natural buat menekan risiko itu.",
  },
  {
    q: "Berapa lama proses setup?",
    a: "Rata-rata 2–5 hari kerja, tergantung seberapa lengkap info bisnis yang Anda kasih ke kami.",
  },
  {
    q: "Bisa pakai nomor yang udah dipakai buat WA pribadi?",
    a: "Lebih disarankan pakai nomor baru khusus bisnis, supaya chat pelanggan nggak campur sama chat pribadi Anda.",
  },
  {
    q: "Data pelanggan aman nggak?",
    a: "Riwayat chat disimpan di server Anda sendiri, bukan di server pihak ketiga, dan nggak dibagikan ke siapa pun.",
  },
];

function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy text-paper">
      <div className="relative mx-auto grid min-h-[86vh] max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <p className="hero-rise text-sm font-medium text-amber" style={{ "--rise-delay": "0ms" }}>
            Levcel.Corp
          </p>
          <h1
            className="hero-rise mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl"
            style={{ "--rise-delay": "80ms" }}
          >
            Bisnis Anda tetap online, bahkan saat Anda offline.
          </h1>
          <p className="hero-rise mx-auto mt-6 max-w-xl text-lg text-text-soft lg:mx-0" style={{ "--rise-delay": "160ms" }}>
            PONCO-X menjawab WhatsApp pelanggan Anda otomatis — natural, hafal nama pelanggan, dan nggak
            pernah kehabisan giliran walau chat lagi ramai.
          </p>
          <div
            className="hero-rise mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            style={{ "--rise-delay": "240ms" }}
          >
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-amber px-7 py-3 font-semibold text-navy transition hover:brightness-110"
            >
              Konsultasi via WhatsApp
            </a>
            <a href="#harga" className="text-sm font-medium text-text-soft underline-offset-4 hover:underline">
              Lihat harga
            </a>
          </div>
        </div>

        <div className="hero-rise order-1 relative flex justify-center lg:order-2" style={{ "--rise-delay": "120ms" }}>
          <div
            className="pointer-events-none absolute h-[320px] w-[320px] rounded-full sm:h-[420px] sm:w-[420px]"
            style={{ background: "radial-gradient(circle, rgba(255,176,32,0.28), transparent 70%)" }}
          />
          <Image
            src={mascot}
            alt="Maskot PONCO-X, karakter mengenakan poncho oranye"
            width={603}
            height={808}
            priority
            className="relative w-[220px] drop-shadow-2xl sm:w-[280px]"
          />
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="border-t border-white/10 bg-navy-deep text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:py-20">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-4xl font-extrabold tracking-tight text-amber sm:text-5xl">{s.value}</p>
            <p className="mt-2 text-sm text-text-soft">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <header className="absolute inset-x-0 top-0 z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-paper">
        <Logo size={22} inkColor="#F5F6F8" />
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-white/25 px-4 py-2 text-sm font-medium text-paper transition hover:bg-white/10"
        >
          Chat Kami
        </a>
      </header>

      <Hero />
      <Stats />

      <section className="mx-auto max-w-5xl px-6 py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <h2 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
            Chat yang nggak terjawab adalah pelanggan yang pindah ke tempat lain.
          </h2>
          <ul className="flex flex-col gap-5 text-text-dark/75">
            <li className="border-t border-text-dark/10 pt-5">
              Chat numpuk pas lagi ramai, pelanggan nunggu lama buat dibales.
            </li>
            <li className="border-t border-text-dark/10 pt-5">
              Pertanyaan yang sama ditanya ulang-ulang, admin capek jawab manual.
            </li>
            <li className="border-t border-text-dark/10 pt-5">
              Chat masuk jam 11 malam, baru sempat dibales besok siang.
            </li>
            <li className="border-t border-text-dark/10 pt-5">
              Admin harus pegang HP terus, jadi nggak sempat kerja yang lain.
            </li>
          </ul>
        </div>
      </section>

      <section className="border-t border-text-dark/10 bg-navy text-paper">
        <div className="mx-auto max-w-5xl px-6 py-20 lg:py-28">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Yang dikerjain PONCO-X buat Anda</h2>
          <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.title} className="border-t border-white/15 pt-5">
                <h3 className="text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-text-soft">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20 lg:py-28">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Cara mulainya</h2>
        <div className="mt-10 grid gap-10 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title}>
              <span className="text-sm font-semibold text-amber">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-text-dark/70">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-text-dark/10 bg-navy text-paper" id="harga">
        <div className="mx-auto max-w-5xl px-6 py-20 lg:py-28">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Harga</h2>
          <p className="mt-2 max-w-xl text-text-soft">
            Harga awal, bisa menyesuaikan kebutuhan usaha Anda. Tambahan website promosi seperti contoh
            demo kami: +Rp 750.000.
          </p>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-white/10 lg:grid-cols-3">
            {pricing.map((tier) => (
              <div key={tier.name} className={`flex flex-col bg-navy p-8 ${tier.highlight ? "bg-navy-deep" : ""}`}>
                <h3 className="text-xl font-bold">{tier.name}</h3>
                <p className={`mt-4 text-3xl font-extrabold tracking-tight ${tier.highlight ? "text-amber" : ""}`}>
                  {tier.price}
                </p>
                <p className="text-xs text-text-soft">{tier.period}</p>
                <p className="mt-4 text-sm text-text-soft">{tier.desc}</p>
                <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-text-soft">
                  {tier.items.map((it) => (
                    <li key={it} className="border-t border-white/10 pt-3 first:border-t-0 first:pt-0">
                      {it}
                    </li>
                  ))}
                </ul>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-8 rounded-full px-5 py-2.5 text-center text-sm font-semibold transition ${
                    tier.highlight ? "bg-amber text-navy hover:brightness-110" : "border border-white/25 hover:bg-white/10"
                  }`}
                >
                  Tanya paket ini
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20 text-center lg:py-28">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Bukan cuma chatbot</h2>
        <p className="mx-auto mt-4 max-w-xl text-text-dark/75">
          Levcel.Corp juga bikin sistem lain sesuai kebutuhan usaha Anda — dari aplikasi kasir, website,
          sampai otomasi internal — dengan budget yang disesuaikan. Nggak harus modal besar buat mulai
          digital.
        </p>
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-block rounded-full bg-navy px-7 py-3 font-semibold text-paper transition hover:bg-navy-deep"
        >
          Diskusikan kebutuhan Anda
        </a>
      </section>

      <section className="border-t border-text-dark/10">
        <div className="mx-auto max-w-5xl px-6 py-20 lg:py-28">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Pertanyaan umum</h2>
          <div className="mt-8 flex flex-col">
            {faqs.map((f) => (
              <div key={f.q} className="border-t border-text-dark/10 py-6 first:border-t-0">
                <h3 className="font-bold">{f.q}</h3>
                <p className="mt-2 text-sm text-text-dark/70">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-navy-deep text-text-soft">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <Logo size={20} inkColor="#F5F6F8" />
          <div className="text-sm text-text-soft">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-paper">
              wa.me/{WA_NUMBER}
            </a>
            <span className="mx-2">·</span>
            <span>© {new Date().getFullYear()} Levcel.Corp</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
