import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Building2,
  ChevronRight,
  ListChecks,
  MapPin,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
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
    <div>
      {/* Хиро-секция в фирменных цветах — как на главной, для единого стиля */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 text-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium mb-5">
            <MapPin size={14} />
            {city.title}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            Банкротство физлиц в городе {city.title}
          </h1>
          <p className="text-blue-50 text-lg max-w-2xl">
            Проверьте бесплатно, подходите ли вы под процедуру списания
            долгов, и получите звонок от юриста, который специализируется на
            банкротстве физлиц в {city.title}.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-14 space-y-16">
        {/* Карточка калькулятора визуально приподнята над хиро-секцией */}
        <div className="-mt-24 sm:-mt-28">
          <Calculator citySlug={city.slug} />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Building2 size={22} className="text-blue-600" />
            Юридические фирмы в {city.title} ({organizations.length})
          </h2>
          {organizations.length === 0 ? (
            <p className="text-slate-500 text-sm">
              Список пока в процессе сбора.
            </p>
          ) : (
            <ul className="space-y-3">
              {organizations.map((org) => (
                <li key={org.id}>
                  <Link
                    href={`/${city.slug}/${org.slug}`}
                    className="group flex items-start gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:shadow-md hover:shadow-blue-900/5"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                      <Building2 size={18} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-medium">{org.name}</span>
                      {org.address && (
                        <span className="block text-sm text-slate-500">
                          {org.address}
                        </span>
                      )}
                      {org.rating !== null && (
                        <span className="mt-1 inline-flex items-center gap-1 text-sm text-slate-500">
                          <Star
                            size={14}
                            className="fill-amber-400 text-amber-400"
                          />
                          {org.rating} ({org.reviewCount} отзывов) — по
                          данным 2ГИС
                        </span>
                      )}
                    </span>
                    <ChevronRight
                      size={18}
                      className="mt-2 shrink-0 text-slate-300 group-hover:text-blue-500"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <ListChecks size={22} className="text-blue-600" />
            Как проходит процедура
          </h2>
          <ol className="space-y-4">
            {PROCEDURE_STEPS.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 font-semibold text-sm">
                  {index + 1}
                </span>
                <span className="text-slate-600 pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <h2 className="font-semibold mb-3 flex items-center gap-2 text-emerald-800">
              <ThumbsUp size={18} />
              Плюсы
            </h2>
            <ul className="space-y-2 text-emerald-900 text-sm list-disc list-inside">
              {PROS_CONS.pros.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="font-semibold mb-3 flex items-center gap-2 text-amber-800">
              <ThumbsDown size={18} />
              Минусы
            </h2>
            <ul className="space-y-2 text-amber-900 text-sm list-disc list-inside">
              {PROS_CONS.cons.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
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

        <div>
          <h2 className="text-2xl font-bold mb-4">Читайте также</h2>
          <ul className="space-y-2">
            {ARTICLES.slice(0, 3).map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/articles/${article.slug}`}
                  className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline"
                >
                  {article.title}
                  <ChevronRight size={14} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
