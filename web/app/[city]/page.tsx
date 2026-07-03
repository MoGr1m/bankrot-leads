import { notFound } from "next/navigation";
import { CITIES, getCityBySlug, getOrganizations } from "@/lib/organizations";
import { Calculator } from "@/components/Calculator";

export function generateStaticParams() {
  return CITIES.map((city) => ({ city: city.slug }));
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  const organizations = getOrganizations(city);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-10">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          Банкротство физлиц в городе {city.title}
        </h1>
        <p className="text-slate-600">
          Проверьте бесплатно, подходите ли вы под процедуру списания долгов,
          и получите звонок от юриста, который специализируется на
          банкротстве физлиц в {city.title}.
        </p>
      </div>

      <Calculator citySlug={city.slug} />

      <div>
        <h2 className="text-lg font-semibold mb-4">
          Юридические фирмы в {city.title} ({organizations.length})
        </h2>
        {organizations.length === 0 ? (
          <p className="text-slate-500 text-sm">
            Список пока в процессе сбора.
          </p>
        ) : (
          <ul className="space-y-3">
            {organizations.map((org) => (
              <li
                key={org.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <p className="font-medium">{org.name}</p>
                {org.address && (
                  <p className="text-sm text-slate-500">{org.address}</p>
                )}
                {org.rating !== null && (
                  <p className="text-sm text-slate-500">
                    Рейтинг: {org.rating} ({org.reviewCount} отзывов)
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
