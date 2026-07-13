import { notFound } from "next/navigation";
import { SERVICES, getServiceBySlug } from "@/lib/content";
import { ContentPageView } from "@/components/ContentPageView";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getServiceBySlug(slug);
  if (!page) return {};
  return { title: page.metaTitle, description: page.metaDescription };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getServiceBySlug(slug);
  if (!page) notFound();
  return <ContentPageView page={page} />;
}
