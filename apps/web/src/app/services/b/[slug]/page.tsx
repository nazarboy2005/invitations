import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetail } from "@/modules/services/service-detail";
import { serviceLocation } from "@/modules/services/services-data";
import { getPublishedServices } from "@/server/services";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = (await getPublishedServices()).find(
    (item) => item.slug === slug,
  );
  if (!listing) notFound();
  const description = `${listing.name} — ${listing.categoryLabel}. ${serviceLocation(listing)}. Rasmlar va aloqa ma’lumotlari.`;
  return {
    title: listing.name,
    description,
    alternates: { canonical: `/services/b/${listing.slug}` },
    openGraph: {
      title: listing.name,
      description,
      url: `/services/b/${listing.slug}`,
      images: listing.images[0]
        ? [
            {
              url: listing.images[0].src,
              width: listing.images[0].width,
              height: listing.images[0].height,
              alt: listing.name,
            },
          ]
        : [],
    },
  };
}
export default async function ServiceProfilePage({ params }: Props) {
  const { slug } = await params;
  const serviceListings = await getPublishedServices();
  const listing = serviceListings.find((item) => item.slug === slug);
  if (!listing) notFound();
  return <ServiceDetail listing={listing} serviceListings={serviceListings} />;
}
