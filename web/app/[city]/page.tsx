import Link from "next/link";
import { notFound } from "next/navigation";
import { CITIES, getCityBySlug, getOrganizations } from "@/lib/organizations";
import { Calculator } from "@/components/Calculator";
import { ARTICLES } from "@/lib/articles";

// Общие для всех городов блоки — этапы процедуры, плюсы/минусы, частые
// вопросы. Вынесены в константы прямо в файле страницы: контент короткий,
// специфичный только для этой страницы, отдельный модуль был бы избыточен
const PROCEDURE_STEPS = [
  "Бесплатная консультация с юристом — оценивает вашу ситуацию и подходящий вариант процедуры",
  "Подготовка и подача заявления — в суд (судебное банкротство) или в МФЦ (внесудебное)",
  "Ведение процедуры — юрист и, при судебном банкротстве, финансовый управляющий взаимодействуют с кредиторами",
  "Завершение процедуры — суд освобождает от дальнейшего исполнения оставшихся требований (кроме нескольких исключений по закону)",
];

const PROS_CONS = {
  pros: [
    "Законное прекращение начисления процентов и пеней после введения процедуры",
    "Кредиторы и коллекторы больше не вправе требовать оплату напрямую",
    "Освобождение от большинства оставшихся долгов по завершении процедуры",
  ],
  cons: [
    "Часть имущества (кроме единственного не заложенного жилья) может быть реализована для расчётов с кредиторами",
    "Процедура занимает время — от нескольких месяцев до года и больше в зависимости от сложности дела",
    "После банкротства сложнее получить кредит в течение нескольких лет",
  ],
};

const FAQ = [
  {
    question: "Сколько стоит банкротство физлица?",
    answer:
      "Стоимость зависит от способа (судебное или внесудебное) и сложности дела. Точную цену назовёт юрист после бесплатной консультации — на этом сайте мы не берём предоплату и не гарантируем фиксированную цену заранее.",
  },
  {
    question: "Спишут ли все долги?",
    answer:
      "Не все — например, алименты и возмещение вреда жизни и здоровью банкротство не списывает в любом случае. Подробный разбор — в статье «Что заберут, а что оставят при банкротстве».",
  },
  {
    question: "Заберут ли квартиру?",
    answer:
      "Единственное жильё, если оно не в ипотеке, обычно защищено законом. Ипотечная недвижимость — исключение, подробнее в наших статьях.",
  },
];

export function generateStaticParams() {
  return CITIES.map((city) => ({ city: city.slug }));
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  const organizations = getOrganizations(city);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-10">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          Банкротство физлиц в городе {city.title}
        </h1>
        <p className="text-slate-600">
          Проверьте бесплатно, подходите ли вы под процедуру списания долгов,
          и получите звонок от юриста, который специализируется на
          банкротстве физлиц в {city.title}.
        </p>
      </div>

      <Calculator citySlug={city.slug} />

      <div>
        <h2 className="text-lg font-semibold mb-4">
          Юридические фирмы в {city.title} ({organizations.length})
        </h2>
        {organizations.length === 0 ? (
          <p className="text-slate-500 text-sm">
            Список пока в процессе сбора.
          </p>
        ) : (
          <ul className="space-y-3">
            {organizations.map((org) => (
              <li
                key={org.id}
                className="rounded-lg border border-slate-200 p-4 hover:border-slate-400"
              >
                <Link href={`/${city.slug}/${org.slug}`} className="block">
                  <p className="font-medium">{org.name}</p>
                  {org.address && (
                    <p className="text-sm text-slate-500">{org.address}</p>
                  )}
                  {org.rating !== null && (
                    <p className="text-sm text-slate-500">
                      Рейтинг: {org.rating} ({org.reviewCount} отзывов) — по
                      данным 2ГИС
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Как проходит процедура</h2>
        <ol className="space-y-3 list-decimal list-inside text-slate-600">
          {PROCEDURE_STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold mb-3">Плюсы</h2>
          <ul className="space-y-2 text-slate-600 text-sm list-disc list-inside">
            {PROS_CONS.pros.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-3">Минусы</h2>
          <ul className="space-y-2 text-slate-600 text-sm list-disc list-inside">
            {PROS_CONS.cons.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
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

      <div>
        <h2 className="text-lg font-semibold mb-4">Читайте также</h2>
        <ul className="space-y-2">
          {ARTICLES.slice(0, 3).map((article) => (
            <li key={article.slug}>
              <Link
                href={`/articles/${article.slug}`}
                className="text-sm underline text-slate-600 hover:text-slate-900"
              >
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
