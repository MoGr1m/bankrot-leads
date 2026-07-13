"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, ChevronRight, Star } from "lucide-react";
import { VerificationBadge } from "@/components/VerificationBadge";
import { ConfidenceMeter } from "@/components/ConfidenceMeter";

// Компания в листинге каталога — данные готовит сервер (страница города).
export type CatalogCompany = {
  slug: string;
  name: string;
  address: string | null;
  rating: number | null;
  reviewCount: number;
  inn: string | null;
  verificationLevel: number;
  verificationLabel: string;
  confidenceLevel: "high" | "medium" | "low";
  confidenceLabel: string;
};

type SortKey = "confidence" | "reviews" | "verified";

export function Catalog({
  companies,
  citySlug,
}: {
  companies: CatalogCompany[];
  citySlug: string;
}) {
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyOffice, setOnlyOffice] = useState(false);
  const [sort, setSort] = useState<SortKey>("confidence");

  const confidenceRank = { high: 3, medium: 2, low: 1 } as const;

  const filtered = companies
    .filter((c) => (onlyVerified ? c.verificationLevel >= 1 : true))
    .filter((c) => (onlyOffice ? Boolean(c.address) : true))
    .sort((a, b) => {
      if (sort === "reviews") return b.reviewCount - a.reviewCount;
      if (sort === "verified")
        return b.verificationLevel - a.verificationLevel;
      // по уверенности (default)
      return (
        confidenceRank[b.confidenceLevel] - confidenceRank[a.confidenceLevel] ||
        b.reviewCount - a.reviewCount
      );
    });

  return (
    <div>
      {/* Фильтры и сортировка */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <button
          type="button"
          onClick={() => setOnlyVerified((v) => !v)}
          className={`rounded-full border px-3 py-1.5 text-sm transition ${
            onlyVerified
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-slate-200 text-slate-600 hover:border-blue-300"
          }`}
        >
          Реквизиты найдены
        </button>
        <button
          type="button"
          onClick={() => setOnlyOffice((v) => !v)}
          className={`rounded-full border px-3 py-1.5 text-sm transition ${
            onlyOffice
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-slate-200 text-slate-600 hover:border-blue-300"
          }`}
        >
          Есть офис
        </button>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="ml-auto rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
        >
          <option value="confidence">По уверенности в данных</option>
          <option value="reviews">По числу отзывов</option>
          <option value="verified">Сначала с реквизитами</option>
        </select>
      </div>

      <p className="text-sm text-slate-500 mb-4">
        Показано {filtered.length} из {companies.length}. Сортировка и фильтры
        отражают достоверность данных, а не рекламные приоритеты.
      </p>

      <ul className="space-y-3">
        {filtered.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/${citySlug}/${c.slug}`}
              className="group flex items-start gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:shadow-md hover:shadow-blue-900/5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                <Building2 size={18} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-medium">{c.name}</span>
                <span className="mt-1 flex flex-wrap items-center gap-2">
                  <VerificationBadge
                    level={c.verificationLevel}
                    label={c.verificationLabel}
                  />
                  <ConfidenceMeter
                    level={c.confidenceLevel}
                    label={c.confidenceLabel}
                  />
                </span>
                {c.inn && (
                  <span className="block text-sm text-slate-500 mt-1">
                    ИНН {c.inn}
                  </span>
                )}
                {c.address && (
                  <span className="block text-sm text-slate-500">
                    {c.address}
                  </span>
                )}
                {c.rating !== null ? (
                  <span className="mt-1 inline-flex items-center gap-1 text-sm text-slate-500">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    {c.rating} ({c.reviewCount} отзывов) — по данным 2ГИС
                  </span>
                ) : (
                  <span className="block text-sm text-slate-400 mt-1">
                    Недостаточно данных для рейтинга
                  </span>
                )}
              </span>
              <ChevronRight
                size={18}
                className="mt-2 shrink-0 text-slate-300 group-hover:text-blue-500"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
