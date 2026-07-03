import Link from "next/link";
import { ARTICLES } from "@/lib/articles";

export const metadata = {
  title: "Статьи о банкротстве физлиц",
};

export default function ArticlesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Статьи о банкротстве физлиц</h1>
      <ul className="space-y-6">
        {ARTICLES.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/articles/${article.slug}`}
              className="text-lg font-semibold hover:underline"
            >
              {article.title}
            </Link>
            <p className="text-slate-600 text-sm mt-1">{article.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
