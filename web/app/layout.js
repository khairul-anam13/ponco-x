import { Manrope } from "next/font/google";
import "./globals.css";

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "PONCO-X — Chatbot WhatsApp AI untuk UMKM",
  description:
    "PONCO-X jagain WhatsApp bisnis Anda 24 jam: balasan natural, inget pelanggan, dan nggak keteteran pas chat lagi rame. Dibangun oleh Levcel.Corp.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${sans.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
