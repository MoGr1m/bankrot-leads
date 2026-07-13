import Link from "next/link";
import { Info } from "lucide-react";
import { getCityBySlug, getConfidence, getVerification } from "@/lib/organizations";
import { matchCompanies, type QuizAnswers } from "@/lib/matching";
import { describeAnswers } from "@/lib/quiz-questions";
import {
  SelectionResult,
  type ResultCompany,
} from "@/components/SelectionResult";

// Страница результата подбора не индексируется (раздел 9 ТЗ — noindex):
// это персональная выдача под конкретные ответы.
export const metadata = {
  title: "Предварительный результат подбора",
  robots: { index: false, follow: false },
};

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const getParam = (key: string): string | undefined => {
    const v = params[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const citySlug = getParam("city") ?? "";
  const city = getCityBySlug(citySlug);

  // Без корректного города подбор невозможен — предлагаем пройти заново
  if (!city) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-3">Не удалось построить подбор</h1>
        <p className="text-slate-600 mb-6">
          Похоже, анкета заполнена не полностью. Пройдите подбор заново.
        </p>
        <Link
          href="/podbor-kompanii/quiz/"
          className="inline-block rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 font-medium"
        >
          Пройти подбор
        </Link>
      </div>
    );
  }

  const answers: QuizAnswers = {
    city: citySlug,
    debtAmount: getParam("debtAmount") ?? "",
    debtTypes: (getParam("debtTypes") ?? "").split(",").filter(Boolean),
    overdue: getParam("overdue") ?? "",
    income: getParam("income") ?? "",
    property: (getParam("property") ?? "").split(",").filter(Boolean),
    deals: getParam("deals") ?? "",
  };

  const matched = matchCompanies(answers, city);
  const situation = describeAnswers(getParam);

  const companies: ResultCompany[] = matched.map((m) => ({
    name: m.org.name,
    slug: m.org.slug,
    reasons: m.reasons,
    verificationLabel: getVerification(m.org).label,
    confidenceLabel: getConfidence(m.org).label,
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          Предварительный результат по вашей ситуации
        </h1>
        <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
          <Info size={16} className="shrink-0 mt-0.5" />
          <p>
            Это не решение суда и не юридическое заключение. Точную оценку даст
            юрист на консультации. Компании подобраны по вашему городу и
            достоверности данных — специализацию под вашу ситуацию уточните при
            звонке.
          </p>
        </div>
      </div>

      {/* Резюме ситуации (что уйдёт выбранным компаниям) */}
      <div className="rounded-2xl border border-slate-200 p-6">
        <h2 className="font-semibold mb-3">Ваша ситуация</h2>
        <ul className="space-y-1.5 text-sm text-slate-600">
          {situation.split("\n").map((line) => (
            <li key={line}>{line.replace(/^•\s*/, "")}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-1">
          Компании в городе {city.title}
        </h2>
        <p className="text-sm text-slate-500 mb-5">
          Отметьте до трёх компаний — контакт получат только они.
        </p>
        {companies.length === 0 ? (
          <p className="text-slate-500">
            Пока нет компаний для показа в этом городе.
          </p>
        ) : (
          <SelectionResult
            companies={companies}
            citySlug={city.slug}
            cityTitle={city.title}
            situation={situation}
          />
        )}
      </div>
    </div>
  );
}
