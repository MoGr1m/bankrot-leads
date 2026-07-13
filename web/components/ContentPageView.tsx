import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ContentPage } from "@/lib/content";

// Общий шаблон для страниц услуг и ситуаций. CTA ведёт в подбор или калькулятор.
export function ContentPageView({ page }: { page: ContentPage }) {
  const cta =
    page.ctaType === "calculator"
      ? { href: "/tools/calculator-cost/", label: "Рассчитать стоимость" }
      : { href: "/podbor-kompanii/quiz/", label: "Подобрать компанию" };

  return (
    <div>
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 text-white">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            {page.title}
          </h1>
          <p className="text-blue-50 text-lg max-w-2xl">{page.intro}</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 space-y-8">
        {page.blocks.map((block) => (
          <section key={block.heading}>
            <h2 className="text-xl font-bold mb-3">{block.heading}</h2>
            {block.paragraphs?.map((p) => (
              <p key={p} className="text-slate-700 leading-relaxed mb-3">
                {p}
              </p>
            ))}
            {block.list && (
              <ul className="space-y-2 text-slate-700 list-disc list-inside">
                {block.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {/* CTA — ведёт в конверсионное ядро */}
        <div className="rounded-2xl bg-slate-50 p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <p className="flex-1 text-slate-600 text-sm">
            Не заменяет консультацию юриста. Проверьте вашу ситуацию и подберите
            подходящую компанию.
          </p>
          <Link
            href={cta.href}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white px-5 py-2.5 font-medium shadow-lg shadow-blue-900/20 hover:brightness-105 shrink-0"
          >
            {cta.label}
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
