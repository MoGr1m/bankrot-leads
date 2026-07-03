"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitLead, type LeadFormState } from "@/lib/leads";

const initialState: LeadFormState = { status: "idle" };

export function Calculator({ citySlug }: { citySlug: string }) {
  const [state, formAction, pending] = useActionState(submitLead, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <p className="font-medium text-emerald-800">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-4"
    >
      <input type="hidden" name="city" value={citySlug} />

      <div>
        <p className="font-semibold mb-3">
          Бесплатно узнайте, подходите ли вы под процедуру банкротства
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-sm text-slate-600" htmlFor="debtAmount">
          Примерная сумма долга
        </label>
        <select
          id="debtAmount"
          name="debtAmount"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          defaultValue="250000-500000"
        >
          <option value="менее 250 000">до 250 000 ₽</option>
          <option value="250000-500000">250 000 – 500 000 ₽</option>
          <option value="500000-1500000">500 000 – 1 500 000 ₽</option>
          <option value="более 1500000">более 1 500 000 ₽</option>
        </select>
      </div>

      <div className="space-y-1">
        <p className="text-sm text-slate-600">Есть ли у вас официальный доход?</p>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="hasIncome" value="yes" defaultChecked />
            Да
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="hasIncome" value="no" />
            Нет
          </label>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm text-slate-600" htmlFor="phone">
          Телефон для связи
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="+7 900 000-00-00"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <label className="flex items-start gap-2 text-xs text-slate-500">
        <input type="checkbox" name="consent" required className="mt-0.5" />
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
        className="w-full rounded-md bg-slate-900 text-white py-2.5 font-medium disabled:opacity-50"
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
