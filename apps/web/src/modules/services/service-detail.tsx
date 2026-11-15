import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { ServiceGallery } from "./service-gallery";
import { ServiceShare } from "./service-share";
import { ServiceCard } from "./service-card";
import {
  serviceCategories,
  serviceExternalUrl,
  serviceListings,
  serviceLocation,
  serviceMapUrl,
  servicePhoneUrl,
  servicePrice,
  type ServiceListing,
} from "./services-data";
import styles from "./services.module.css";

export function ServiceDetail({ listing }: { listing: ServiceListing }) {
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
    .map((link) => ({ ...link, href: serviceExternalUrl(link.url) }))
    .filter((link) => link.href);
  const paragraphs = listing.description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const mapUrl = serviceMapUrl(listing);
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
        <ServiceShare name={listing.name} />
      </div>
      <div className={styles.detailHeading}>
        <p className={styles.eyebrow}>
          {listing.categoryLabel}
          {listing.featured && (
            <span className={styles.inlinePartner}>Hamkor</span>
          )}
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
        <ServiceGallery images={listing.images} name={listing.name} />
        <aside
          className={styles.contactPanel}
          aria-label="Xizmat bilan bog‘lanish"
        >
          <div className={styles.contactInner}>
            <p className={styles.sectionLabel}>XIZMAT NARXI</p>
            <p className={styles.detailPrice}>{servicePrice(listing.price)}</p>
            <p className={styles.contactHint}>
              Batafsil ma’lumot va buyurtma uchun xizmat ko‘rsatuvchi bilan
              bog‘laning.
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
                    <small>
                      {index === 0
                        ? "Qo‘ng‘iroq qilish"
                        : phone.label || "Qo‘shimcha telefon"}
                    </small>
                    {phone.value}
                  </span>
                  <ArrowUpRight size={16} />
                </a>
              ))}
              {links.map((link, index) => (
                <a
                  key={`${link.href}-${index}`}
                  href={link.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.externalContact}
                >
                  <Globe size={17} />
                  <span>{link.label}</span>
                  <ArrowUpRight size={15} />
                </a>
              ))}
              {listing.email &&
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(listing.email) && (
                  <a
                    href={`mailto:${encodeURIComponent(listing.email)}`}
                    className={styles.externalContact}
                  >
                    <Mail size={17} />
                    <span>{listing.email}</span>
                    <ArrowUpRight size={15} />
                  </a>
                )}
              {phones.length === 0 && links.length === 0 && !listing.email && (
                <p className={styles.contactHint}>
                  Aloqa ma’lumotlari hozircha kiritilmagan.
                </p>
              )}
            </div>
            <p className={styles.contactNote}>
              Xorijiy valyutadagi narxlar so‘mga taxminan hisoblangan. Narxlar
              va mavjudlikni buyurtma berishdan oldin aniqlashtiring.
            </p>
            <a
              className={styles.correctionLink}
              href="https://t.me/fotiha_support_bot"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ma’lumotni yangilash
            </a>
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
          {(listing.address || listing.latitude !== null) && (
            <section className={styles.detailSection}>
              <p className={styles.sectionLabel}>MANZIL</p>
              <h2>Bizni qanday topasiz?</h2>
              <div className={styles.addressCard}>
                <span className={styles.addressIcon}>
                  <MapPin size={26} strokeWidth={1.3} />
                </span>
                <div>
                  <h3>{listing.name}</h3>
                  <p>{listing.address || serviceLocation(listing)}</p>
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                    Yandex Maps’da ochish <ArrowUpRight size={15} />
                  </a>
                </div>
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
