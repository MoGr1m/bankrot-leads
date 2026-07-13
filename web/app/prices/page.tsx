import Link from "next/link";
import { ChevronRight, Coins } from "lucide-react";

export const metadata = {
  title: "Стоимость банкротства физлица — из чего складывается",
  description:
    "Из чего складывается полная стоимость банкротства физлица, что входит, что оплачивается отдельно и почему важно сравнивать полную смету.",
};

const INCLUDED = [
  "Анализ ситуации и подготовка документов",
  "Подготовка и подача заявления",
  "Сопровождение процедуры и взаимодействие с кредиторами",
];

const SEPARATE = [
  "Вознаграждение финансового управляющего (судебная процедура)",
  "Обязательные публикации сведений",
  "Госпошлина и почтовые расходы",
];

export default function PricesPage() {
  return (
    <div>
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 text-white">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 mb-5">
            <Coins size={22} />
          </span>
          <h1 className="text-3xl font-bold mb-3">Стоимость банкротства</h1>
          <p className="text-blue-50 max-w-2xl">
            Мы не публикуем фиксированную цену — она зависит от способа
            процедуры и сложности дела. Здесь — из чего она складывается.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-14 space-y-10">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-6">
            <h2 className="font-semibold mb-3">Обычно входит в услугу</h2>
            <ul className="space-y-2 text-sm text-slate-700 list-disc list-inside">
              {INCLUDED.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 p-6">
            <h2 className="font-semibold mb-3">Часто оплачивается отдельно</h2>
            <ul className="space-y-2 text-sm text-slate-700 list-disc list-inside">
              {SEPARATE.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 text-sm text-amber-900">
          <p className="font-medium mb-1">Как сравнивать</p>
          Сравнивайте полную итоговую стоимость, а не минимальный ежемесячный
          платёж «от N ₽ в месяц» — он не отражает реальную сумму. Уточняйте, что
          входит в цену, а что оплачивается сверху.
        </div>

        <div className="rounded-2xl bg-slate-50 p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <p className="flex-1 text-slate-600 text-sm">
            Хотите ориентировочный разбор по вашей ситуации?
          </p>
          <Link
            href="/tools/calculator-cost/"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white px-5 py-2.5 font-medium shrink-0"
          >
            Рассчитать
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
