import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ImageIcon, MapPin } from "lucide-react";
import { publicAsset } from "@/lib/public-asset";
import {
  serviceLocation,
  servicePrice,
  type ServiceListing,
} from "./services-utils";
import { ServiceFavoriteButton } from "./service-favorite";
import { ServicePartnerBadge } from "./service-partner-badge";
import { ServiceCardDistance } from "./service-card-distance";
import { ServicePhoto } from "./service-photo";
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
    <article
      className={`${styles.card}${listing.featured ? ` ${styles.partnerCard}` : ""}`}
      data-service-card
      data-service-partner={listing.featured || undefined}
    >
      <Link
        href={`/services/b/${listing.slug}`}
        className={styles.cardLink}
        prefetch={false}
      >
        <div className={styles.cardImage}>
          {cover ? (
            <ServicePhoto
              slug={listing.slug}
              image={cover}
              name={listing.name}
              sizes="(max-width: 600px) 45vw, (max-width: 1050px) 43vw, 25vw"
              loading={priority ? "eager" : "lazy"}
            />
          ) : (
            <ImageIcon size={32} aria-hidden="true" />
          )}
          {listing.featured && <ServicePartnerBadge overlay />}
        </div>
        <div className={styles.cardBody}>
          <h2 title={listing.name}>{listing.name}</h2>
          <p className={styles.cardLocation}>
            <MapPin size={13} aria-hidden="true" />
            <span className={styles.cardAddress}>
              {serviceLocation(listing) || "Manzil uchun bog‘laning"}
            </span>
            <ServiceCardDistance
              latitude={listing.latitude}
              longitude={listing.longitude}
            />
          </p>
          <div className={styles.cardBottom}>
            <span>{servicePrice(listing.price)}</span>
          </div>
          <span className={styles.cardArrow} aria-hidden="true">
            <ArrowRight size={18} />
          </span>
        </div>
      </Link>
      {listing.featured && (
        <span className={styles.partnerFrame} aria-hidden="true">
          <Image
            src={publicAsset("/images/services/partner-corner.svg")}
            alt=""
            width={120}
            height={120}
            unoptimized
            className={styles.partnerCornerTop}
          />
          <Image
            src={publicAsset("/images/services/partner-corner.svg")}
            alt=""
            width={120}
            height={120}
            unoptimized
            className={styles.partnerCornerBottom}
          />
        </span>
      )}
      <ServiceFavoriteButton slug={listing.slug} name={listing.name} overlay />
    </article>
  );
}
