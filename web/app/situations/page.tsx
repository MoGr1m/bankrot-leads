import Link from "next/link";
import { ChevronRight, LifeBuoy } from "lucide-react";
import { SITUATIONS } from "@/lib/content";

export const metadata = {
  title: "Ситуации с долгами — что делать",
  description:
    "Коллекторы, приставы, имущество при банкротстве: что делать в конкретной ситуации и какие шаги проверить.",
};

export default function SituationsPage() {
  return (
    <div>
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 text-white">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 mb-5">
            <LifeBuoy size={22} />
          </span>
          <h1 className="text-3xl font-bold">Ситуации с долгами</h1>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-14">
        <ul className="space-y-4">
          {SITUATIONS.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/situations/${s.slug}/`}
                className="group flex items-start justify-between gap-4 rounded-2xl border border-slate-200 p-6 transition hover:border-blue-300 hover:shadow-md hover:shadow-blue-900/5"
              >
                <div>
                  <p className="text-lg font-semibold group-hover:text-blue-700">
                    {s.title}
                  </p>
                  <p className="text-slate-600 text-sm mt-1">{s.intro}</p>
                </div>
                <ChevronRight
                  size={18}
                  className="mt-1 shrink-0 text-slate-300 group-hover:text-blue-500"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
