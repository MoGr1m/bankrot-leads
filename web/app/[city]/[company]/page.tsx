import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CITIES,
  getCityBySlug,
  getOrganizationBySlug,
  getOrganizations,
} from "@/lib/organizations";
import { Calculator } from "@/components/Calculator";

// Собираем статически все пары {город, юрфирма} на этапе сборки —
// страниц немного (3 города × ~50 фирм), поэтому SSG без проблем
export function generateStaticParams() {
  return CITIES.flatMap((city) =>
    getOrganizations(city).map((org) => ({
      city: city.slug,
      company: org.slug,
    }))
  );
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ city: string; company: string }>;
}) {
  const { city: citySlug, company: companySlug } = await params;
  const city = getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  const organization = getOrganizationBySlug(city, companySlug);

  if (!organization) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-10">
      <div>
        <Link
          href={`/${city.slug}`}
          className="text-sm text-slate-500 hover:underline"
        >
          ← Юрфирмы в городе {city.title}
        </Link>
        <h1 className="text-2xl font-bold mt-2 mb-2">{organization.name}</h1>
        {organization.address && (
          <p className="text-slate-600">{organization.address}</p>
        )}
        {organization.rating !== null && (
          <p className="text-slate-600 mt-1">
            Рейтинг: {organization.rating} ({organization.reviewCount}{" "}
            отзывов) — по данным 2ГИС
          </p>
        )}
      </div>

      <Calculator citySlug={city.slug} companyName={organization.name} />

      <p className="text-xs text-slate-400">
        Данные о компании собраны из открытого источника (2ГИС) и не
        являются рекламой конкретной юрфирмы. Мы не проверяли квалификацию
        сотрудников — рекомендуем убедиться в этом самостоятельно на
        консультации.
      </p>
    </div>
  );
}
