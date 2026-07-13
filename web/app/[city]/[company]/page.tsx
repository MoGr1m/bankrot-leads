import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, Info, MapPin } from "lucide-react";
import {
  CITIES,
  getCityBySlug,
  getConfidence,
  getOrganizationBySlug,
  getOrganizations,
  getVerification,
} from "@/lib/organizations";
import { Calculator } from "@/components/Calculator";
import { VerificationBadge } from "@/components/VerificationBadge";
import { ConfidenceMeter } from "@/components/ConfidenceMeter";

// Собираем статически все пары {город, юрфирма} на этапе сборки —
// страниц немного (5 городов × ~50 фирм), поэтому SSG без проблем
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

  const org = getOrganizationBySlug(city, companySlug);

  if (!org) {
    notFound();
  }

  const verification = getVerification(org);
  const confidence = getConfidence(org);

  // Таблица «что проверено» (раздел 10.3 ТЗ): источник и статус каждого
  // показателя. Честно разделяем проверенное и неподтверждённое.
  const checks = [
    {
      label: "Реквизиты юрлица",
      value: org.inn ? `ИНН ${org.inn}` : "не установлены",
      source: org.inn ? "ЕГРЮЛ (DaData), сопоставление по названию" : "—",
      ok: Boolean(org.inn),
    },
    {
      label: "Рейтинг и отзывы",
      value:
        org.rating !== null
          ? `${org.rating} (${org.reviewCount} отзывов)`
          : "нет данных",
      source: org.rating !== null ? "2ГИС, открытый источник" : "—",
      ok: org.rating !== null,
    },
    {
      label: "Цена услуг",
      value: "не подтверждена",
      source: "уточняется на консультации",
      ok: false,
    },
  ];

  return (
    <div>
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 text-white">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <Link
            href={`/${city.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-blue-50 hover:text-white mb-6"
          >
            <ArrowLeft size={16} />
            Компании в городе {city.title}
          </Link>

          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 mb-5">
            <Building2 size={22} />
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-snug">
            {org.name}
          </h1>

          <div className="flex flex-wrap gap-x-5 gap-y-1 text-blue-50 text-sm">
            {org.address && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} />
                {org.address}
              </span>
            )}
            {org.legalName && (
              <span className="text-blue-100/90">{org.legalName}</span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-14 space-y-10">
        <div className="-mt-24 sm:-mt-28">
          <Calculator citySlug={city.slug} companyName={org.name} />
        </div>

        {/* Статусы: уровень проверки + уверенность */}
        <div className="flex flex-wrap items-center gap-3">
          <VerificationBadge
            level={verification.level}
            label={verification.label}
          />
          <ConfidenceMeter level={confidence.level} label={confidence.label} />
        </div>
        <p className="text-sm text-slate-500 -mt-6">{verification.note}</p>

        {/* Что проверено */}
        <div>
          <h2 className="text-xl font-bold mb-4">Что проверено</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="py-2 pr-4 font-medium">Показатель</th>
                  <th className="py-2 pr-4 font-medium">Значение</th>
                  <th className="py-2 font-medium">Источник</th>
                </tr>
              </thead>
              <tbody>
                {checks.map((c) => (
                  <tr key={c.label} className="border-b border-slate-100">
                    <td className="py-2.5 pr-4 text-slate-700">{c.label}</td>
                    <td
                      className={`py-2.5 pr-4 ${
                        c.ok ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {c.value}
                    </td>
                    <td className="py-2.5 text-slate-500">{c.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Реквизиты (если найдены) */}
        {org.inn && (
          <div>
            <h2 className="text-xl font-bold mb-4">Реквизиты</h2>
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              {org.legalName && (
                <div className="sm:col-span-2">
                  <dt className="text-slate-500">Юридическое лицо</dt>
                  <dd className="text-slate-900">{org.legalName}</dd>
                </div>
              )}
              <div>
                <dt className="text-slate-500">ИНН</dt>
                <dd className="text-slate-900">{org.inn}</dd>
              </div>
              {org.ogrn && (
                <div>
                  <dt className="text-slate-500">ОГРН</dt>
                  <dd className="text-slate-900">{org.ogrn}</dd>
                </div>
              )}
              {org.registrationDate && (
                <div>
                  <dt className="text-slate-500">Дата регистрации</dt>
                  <dd className="text-slate-900">{org.registrationDate}</dd>
                </div>
              )}
              {org.orgStatus && (
                <div>
                  <dt className="text-slate-500">Статус</dt>
                  <dd className="text-slate-900">
                    {org.orgStatus === "ACTIVE" ? "Действующая" : org.orgStatus}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
          <Info size={16} className="shrink-0 mt-0.5" />
          <p>
            Данные собраны из открытых источников (2ГИС, ЕГРЮЛ) и не являются
            рекламой конкретной компании. Реквизиты сопоставлены автоматически
            и не подтверждены вручную; квалификацию сотрудников мы не
            проверяли. Убедитесь в сведениях самостоятельно на консультации,
            прежде чем заключать договор.
          </p>
        </div>
      </div>
    </div>
  );
}
