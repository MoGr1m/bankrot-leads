import { notFound } from "next/navigation";
import { ARTICLES, getArticleBySlug } from "@/lib/articles";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-4">
      <h1 className="text-2xl font-bold mb-2">{article.title}</h1>
      {article.paragraphs.map((paragraph, index) =>
        paragraph.startsWith("## ") ? (
          <h2 key={index} className="text-lg font-semibold pt-2">
            {paragraph.replace("## ", "")}
          </h2>
        ) : (
          <p key={index} className="text-slate-700 leading-relaxed">
            {paragraph}
          </p>
        )
      )}
    </div>
  );
}
