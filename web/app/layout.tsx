import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

// Кириллица нужна отдельно указывать в subsets, иначе шрифт не подхватит русский текст
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Списание долгов — подбор юриста по банкротству физлиц",
  description:
    "Бесплатно проверьте, подходите ли вы под процедуру банкротства, и найдите проверенного юриста в своём городе.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <header className="border-b border-slate-200">
          <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="font-semibold text-lg">
              Списание долгов
            </Link>
            <nav className="flex gap-4 text-sm text-slate-600">
              <Link href="/how-it-works">Как это работает</Link>
              <Link href="/articles">Статьи</Link>
              <Link href="/about">О нас</Link>
              <Link href="/privacy">Политика ПД</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200 mt-16">
          <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-500">
            <p>
              Сайт носит информационный характер и не является юридической
              консультацией. Мы не гарантируем результат процедуры банкротства.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
