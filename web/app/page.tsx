import Link from "next/link";
import { CITIES } from "@/lib/organizations";

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

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 space-y-14">
      <div>
        <h1 className="text-3xl font-bold mb-4">
          Списание долгов через банкротство физлиц
        </h1>
        <p className="text-slate-600 mb-6">
          Бесплатно узнайте, подходите ли вы под процедуру, и найдите
          проверенного юриста в своём городе.
        </p>
        <a
          href="#cities"
          className="inline-block rounded-md bg-slate-900 text-white px-5 py-2.5 font-medium"
        >
          Выбрать город и начать проверку
        </a>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Что такое банкротство</h2>
        <p className="text-slate-600 text-sm">
          Банкротство физического лица — законная процедура списания долгов,
          которую регулирует федеральный закон «О несостоятельности
          (банкротстве)». Она помогает тем, кто объективно не может
          расплатиться с кредиторами: после введения процедуры перестают
          начисляться проценты и пени, а требования кредиторов идут через
          юриста или финансового управляющего, а не напрямую к должнику.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Как это работает</h2>
        <ol className="space-y-2 text-slate-600 text-sm list-decimal list-inside">
          <li>Выбираете свой город и заполняете короткую форму на сайте</li>
          <li>Юрист из вашего города перезванивает для бесплатной консультации</li>
          <li>Вы решаете, стоит ли начинать процедуру, и на каких условиях</li>
        </ol>
      </div>

      <div id="cities">
        <h2 className="text-lg font-semibold mb-3">Выберите город</h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {CITIES.map((city) => (
            <li key={city.slug}>
              <Link
                href={`/${city.slug}`}
                className="block rounded-lg border border-slate-200 px-4 py-3 text-center hover:border-slate-400"
              >
                {city.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Частые вопросы</h2>
        <div className="space-y-4">
          {FAQ.map((item) => (
            <div key={item.question}>
              <p className="font-medium">{item.question}</p>
              <p className="text-sm text-slate-600 mt-1">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
