"use server";

// MVP-хранилище лидов: отправляем уведомление в Telegram-бота вместо записи
// в файл — на serverless-хостинге (Vercel) файловая система только для
// чтения, локальный JSON-файл там работать не будет.
// Когда дойдём до реальных продаж юрфирмам — заменить на нормальную CRM
// (см. README.md, недели 5-6 плана).

export type LeadFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

function isValidRussianPhone(phone: string): boolean {
  // Достаточно грубая проверка: 10-11 цифр после удаления всего, кроме цифр
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

const DEBT_LABELS: Record<string, string> = {
  "менее 250 000": "до 250 000 ₽",
  "250000-500000": "250 000 – 500 000 ₽",
  "500000-1500000": "500 000 – 1 500 000 ₽",
  "более 1500000": "более 1 500 000 ₽",
};

async function sendTelegramNotification(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error(
      "Не настроены TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID в web/.env.local"
    );
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    }
  );

  if (!response.ok) {
    throw new Error(`Telegram API вернул ошибку: ${response.status}`);
  }
}

export async function submitLead(
  _prevState: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const city = String(formData.get("city") ?? "");
  const phone = String(formData.get("phone") ?? "").trim();
  const debtAmount = String(formData.get("debtAmount") ?? "");
  const hasIncome = formData.get("hasIncome") === "yes";
  const consent = formData.get("consent") === "on";
  // Заполняется только на странице профиля конкретной юрфирмы —
  // на общей странице города поле отсутствует
  const companyName = formData.get("companyName");

  if (!consent) {
    return {
      status: "error",
      message: "Нужно согласие на обработку персональных данных",
    };
  }

  if (!isValidRussianPhone(phone)) {
    return { status: "error", message: "Проверьте номер телефона" };
  }

  const text = [
    "Новая заявка с сайта",
    `Город: ${city}`,
    ...(typeof companyName === "string" && companyName
      ? [`Юрфирма: ${companyName}`]
      : []),
    `Телефон: ${phone}`,
    `Сумма долга: ${DEBT_LABELS[debtAmount] ?? debtAmount}`,
    `Есть доход: ${hasIncome ? "да" : "нет"}`,
  ].join("\n");

  try {
    await sendTelegramNotification(text);
  } catch (error) {
    console.error("Не удалось отправить лид в Telegram:", error);
    return {
      status: "error",
      message: "Не получилось отправить заявку, попробуйте ещё раз",
    };
  }

  return {
    status: "success",
    message: "Заявка принята, мы свяжемся с вами в ближайшее время",
  };
}

// Заявка из сервиса подбора: пользователь выбрал до 3 компаний и передаёт
// им контакт. В отличие от submitLead, здесь несколько получателей и сводка
// ситуации из квиза. Статус-заготовка в тексте — для ручной отметки оператором
// (по решению: остаёмся на Telegram, без внешней CRM).
export async function submitSelectionLead(
  _prevState: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const phone = String(formData.get("phone") ?? "").trim();
  const consent = formData.get("consent") === "on";
  const cityTitle = String(formData.get("cityTitle") ?? "");
  const companies = String(formData.get("companies") ?? ""); // «А; Б; В»
  const situation = String(formData.get("situation") ?? ""); // сводка квиза

  if (!consent) {
    return {
      status: "error",
      message: "Нужно согласие на передачу данных выбранным компаниям",
    };
  }

  if (!companies) {
    return {
      status: "error",
      message: "Выберите хотя бы одну компанию",
    };
  }

  if (!isValidRussianPhone(phone)) {
    return { status: "error", message: "Проверьте номер телефона" };
  }

  const text = [
    "🆕 Заявка из подбора",
    "Статус: новый — отметить вручную: контакт / консультация / договор / отказ",
    "",
    `Город: ${cityTitle}`,
    `Телефон: ${phone}`,
    `Выбранные компании: ${companies}`,
    "",
    "Ситуация клиента:",
    situation,
  ].join("\n");

  try {
    await sendTelegramNotification(text);
  } catch (error) {
    console.error("Не удалось отправить заявку из подбора в Telegram:", error);
    return {
      status: "error",
      message: "Не получилось отправить заявку, попробуйте ещё раз",
    };
  }

  return {
    status: "success",
    message:
      "Заявка отправлена выбранным компаниям. Они свяжутся с вами в ближайшее время.",
  };
}
