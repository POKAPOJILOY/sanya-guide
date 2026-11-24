import type { Metadata } from "next";
import { Comfortaa, Inter, Archivo_Narrow, PT_Sans_Narrow } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const display = Comfortaa({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  variable: "--font-display",
});

const sans = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

// У Archivo Narrow нет кириллицы: кириллические глифы достраивает PT Sans Narrow
const narrow = Archivo_Narrow({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-narrow",
});

const narrowAlt = PT_Sans_Narrow({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  variable: "--font-narrow-alt",
});

const title = "Санья Гид — Хайнань: курс-путеводитель";
const description =
  "Хайнань — курс-путеводитель: интерактивная карта и честные гайды, приложения, Alipay, WeChat и места, которые любят сами китайцы. Как подруга рассказывает — без страха и вопросов.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: "Санья Гид",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${display.variable} ${sans.variable} ${narrow.variable} ${narrowAlt.variable}`}
    >
      <body className="bg-bg font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
