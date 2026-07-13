import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Scale } from "lucide-react";
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
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto max-w-5xl px-4 py-4 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-lg text-slate-900"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 text-white">
                <Scale size={18} strokeWidth={2.5} />
              </span>
              Списание долгов
            </Link>
            <nav className="flex gap-3 sm:gap-5 text-xs sm:text-sm text-slate-600">
              <Link href="/podbor-kompanii" className="hover:text-blue-700">
                Подбор
              </Link>
              <Link href="/services" className="hover:text-blue-700">
                Услуги
              </Link>
              <Link href="/situations" className="hover:text-blue-700">
                Ситуации
              </Link>
              <Link href="/articles" className="hover:text-blue-700">
                Статьи
              </Link>
              <Link href="/about" className="hover:text-blue-700">
                О нас
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-slate-200 bg-slate-50 mt-16">
          <div className="mx-auto max-w-5xl px-4 py-10 grid gap-8 sm:grid-cols-3 text-sm">
            <div>
              <p className="flex items-center gap-2 font-semibold text-slate-900 mb-2">
                <Scale size={16} className="text-blue-600" />
                Списание долгов
              </p>
              <p className="text-slate-500">
                Бесплатный подбор юриста по банкротству физлиц в вашем
                городе.
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-900 mb-2">Сайт</p>
              <ul className="space-y-1 text-slate-500">
                <li>
                  <Link href="/podbor-kompanii" className="hover:text-blue-700">
                    Подбор компании
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-blue-700">
                    Услуги
                  </Link>
                </li>
                <li>
                  <Link href="/situations" className="hover:text-blue-700">
                    Ситуации
                  </Link>
                </li>
                <li>
                  <Link href="/for-companies" className="hover:text-blue-700">
                    Для компаний
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-slate-900 mb-2">Прозрачность</p>
              <ul className="space-y-1 text-slate-500">
                <li>
                  <Link href="/methodology" className="hover:text-blue-700">
                    Методология
                  </Link>
                </li>
                <li>
                  <Link
                    href="/verification-policy"
                    className="hover:text-blue-700"
                  >
                    Как проверяем компании
                  </Link>
                </li>
                <li>
                  <Link href="/review-policy" className="hover:text-blue-700">
                    Отзывы и рейтинги
                  </Link>
                </li>
                <li>
                  <Link
                    href="/advertising-disclosure"
                    className="hover:text-blue-700"
                  >
                    Раскрытие о рекламе
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-blue-700">
                    Политика обработки ПД
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200">
            <div className="mx-auto max-w-5xl px-4 py-4 text-xs text-slate-400">
              Сайт носит информационный характер и не является юридической
              консультацией. Мы не гарантируем результат процедуры
              банкротства.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
