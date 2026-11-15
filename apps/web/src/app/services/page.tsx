import type { Metadata } from "next";
import { ServicesDirectory } from "@/modules/services/services-directory";

export const dynamic = "force-dynamic";

type Query = { q?: string; region?: string; page?: string };
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Query>;
}): Promise<Metadata> {
  const query = await searchParams;
  return {
    title: "To‘y va tadbir servislari",
    description:
      "To‘yxonalar, foto va video, boshlovchilar, dekoratsiya va boshqa to‘y xizmatlari. Xizmatlarni ko‘ring va bevosita bog‘laning.",
    alternates: { canonical: "/services" },
    ...(query.q || query.region || query.page
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}
export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  return (
    <ServicesDirectory
      filters={{
        q: typeof query.q === "string" ? query.q : "",
        region: typeof query.region === "string" ? query.region : "",
        page: typeof query.page === "string" ? query.page : "1",
      }}
    />
  );
}
