import Link from "next/link";
import {
  ChevronRight,
  ClipboardCheck,
  FileText,
  PhoneCall,
  Workflow,
} from "lucide-react";

export const metadata = {
  title: "Как это работает — Списание долгов",
};

const STEPS = [
  {
    icon: FileText,
    title: "Заполняете форму на сайте",
    text: "Указываете примерную сумму долга, наличие официального дохода и телефон для связи. Это займёт меньше минуты и ни к чему не обязывает.",
  },
  {
    icon: PhoneCall,
    title: "Юрист перезванивает",
    text: "С вами связывается юрист из выбранного города (или конкретной юрфирмы, если вы оставили заявку с её страницы) и проводит бесплатную консультацию.",
  },
  {
    icon: ClipboardCheck,
    title: "Вы получаете оценку ситуации",
    text: "Юрист объясняет, подходит ли вам судебная или внесудебная процедура, какие документы понадобятся и сколько это будет стоить.",
  },
  {
    icon: Workflow,
    title: "Решаете, продолжать ли",
    text: "Вы ничего не должны сайту и не обязаны заключать договор — решение остаётся за вами.",
  },
];

export default function HowItWorksPage() {
  return (
    <div>
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 text-white">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 mb-5">
            <Workflow size={22} />
          </span>
          <h1 className="text-3xl font-bold mb-3">Как это работает</h1>
          <p className="text-blue-50 max-w-xl">
            Сайт помогает быстро выйти на юриста по банкротству физлиц в
            вашем городе. Вот что происходит после того, как вы оставляете
            заявку.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-14 space-y-8">
        <div className="space-y-4">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="flex gap-4 rounded-2xl border border-slate-200 p-6"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white">
                <step.icon size={20} />
              </span>
              <div>
                <p className="text-xs font-semibold text-blue-600 mb-1">
                  Шаг {index + 1}
                </p>
                <h2 className="font-semibold mb-1">{step.title}</h2>
                <p className="text-slate-600 text-sm">{step.text}</p>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 font-medium shadow-lg shadow-blue-900/20 hover:brightness-105"
        >
          Выбрать город и начать
          <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );
}
