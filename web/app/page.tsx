import Link from "next/link";
import {
  BadgeCheck,
  ChevronRight,
  Gavel,
  MapPin,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";
import { CITIES, getOrganizations } from "@/lib/organizations";

// Общие для сайта частые вопросы — отдельно от вопросов на странице города
// (там вопросы больше про саму процедуру, здесь — про то, как работает сайт)
const FAQ = [
  {
    question: "Это юридическая компания?",
    answer:
      "Нет, мы не оказываем юридические услуги напрямую. Мы собираем список юрфирм по вашему городу и передаём вашу заявку тем, кто специализируется на банкротстве физлиц — дальше вы общаетесь с юристом напрямую.",
  },
  {
    question: "Сколько это стоит?",
    answer:
      "Оставить заявку на сайте бесплатно. Стоимость услуг конкретной юрфирмы обсуждается напрямую с юристом на консультации.",
  },
  {
    question: "Мой город не в списке — что делать?",
    answer:
      "Сейчас сайт работает в трёх городах, список постепенно расширяется. Если вашего города пока нет, возвращайтесь позже.",
  },
];

const HOW_IT_WORKS = [
  {
    icon: PhoneCall,
    title: "Оставляете заявку",
    text: "Выбираете свой город и заполняете короткую форму — это займёт меньше минуты",
  },
  {
    icon: Gavel,
    title: "Юрист перезванивает",
    text: "Специалист из вашего города проводит бесплатную консультацию",
  },
  {
    icon: BadgeCheck,
    title: "Принимаете решение",
    text: "Оцениваете предложение и решаете, начинать ли процедуру",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Хиро-секция с градиентным фоном — главный визуальный акцент страницы */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 text-white">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium mb-6">
              <ShieldCheck size={14} />
              Бесплатно и без обязательств
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
              Списание долгов через банкротство физлиц
            </h1>
            <p className="text-blue-50 text-lg mb-8">
              Бесплатно узнайте, подходите ли вы под процедуру, и найдите
              проверенного юриста в своём городе.
            </p>
            <a
              href="#cities"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-6 py-3 font-medium text-blue-700 shadow-lg transition hover:bg-blue-50"
            >
              Выбрать город и начать проверку
              <ChevronRight size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16 space-y-20">
        <div>
          <h2 className="text-2xl font-bold mb-3">Что такое банкротство</h2>
          <p className="text-slate-600 max-w-2xl">
            Банкротство физического лица — законная процедура списания
            долгов, которую регулирует федеральный закон «О
            несостоятельности (банкротстве)». Она помогает тем, кто
            объективно не может расплатиться с кредиторами: после введения
            процедуры перестают начисляться проценты и пени, а требования
            кредиторов идут через юриста или финансового управляющего, а не
            напрямую к должнику.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-8">Как это работает</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step, index) => (
              <div
                key={step.title}
                className="relative rounded-2xl border border-slate-200 p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white mb-4">
                  <step.icon size={20} />
                </span>
                <p className="text-xs font-semibold text-blue-600 mb-1">
                  Шаг {index + 1}
                </p>
                <p className="font-semibold mb-1">{step.title}</p>
                <p className="text-sm text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="cities" className="scroll-mt-20">
          <h2 className="text-2xl font-bold mb-8">Выберите город</h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {CITIES.map((city) => {
              const organizationsCount = getOrganizations(city).length;
              return (
                <li key={city.slug}>
                  <Link
                    href={`/${city.slug}`}
                    className="group flex flex-col gap-3 rounded-2xl border border-slate-200 p-6 transition hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/5"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                      <MapPin size={18} />
                    </span>
                    <span className="font-semibold text-lg">{city.title}</span>
                    <span className="text-sm text-slate-500">
                      {organizationsCount} юрфирм
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Частые вопросы</h2>
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
            {FAQ.map((item) => (
              <details key={item.question} className="group p-5">
                <summary className="flex cursor-pointer items-center justify-between font-medium marker:content-none">
                  {item.question}
                  <ChevronRight
                    size={18}
                    className="shrink-0 text-slate-400 transition group-open:rotate-90"
                  />
                </summary>
                <p className="text-sm text-slate-600 mt-3">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
