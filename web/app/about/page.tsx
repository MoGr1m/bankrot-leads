import { Database, Info, ShieldAlert, Users } from "lucide-react";

export const metadata = {
  title: "О нас — Списание долгов",
};

const SECTIONS = [
  {
    icon: Users,
    title: "Кто мы",
    text: "Мы не юридическая фирма и не оказываем услуги по банкротству сами. Сайт помогает людям с долгами быстро найти юриста, который специализируется на банкротстве физлиц в их городе — и передаёт заявку выбранной юрфирме.",
  },
  {
    icon: Database,
    title: "Как формируется список юрфирм",
    text: "Список юридических компаний по каждому городу собран из открытых данных 2ГИС — названия, адреса и рейтинги на момент сбора принадлежат этому источнику. Мы не проверяли квалификацию сотрудников каждой компании и не несём ответственности за качество оказанных ими услуг — рекомендуем убедиться в этом самостоятельно на бесплатной консультации, прежде чем заключать договор.",
  },
  {
    icon: ShieldAlert,
    title: "Важная оговорка",
    text: "Материалы сайта носят информационный характер и не являются юридической консультацией. Мы не гарантируем результат процедуры банкротства — итог зависит от конкретной ситуации и решения суда.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 text-white">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 mb-5">
            <Info size={22} />
          </span>
          <h1 className="text-3xl font-bold">О нас</h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-14 space-y-8">
        {SECTIONS.map((section) => (
          <div
            key={section.title}
            className="flex gap-4 rounded-2xl border border-slate-200 p-6"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <section.icon size={18} />
            </span>
            <div>
              <h2 className="font-semibold mb-2">{section.title}</h2>
              <p className="text-slate-600 text-sm">{section.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
