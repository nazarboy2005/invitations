import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ServicesDirectory } from "@/modules/services/services-directory";
import { serviceCategories } from "@/modules/services/services-data";

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ q?: string; region?: string; page?: string }>;
};
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const route = await params;
  if (route.category === "invitation") redirect("/templates");
  const selected = serviceCategories.find((item) => item.id === route.category);
  if (!selected) notFound();
  const query = await searchParams;
  return {
    title: `${selected.name} — to‘y xizmatlari`,
    description: `${selected.name}: xizmatlar, rasmlar, manzillar va aloqa ma’lumotlari. O‘zingizga mos xizmatni Fotiha’da toping.`,
    alternates: { canonical: `/services/${selected.id}` },
    ...(query.q || query.region || query.page
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}
export default async function ServiceCategoryPage({
  params,
  searchParams,
}: Props) {
  const { category } = await params;
  if (category === "invitation") redirect("/templates");
  if (!serviceCategories.some((item) => item.id === category)) notFound();
  const query = await searchParams;
  return (
    <ServicesDirectory
      filters={{
        category,
        q: typeof query.q === "string" ? query.q : "",
        region: typeof query.region === "string" ? query.region : "",
        page: typeof query.page === "string" ? query.page : "1",
      }}
    />
  );
}
