import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { ARTICLES } from "@/lib/articles";

export const metadata = {
  title: "Статьи о банкротстве физлиц",
};

export default function ArticlesPage() {
  return (
    <div>
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 text-white">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 mb-5">
            <BookOpen size={22} />
          </span>
          <h1 className="text-3xl font-bold">Статьи о банкротстве физлиц</h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-14">
        <ul className="space-y-4">
          {ARTICLES.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/articles/${article.slug}`}
                className="group flex items-start justify-between gap-4 rounded-2xl border border-slate-200 p-6 transition hover:border-blue-300 hover:shadow-md hover:shadow-blue-900/5"
              >
                <div>
                  <p className="text-lg font-semibold group-hover:text-blue-700">
                    {article.title}
                  </p>
                  <p className="text-slate-600 text-sm mt-1">
                    {article.excerpt}
                  </p>
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
