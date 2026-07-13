"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Info } from "lucide-react";

// Калькулятор НЕ показывает точную цену в рублях: реальная стоимость зависит
// от множества факторов и меняется, выдумывать цифры нельзя (раздел 20.5 ТЗ).
// Вместо этого даёт вероятный маршрут процедуры, структуру затрат и факторы,
// которые требуют анализа юриста — с призывом получить сметы через подбор
// (раздел 10.9: «не гарантированный вывод, а какие варианты проверить»).

const COST_ITEMS = [
  "Услуги юристов по сопровождению процедуры",
  "Вознаграждение финансового управляющего (при судебной процедуре)",
  "Обязательные публикации сведений",
  "Госпошлина и почтовые расходы",
];

export function CostCalculator() {
  const [debt, setDebt] = useState("250-500");
  const [income, setIncome] = useState("yes");
  const [property, setProperty] = useState("edinstvennoe");
  const [pristavy, setPristavy] = useState("no");
  const [shown, setShown] = useState(false);

  // Эвристика маршрута — только как ориентир, не как решение.
  // Внесудебное реально применимо при малом долге, без дохода и имущества,
  // с оконченным исполнительным производством. Иначе — судебное.
  const suggestsVnesudebnoe =
    debt === "less-250" &&
    income === "no" &&
    property === "net" &&
    pristavy === "okoncheno";

  const factors: string[] = [];
  if (property === "ipoteka")
    factors.push("Ипотека или залог — заложенное имущество может быть реализовано");
  if (property === "drugoe")
    factors.push("Дополнительная недвижимость или транспорт — влияют на конкурсную массу");
  if (income === "yes")
    factors.push("Официальный доход — влияет на вариант процедуры");
  if (pristavy === "vzyskivayut")
    factors.push("Активные исполнительные производства — уточните их состав");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-xl shadow-blue-900/5 space-y-4">
        <Field label="Примерная сумма долга">
          <Select
            value={debt}
            onChange={setDebt}
            options={[
              ["less-250", "до 250 000 ₽"],
              ["250-500", "250 000 – 500 000 ₽"],
              ["500-1500", "500 000 – 1 500 000 ₽"],
              ["more-1500", "более 1 500 000 ₽"],
            ]}
          />
        </Field>
        <Field label="Есть официальный доход?">
          <Select
            value={income}
            onChange={setIncome}
            options={[
              ["yes", "Да"],
              ["no", "Нет"],
            ]}
          />
        </Field>
        <Field label="Имущество">
          <Select
            value={property}
            onChange={setProperty}
            options={[
              ["edinstvennoe", "Единственное жильё"],
              ["ipoteka", "Ипотека или залог"],
              ["drugoe", "Другая недвижимость / авто"],
              ["net", "Ничего из этого"],
            ]}
          />
        </Field>
        <Field label="Исполнительное производство">
          <Select
            value={pristavy}
            onChange={setPristavy}
            options={[
              ["no", "Нет"],
              ["vzyskivayut", "Приставы взыскивают"],
              ["okoncheno", "Производство окончено"],
            ]}
          />
        </Field>
        <button
          type="button"
          onClick={() => setShown(true)}
          className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 font-medium shadow-lg shadow-blue-900/20 hover:brightness-105"
        >
          Показать разбор
        </button>
      </div>

      {shown && (
        <div className="space-y-5 rounded-2xl border border-slate-200 p-6">
          <div>
            <h2 className="font-bold mb-1">Вероятный маршрут</h2>
            <p className="text-slate-700">
              {suggestsVnesudebnoe
                ? "Возможно подходит внесудебное банкротство через МФЦ (без суда и госпошлины)."
                : "Скорее всего потребуется судебное банкротство через арбитражный суд."}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Это ориентир, а не решение. Применимость определяет юрист после
              анализа.
            </p>
          </div>

          <div>
            <h2 className="font-bold mb-2">Из чего складывается стоимость</h2>
            <ul className="space-y-1.5 text-sm text-slate-600 list-disc list-inside">
              {COST_ITEMS.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            <p className="text-xs text-slate-400 mt-2">
              Сравнивайте полную смету, а не минимальный ежемесячный платёж.
            </p>
          </div>

          {factors.length > 0 && (
            <div>
              <h2 className="font-bold mb-2">Что требует анализа</h2>
              <ul className="space-y-1.5 text-sm text-slate-600 list-disc list-inside">
                {factors.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-xl bg-slate-50 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="flex-1 text-sm text-slate-600">
              Точную смету назовут компании после бесплатной консультации.
            </p>
            <Link
              href="/podbor-kompanii/quiz/"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white px-5 py-2.5 font-medium shrink-0"
            >
              Получить сметы
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      )}

      <p className="flex items-start gap-1.5 text-xs text-slate-400">
        <Info size={14} className="shrink-0 mt-0.5" />
        Расчёт носит ориентировочный характер и не является юридической
        консультацией или гарантией стоимости.
      </p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-slate-600">{label}</label>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
    >
      {options.map(([v, l]) => (
        <option key={v} value={v}>
          {l}
        </option>
      ))}
    </select>
  );
}
