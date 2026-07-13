import { notFound } from "next/navigation";
import { SITUATIONS, getSituationBySlug } from "@/lib/content";
import { ContentPageView } from "@/components/ContentPageView";

export function generateStaticParams() {
  return SITUATIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getSituationBySlug(slug);
  if (!page) return {};
  return { title: page.metaTitle, description: page.metaDescription };
}

export default async function SituationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getSituationBySlug(slug);
  if (!page) notFound();
  return <ContentPageView page={page} />;
}
