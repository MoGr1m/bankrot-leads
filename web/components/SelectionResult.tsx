"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Info, PhoneCall } from "lucide-react";
import { submitSelectionLead, type LeadFormState } from "@/lib/leads";

// Данные одной подобранной компании, приходят с сервера (страница результата)
export type ResultCompany = {
  name: string;
  slug: string;
  reasons: string[];
  verificationLabel: string;
  confidenceLabel: string;
};

const initialState: LeadFormState = { status: "idle" };
const MAX_SELECTED = 3; // по ТЗ 10.14 — не более трёх получателей заявки

export function SelectionResult({
  companies,
  citySlug,
  cityTitle,
  situation,
}: {
  companies: ResultCompany[];
  citySlug: string;
  cityTitle: string;
  situation: string;
}) {
  const [state, formAction, pending] = useActionState(
    submitSelectionLead,
    initialState
  );
  const [selected, setSelected] = useState<string[]>([]);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 flex flex-col items-center text-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
          <CheckCircle2 size={26} />
        </span>
        <p className="font-medium text-emerald-800">{state.message}</p>
      </div>
    );
  }

  function toggle(name: string) {
    setSelected((prev) => {
      if (prev.includes(name)) return prev.filter((n) => n !== name);
      if (prev.length >= MAX_SELECTED) return prev; // лимит 3
      return [...prev, name];
    });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {companies.map((c) => {
          const checked = selected.includes(c.name);
          const disabled = !checked && selected.length >= MAX_SELECTED;
          return (
            <label
              key={c.slug}
              className={`block rounded-2xl border p-5 transition cursor-pointer ${
                checked
                  ? "border-blue-500 bg-blue-50"
                  : disabled
                    ? "border-slate-200 opacity-50 cursor-not-allowed"
                    : "border-slate-200 hover:border-blue-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 accent-blue-600"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggle(c.name)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{c.name}</span>
                    <span className="text-xs rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                      {c.verificationLabel}
                    </span>
                    <span className="text-xs rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                      {c.confidenceLabel}
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600">
                    {c.reasons.map((r) => (
                      <li key={r} className="flex gap-1.5">
                        <span className="text-blue-500">·</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/${citySlug}/${c.slug}`}
                    className="mt-2 inline-block text-sm text-blue-700 hover:underline"
                  >
                    Подробнее о компании →
                  </Link>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {/* Форма передачи заявки выбранным компаниям */}
      <form
        action={formAction}
        className="rounded-2xl border border-blue-100 bg-white p-6 shadow-xl shadow-blue-900/5 space-y-4"
      >
        <input type="hidden" name="cityTitle" value={cityTitle} />
        <input type="hidden" name="situation" value={situation} />
        <input type="hidden" name="companies" value={selected.join("; ")} />

        <p className="font-semibold">
          Выбрано компаний: {selected.length} из {MAX_SELECTED}
        </p>
        <p className="text-sm text-slate-500">
          Контакт получат только выбранные вами компании. Другим организациям
          данные не передаются.
        </p>

        <div className="space-y-1">
          <label className="text-sm text-slate-600" htmlFor="phone">
            Телефон для связи
          </label>
          <div className="relative">
            <PhoneCall
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="+7 900 000-00-00"
              className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <label className="flex items-start gap-2 text-xs text-slate-500">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-0.5 accent-blue-600"
          />
          <span>
            Согласен(на) на передачу имени, телефона и ответов анкеты выбранным
            компаниям и с{" "}
            <Link href="/privacy" className="underline">
              политикой обработки персональных данных
            </Link>
          </span>
        </label>

        {state.status === "error" && (
          <p className="text-sm text-red-600">{state.message}</p>
        )}

        <button
          type="submit"
          disabled={pending || selected.length === 0}
          className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 font-medium shadow-lg shadow-blue-900/20 transition hover:brightness-105 disabled:opacity-50"
        >
          {pending ? "Отправляем..." : "Отправить заявку выбранным компаниям"}
        </button>

        <p className="flex items-start gap-1.5 text-xs text-slate-400">
          <Info size={14} className="shrink-0 mt-0.5" />
          Это не юридическая консультация и не гарантия результата — оценку вашей
          ситуации даст юрист после звонка.
        </p>
      </form>
    </div>
  );
}
