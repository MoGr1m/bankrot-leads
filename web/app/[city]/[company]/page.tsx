import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, Info, MapPin, Star } from "lucide-react";
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
    <div>
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 text-white">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <Link
            href={`/${city.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-blue-50 hover:text-white mb-6"
          >
            <ArrowLeft size={16} />
            Юрфирмы в городе {city.title}
          </Link>

          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 mb-5">
            <Building2 size={22} />
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-snug">
            {organization.name}
          </h1>

          <div className="flex flex-wrap gap-x-5 gap-y-1 text-blue-50 text-sm">
            {organization.address && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} />
                {organization.address}
              </span>
            )}
            {organization.rating !== null && (
              <span className="inline-flex items-center gap-1.5">
                <Star size={14} className="fill-amber-300 text-amber-300" />
                {organization.rating} ({organization.reviewCount} отзывов) —
                по данным 2ГИС
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-14 space-y-8">
        <div className="-mt-24 sm:-mt-28">
          <Calculator citySlug={city.slug} companyName={organization.name} />
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
          <Info size={16} className="shrink-0 mt-0.5" />
          <p>
            Данные о компании собраны из открытого источника (2ГИС) и не
            являются рекламой конкретной юрфирмы. Мы не проверяли
            квалификацию сотрудников — рекомендуем убедиться в этом
            самостоятельно на консультации.
          </p>
        </div>
      </div>
    </div>
  );
}
