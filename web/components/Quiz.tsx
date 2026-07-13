"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { QUIZ_STEPS as STEPS } from "@/lib/quiz-questions";

export function Quiz() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  // Ответы: для single — строка, для multi — массив строк
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const current = answers[step.key];

  // Для перехода «Далее» на single-вопросе нужен выбор; multi можно пропустить
  const canProceed =
    step.type === "multi" || (typeof current === "string" && current.length > 0);

  function selectSingle(value: string) {
    setAnswers((prev) => ({ ...prev, [step.key]: value }));
  }

  function toggleMulti(value: string) {
    setAnswers((prev) => {
      const arr = Array.isArray(prev[step.key])
        ? (prev[step.key] as string[])
        : [];
      const next = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      return { ...prev, [step.key]: next };
    });
  }

  function isSelected(value: string): boolean {
    if (step.type === "single") return current === value;
    return Array.isArray(current) && current.includes(value);
  }

  function goNext() {
    if (!isLast) {
      setStepIndex((i) => i + 1);
      return;
    }
    // Кодируем ответы в query и уходим на страницу результата (server-side подбор)
    const params = new URLSearchParams();
    for (const s of STEPS) {
      const a = answers[s.key];
      if (Array.isArray(a)) {
        if (a.length) params.set(s.key, a.join(","));
      } else if (a) {
        params.set(s.key, a);
      }
    }
    router.push(`/podbor-kompanii/result/?${params.toString()}`);
  }

  const progress = Math.round(((stepIndex + 1) / STEPS.length) * 100);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Прогресс */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span>
            Вопрос {stepIndex + 1} из {STEPS.length}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-teal-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-1">{step.question}</h1>
      {step.hint && <p className="text-sm text-slate-500 mb-5">{step.hint}</p>}
      {!step.hint && <div className="mb-5" />}

      <div className="space-y-3">
        {step.options.map((opt) => {
          const selected = isSelected(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() =>
                step.type === "single"
                  ? selectSingle(opt.value)
                  : toggleMulti(opt.value)
              }
              className={`w-full text-left rounded-xl border px-4 py-3.5 transition ${
                selected
                  ? "border-blue-500 bg-blue-50 text-blue-800"
                  : "border-slate-200 hover:border-blue-300"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          disabled={stepIndex === 0}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 disabled:opacity-40"
        >
          <ArrowLeft size={16} />
          Назад
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={!canProceed}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 font-medium shadow-lg shadow-blue-900/20 disabled:opacity-40"
        >
          {isLast ? "Показать результат" : "Далее"}
          <ArrowRight size={18} />
        </button>
      </div>

      <p className="mt-6 flex items-center gap-1.5 text-xs text-slate-400">
        <ShieldCheck size={14} />
        Телефон не потребуется до результата. Подбор бесплатный и ни к чему не
        обязывает.
      </p>
    </div>
  );
}
