import Link from "next/link";
import {
  BadgeCheck,
  ChevronRight,
  ClipboardList,
  ListChecks,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "Подбор компании по банкротству — ответьте на 7 вопросов",
  description:
    "Ответьте на 7 вопросов о вашей ситуации. Покажем возможные варианты процедуры и компании в вашем городе с проверенными сведениями. Бесплатно, без обязательств.",
};

const STAGES = [
  {
    icon: ClipboardList,
    title: "7 коротких вопросов",
    text: "О сумме и видах долга, доходе, имуществе. Телефон не потребуется до результата.",
  },
  {
    icon: ListChecks,
    title: "Возможные варианты",
    text: "Покажем, какие пути стоит проверить и какие вопросы обсудить с юристом.",
  },
  {
    icon: BadgeCheck,
    title: "Компании в вашем городе",
    text: "С честной пометкой, какие сведения о каждой компании проверены, а какие нет.",
  },
];

export default function PodborLandingPage() {
  return (
    <div>
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 text-white">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:py-24">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium mb-6">
            <ShieldCheck size={14} />
            Бесплатно и без обязательств
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            Проверьте ситуацию и подберите компанию по банкротству
          </h1>
          <p className="text-blue-50 text-lg mb-8">
            Ответьте на 7 вопросов. Покажем возможные варианты процедуры,
            ключевые риски и компании в вашем городе с проверенными сведениями.
          </p>
          <Link
            href="/podbor-kompanii/quiz/"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-6 py-3 font-medium text-blue-700 shadow-lg transition hover:bg-blue-50"
          >
            Начать подбор
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Что вы получите</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {STAGES.map((s) => (
            <div key={s.title} className="rounded-2xl border border-slate-200 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white mb-4">
                <s.icon size={20} />
              </span>
              <p className="font-semibold mb-1">{s.title}</p>
              <p className="text-sm text-slate-600">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">
          <p className="font-medium text-slate-900 mb-1">Честно о данных</p>
          Реквизиты компаний (ИНН/ОГРН) мы сопоставляем с ЕГРЮЛ автоматически и
          отмечаем, где это удалось. Специализацию под вашу ситуацию всегда
          уточняйте на бесплатной консультации — это не заменяет анализ юриста.
        </div>

        <Link
          href="/podbor-kompanii/quiz/"
          className="mt-8 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 font-medium shadow-lg shadow-blue-900/20 hover:brightness-105"
        >
          Начать подбор
          <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );
}
