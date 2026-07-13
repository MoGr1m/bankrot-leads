// Показатель уверенности в данных (раздел 11.4 ТЗ). Не даёт компании с парой
// отзывов выглядеть весомее компании с сотнями. Три уровня — три деления.
export function ConfidenceMeter({
  level,
  label,
}: {
  level: "high" | "medium" | "low";
  label: string;
}) {
  const filled = level === "high" ? 3 : level === "medium" ? 2 : 1;
  const color =
    level === "high"
      ? "bg-emerald-500"
      : level === "medium"
        ? "bg-amber-400"
        : "bg-slate-300";

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
      <span className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`h-3 w-1.5 rounded-sm ${
              i < filled ? color : "bg-slate-200"
            }`}
          />
        ))}
      </span>
      {label}
    </span>
  );
}
