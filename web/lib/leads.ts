"use server";

import fs from "node:fs";
import path from "node:path";

// MVP-хранилище лидов: просто аппендим в JSON-файл в data/leads.json.
// Когда дойдём до реальных продаж юрфирмам — заменить на нормальную
// CRM/базу (см. README.md, недели 5-6 плана).
const LEADS_FILE = path.join(process.cwd(), "..", "data", "leads.json");

export type LeadFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

function isValidRussianPhone(phone: string): boolean {
  // Достаточно грубая проверка: 10-11 цифр после удаления всего, кроме цифр
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
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

  if (!consent) {
    return {
      status: "error",
      message: "Нужно согласие на обработку персональных данных",
    };
  }

  if (!isValidRussianPhone(phone)) {
    return { status: "error", message: "Проверьте номер телефона" };
  }

  const lead = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    city,
    phone,
    debtAmount,
    hasIncome,
  };

  const existing: unknown[] = fs.existsSync(LEADS_FILE)
    ? JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8"))
    : [];

  existing.push(lead);
  fs.mkdirSync(path.dirname(LEADS_FILE), { recursive: true });
  fs.writeFileSync(LEADS_FILE, JSON.stringify(existing, null, 2), "utf-8");

  return {
    status: "success",
    message: "Заявка принята, мы свяжемся с вами в ближайшее время",
  };
}
