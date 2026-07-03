import Link from "next/link";
import { CITIES } from "@/lib/organizations";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold mb-4">
        Списание долгов через банкротство физлиц
      </h1>
      <p className="text-slate-600 mb-10">
        Бесплатно узнайте, подходите ли вы под процедуру, и найдите
        проверенного юриста в своём городе.
      </p>

      <h2 className="text-lg font-semibold mb-3">Выберите город</h2>
      <ul className="grid gap-3 sm:grid-cols-3">
        {CITIES.map((city) => (
          <li key={city.slug}>
            <Link
              href={`/${city.slug}`}
              className="block rounded-lg border border-slate-200 px-4 py-3 text-center hover:border-slate-400"
            >
              {city.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
