import { CITIES } from "@/lib/cities";

// Один шаг квиза. type: single — один вариант, multi — несколько.
export type QuizStep = {
  key: string;
  question: string;
  hint?: string;
  type: "single" | "multi";
  options: { value: string; label: string }[];
};

// 7 вопросов по разделу 10.10 ТЗ. Общий источник для квиза (клиент) и
// страницы результата (сервер) — чтобы метки ответов не расходились.
// Телефон здесь НЕ спрашивается — только после результата (снижение тревоги).
export const QUIZ_STEPS: QuizStep[] = [
  {
    key: "city",
    question: "В каком городе вы находитесь?",
    type: "single",
    options: CITIES.map((c) => ({ value: c.slug, label: c.title })),
  },
  {
    key: "debtAmount",
    question: "Примерная общая сумма долга",
    type: "single",
    options: [
      { value: "less-250", label: "до 250 000 ₽" },
      { value: "250-500", label: "250 000 – 500 000 ₽" },
      { value: "500-1500", label: "500 000 – 1 500 000 ₽" },
      { value: "more-1500", label: "более 1 500 000 ₽" },
    ],
  },
  {
    key: "debtTypes",
    question: "Какие это долги?",
    hint: "Можно выбрать несколько",
    type: "multi",
    options: [
      { value: "kredity", label: "Кредиты банков" },
      { value: "mfo", label: "Микрозаймы (МФО)" },
      { value: "nalogi", label: "Налоги" },
      { value: "zhkh", label: "ЖКХ" },
      { value: "poruchitelstvo", label: "Долг по поручительству" },
      { value: "drugoe", label: "Другое" },
    ],
  },
  {
    key: "overdue",
    question: "На какой стадии сейчас долги?",
    type: "single",
    options: [
      { value: "plachu", label: "Плачу, но становится тяжело" },
      { value: "prosrochka", label: "Есть просрочки" },
      { value: "pristavy", label: "Приставы уже взыскивают" },
    ],
  },
  {
    key: "income",
    question: "Есть ли официальный доход?",
    type: "single",
    options: [
      { value: "yes", label: "Да, есть" },
      { value: "no", label: "Нет" },
    ],
  },
  {
    key: "property",
    question: "Какое у вас есть имущество?",
    hint: "Можно выбрать несколько",
    type: "multi",
    options: [
      { value: "edinstvennoe-zhile", label: "Единственное жильё" },
      { value: "ipoteka", label: "Ипотека или залог" },
      { value: "avto", label: "Автомобиль" },
      { value: "drugaya-nedvizhimost", label: "Другая недвижимость" },
      { value: "net", label: "Ничего из этого" },
    ],
  },
  {
    key: "deals",
    question: "Были ли за последние 3 года сделки с имуществом?",
    hint: "Продажа, дарение, переоформление на родственников",
    type: "single",
    options: [
      { value: "yes", label: "Да, были" },
      { value: "no", label: "Нет" },
      { value: "ne-uveren", label: "Не уверен(а)" },
    ],
  },
];

// Переводит значение ответа (или список через запятую) в человекочитаемые метки.
function labelsForStep(step: QuizStep, rawValue: string | undefined): string {
  if (!rawValue) return "—";
  const values = rawValue.split(",");
  const labels = values.map(
    (v) => step.options.find((o) => o.value === v)?.label ?? v
  );
  return labels.join(", ");
}

// Собирает человекочитаемую сводку ситуации для заявки в Telegram.
// getParam — доступ к query-параметру по ключу (из searchParams).
export function describeAnswers(
  getParam: (key: string) => string | undefined
): string {
  return QUIZ_STEPS.map((step) => {
    const value = getParam(step.key);
    return `• ${step.question} ${labelsForStep(step, value)}`;
  }).join("\n");
}
