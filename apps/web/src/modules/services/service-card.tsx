import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ImageIcon, MapPin } from "lucide-react";
import { publicAsset } from "@/lib/public-asset";
import {
  serviceLocation,
  servicePrice,
  type ServiceListing,
} from "./services-data";
import styles from "./services.module.css";

export function ServiceCard({
  listing,
  priority = false,
}: {
  listing: ServiceListing;
  priority?: boolean;
}) {
  const cover = listing.images[0];
  return (
    <article className={styles.card} data-service-card>
      <Link
        href={`/services/b/${listing.slug}`}
        className={styles.cardLink}
        prefetch={false}
      >
        <div className={styles.cardImage}>
          {cover ? (
            <Image
              src={publicAsset(cover.src)}
              alt={cover.alt || listing.name}
              fill
              sizes="(max-width: 600px) 45vw, (max-width: 1050px) 43vw, 25vw"
              loading={priority ? "eager" : "lazy"}
            />
          ) : (
            <ImageIcon size={32} aria-hidden="true" />
          )}
          {listing.featured && (
            <span className={styles.partnerBadge}>Hamkor</span>
          )}
        </div>
        <div className={styles.cardBody}>
          <h2 title={listing.name}>{listing.name}</h2>
          <p className={styles.cardLocation}>
            <MapPin size={13} aria-hidden="true" />
            <span>{serviceLocation(listing) || "Manzil uchun bog‘laning"}</span>
          </p>
          <div className={styles.cardBottom}>
            <span>{servicePrice(listing.price)}</span>
          </div>
          <span className={styles.cardArrow} aria-hidden="true">
            <ArrowRight size={18} />
          </span>
        </div>
      </Link>
    </article>
  );
}
