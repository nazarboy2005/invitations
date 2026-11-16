import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  Heart,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { ServiceGallery } from "./service-gallery";
import { ServiceFavoriteButton } from "./service-favorite";
import { ServiceShare } from "./service-share";
import { ServiceContactIcon } from "./service-contact-icon";
import { ServiceCard } from "./service-card";
import { ServicePartnerBadge } from "./service-partner-badge";
import {
  serviceCategories,
  serviceExternalUrl,
  serviceLocation,
  serviceMapUrl,
  servicePhoneUrl,
  servicePrice,
  type ServiceListing,
} from "./services-data";
import styles from "./services.module.css";

export function ServiceDetail({
  listing,
  serviceListings = [],
}: {
  listing: ServiceListing;
  serviceListings?: ServiceListing[];
}) {
  const category = serviceCategories.find((item) =>
    listing.categoryIds.includes(item.id),
  );
  const related = serviceListings
    .filter(
      (item) =>
        item.slug !== listing.slug &&
        item.categoryIds.some((id) => listing.categoryIds.includes(id)),
    )
    .slice(0, 3);
  const phones = listing.phones
    .map((phone) => ({ ...phone, href: servicePhoneUrl(phone.value) }))
    .filter((phone) => phone.href);
  const links = listing.links
    .map((link) => ({
      ...link,
      href: serviceExternalUrl(link.url.replace(/&amp;/g, "&")),
    }))
    .filter(
      (link, index, all) =>
        link.href && all.findIndex((item) => item.href === link.href) === index,
    );
  const paragraphs = listing.description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const mapUrl = serviceMapUrl(listing);
  const hasMap =
    Boolean(listing.address) ||
    (listing.latitude !== null && listing.longitude !== null);
  return (
    <div className={styles.detail}>
      <div className={styles.detailTop}>
        <Link
          href={category ? `/services/${category.id}` : "/services"}
          className={styles.backLink}
        >
          <ArrowLeft size={17} />
          {category?.name ?? "Servislar"}
        </Link>
      </div>
      <div className={styles.detailHeading}>
        <p className={styles.eyebrow}>
          {listing.categoryLabel}
          {listing.featured && <ServicePartnerBadge />}
        </p>
        <h1>{listing.name}</h1>
        {serviceLocation(listing) && (
          <p>
            <MapPin size={16} />
            {serviceLocation(listing)}
          </p>
        )}
      </div>
      <div className={styles.detailColumns}>
        <ServiceGallery
          key={listing.slug}
          slug={listing.slug}
          images={listing.images}
          name={listing.name}
        />
        <aside
          className={styles.contactPanel}
          aria-label="Xizmat bilan bog‘lanish"
        >
          <div className={styles.contactInner}>
            <div className={styles.priceHeading}>
              <p className={styles.sectionLabel}>XIZMAT NARXI</p>
              <div className={styles.serviceActionsMobile}>
                <ServiceFavoriteButton
                  slug={listing.slug}
                  name={listing.name}
                />
                <span className={styles.actionSeparator} aria-hidden="true">
                  |
                </span>
                <ServiceShare name={listing.name} compact />
              </div>
            </div>
            <p className={styles.detailPrice}>{servicePrice(listing.price)}</p>
            <p className={styles.contactHint}>
              Ma’lumot va buyurtma uchun bog‘laning.
            </p>
            <div className={styles.contactButtons}>
              {phones.map((phone, index) => (
                <a
                  key={`${phone.value}-${index}`}
                  href={phone.href!}
                  className={
                    index === 0
                      ? styles.primaryContact
                      : styles.secondaryContact
                  }
                >
                  <Phone size={18} />
                  <span>
                    {phone.value.replace(
                      /^(\+998)(\d{2})(\d{3})(\d{2})(\d{2})$/,
                      "$1 $2 $3 $4 $5",
                    )}
                  </span>
                  <ArrowUpRight size={16} />
                </a>
              ))}
              {phones.length === 0 && links.length === 0 && !listing.email && (
                <p className={styles.contactHint}>
                  Aloqa ma’lumotlari hozircha kiritilmagan.
                </p>
              )}
            </div>
            <div className={styles.compactContacts}>
              <div className={styles.serviceActionsDesktop}>
                <ServiceFavoriteButton
                  slug={listing.slug}
                  name={listing.name}
                />
                <span className={styles.actionSeparator} aria-hidden="true">
                  |
                </span>
                <ServiceShare name={listing.name} compact />
              </div>
              <div className={styles.contactDivider} aria-hidden="true">
                <Heart size={16} fill="currentColor" />
              </div>
              {(links.length > 0 || listing.email) && (
                <div
                  className={styles.socialContacts}
                  aria-label="Ijtimoiy tarmoqlar va aloqa"
                >
                  {links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      title={link.label}
                    >
                      <ServiceContactIcon href={link.href!} />
                    </a>
                  ))}
                  {listing.email &&
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(listing.email) && (
                      <a
                        href={`mailto:${encodeURIComponent(listing.email)}`}
                        aria-label="Elektron pochta"
                        title={listing.email}
                      >
                        <Mail size={19} />
                      </a>
                    )}
                </div>
              )}
              {hasMap && (
                <a
                  className={styles.mapContact}
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin size={18} />
                  <span>Yandex Maps</span>
                  <ArrowUpRight size={17} />
                </a>
              )}
            </div>
          </div>
        </aside>
        <div className={styles.detailContent}>
          {paragraphs.length > 0 && (
            <section className={styles.detailSection}>
              <p className={styles.sectionLabel}>TANISHING</p>
              <h2>Xizmat haqida</h2>
              <div className={styles.description}>
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      {related.length > 0 && (
        <section className={styles.related}>
          <div className={styles.relatedHeading}>
            <div>
              <p className={styles.sectionLabel}>YANA TANISHING</p>
              <h2>Shu yo‘nalishdagi xizmatlar</h2>
            </div>
            <Link href={category ? `/services/${category.id}` : "/services"}>
              Barchasi <ChevronRight size={16} />
            </Link>
          </div>
          <div className={styles.grid}>
            {related.map((item) => (
              <ServiceCard key={item.slug} listing={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
