"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CheckCircle2, PhoneCall, ShieldCheck } from "lucide-react";
import { submitLead, type LeadFormState } from "@/lib/leads";

const initialState: LeadFormState = { status: "idle" };

export function Calculator({
  citySlug,
  companyName,
}: {
  citySlug: string;
  // Указывается только на странице профиля юрфирмы — тогда заявка
  // адресная, а не общая по городу
  companyName?: string;
}) {
  const [state, formAction, pending] = useActionState(submitLead, initialState);

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

  return (
    <form
      action={formAction}
      className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-6 sm:p-8 space-y-5 shadow-xl shadow-blue-900/5"
    >
      {/* Цветная полоса сверху карточки — визуальный акцент бренда */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 to-teal-500" />

      <input type="hidden" name="city" value={citySlug} />
      {companyName && (
        <input type="hidden" name="companyName" value={companyName} />
      )}

      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <ShieldCheck size={20} />
        </span>
        <p className="font-semibold text-lg leading-snug">
          {companyName
            ? `Оставить заявку в «${companyName}»`
            : "Бесплатно узнайте, подходите ли вы под процедуру банкротства"}
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-sm text-slate-600" htmlFor="debtAmount">
          Примерная сумма долга
        </label>
        <select
          id="debtAmount"
          name="debtAmount"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          defaultValue="250000-500000"
        >
          <option value="менее 250 000">до 250 000 ₽</option>
          <option value="250000-500000">250 000 – 500 000 ₽</option>
          <option value="500000-1500000">500 000 – 1 500 000 ₽</option>
          <option value="более 1500000">более 1 500 000 ₽</option>
        </select>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-slate-600">Есть ли у вас официальный доход?</p>
        <div className="flex gap-3">
          <label className="flex-1 flex items-center justify-center gap-2 text-sm rounded-lg border border-slate-300 px-3 py-2.5 cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700">
            <input
              type="radio"
              name="hasIncome"
              value="yes"
              defaultChecked
              className="accent-blue-600"
            />
            Да
          </label>
          <label className="flex-1 flex items-center justify-center gap-2 text-sm rounded-lg border border-slate-300 px-3 py-2.5 cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700">
            <input type="radio" name="hasIncome" value="no" className="accent-blue-600" />
            Нет
          </label>
        </div>
      </div>

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
        <input type="checkbox" name="consent" required className="mt-0.5 accent-blue-600" />
        <span>
          Согласен(на) с{" "}
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
        disabled={pending}
        className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 font-medium shadow-lg shadow-blue-900/20 transition hover:brightness-105 disabled:opacity-50"
      >
        {pending ? "Отправляем..." : "Проверить бесплатно"}
      </button>

      <p className="text-xs text-slate-400">
        Это не юридическая консультация и не гарантия результата — точную
        оценку вашей ситуации даст юрист после звонка.
      </p>
    </form>
  );
}
