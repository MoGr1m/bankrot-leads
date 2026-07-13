import { BadgeCheck, HelpCircle } from "lucide-react";

// Бейдж уровня проверки компании. Честно отражает, что реально известно:
// level 0 — не проверено (только 2ГИС), level 1 — реквизиты найдены автоматически.
export function VerificationBadge({
  level,
  label,
}: {
  level: number;
  label: string;
}) {
  const verified = level >= 1;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        verified
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {verified ? <BadgeCheck size={13} /> : <HelpCircle size={13} />}
      {label}
    </span>
  );
}
