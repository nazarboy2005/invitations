import Link from "next/link";
import { ArrowRight, Flower2, Search } from "lucide-react";
import { getCatalog } from "@/server/catalog";
import { ServiceCard } from "./service-card";
import { ServicesToolbar } from "./services-toolbar";
import { ServiceCategoryIcon } from "./service-category-icon";
import {
  serviceCategories,
  serviceDirectory,
  serviceDirectoryUrl,
  serviceListings,
  type ServiceFilters,
} from "./services-data";
import styles from "./services.module.css";

export async function ServicesDirectory({
  filters,
}: {
  filters: ServiceFilters;
}) {
  const catalog = await getCatalog();
  const result = serviceDirectory(filters);
  const regions = [
    ...new Set(serviceListings.map((item) => item.region).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b, "uz"));
  const counts = new Map(
    serviceCategories.map((category) => [
      category.id,
      serviceListings.filter((item) => item.categoryIds.includes(category.id))
        .length,
    ]),
  );
  const baseFilters = {
    category: result.category?.id,
    q: result.query,
    region: result.region,
  };
  return (
    <>
      <section className={styles.directory} aria-label="Xizmatlar katalogi">
        <aside className={styles.sidebar} data-services-mobile-pin>
          <p className={styles.sectionLabel}>YO‘NALISHLAR</p>
          <nav className={styles.categories} aria-label="Xizmat yo‘nalishlari">
            <Link
              href={serviceDirectoryUrl({
                q: result.query,
                region: result.region,
              })}
              aria-current={!result.category ? "page" : undefined}
              prefetch={false}
            >
              <span className={styles.categoryName}>
                <ServiceCategoryIcon /> Barchasi
              </span>
              <small>{serviceListings.length}</small>
            </Link>
            {serviceCategories.map((category) => (
              <Link
                key={category.id}
                href={serviceDirectoryUrl({
                  ...baseFilters,
                  category: category.id,
                })}
                aria-current={
                  result.category?.id === category.id ? "page" : undefined
                }
                prefetch={false}
              >
                <span className={styles.categoryName}>
                  <ServiceCategoryIcon category={category.id} />
                  {category.name}
                </span>
                <small>
                  {category.id === "invitation"
                    ? catalog.templates.length
                    : (counts.get(category.id) ?? 0)}
                </small>
              </Link>
            ))}
          </nav>
        </aside>

        <div className={styles.directoryMain}>
          <section className={styles.intro}>
            <div>
              <p className={styles.eyebrow}>
                <Flower2 size={15} aria-hidden="true" /> QUVONCHLI KUNLAR UCHUN
              </p>
              <h1>
                Kerakli xizmatlar,
                <br />
                <em>bitta manzilda.</em>
              </h1>
              <p className={styles.lead}>
                To‘yxonadan guldastagacha — kuningizni yanada go‘zal qiladigan
                xizmatlarni toping.
              </p>
              <div className={styles.introStats}>
                <span>
                  <strong>{serviceListings.length}</strong> xizmat
                </span>
                <span>
                  <strong>{serviceCategories.length}</strong> yo‘nalish
                </span>
                <span>
                  Bevosita bog‘lanish <ArrowUpRightIcon />
                </span>
              </div>
            </div>
          </section>
          <div
            className={styles.results}
            id="results"
            data-catalog-pin-boundary
          >
            <ServicesToolbar
              key={`${result.category?.id ?? "all"}:${result.query}:${result.region}:${result.page}`}
              category={result.category?.id}
              title={result.category?.name ?? "Barcha servislar"}
              query={result.query}
              region={result.region}
              regions={regions}
              page={result.page}
              pages={result.pages}
              total={result.total}
              previousHref={
                result.page > 1
                  ? `${serviceDirectoryUrl({ ...baseFilters, page: result.page - 1 })}#results`
                  : null
              }
              nextHref={
                result.page < result.pages
                  ? `${serviceDirectoryUrl({ ...baseFilters, page: result.page + 1 })}#results`
                  : null
              }
            />
            {(result.query || result.region) && (
              <p className={styles.activeFilters}>
                {result.query && <>“{result.query}” bo‘yicha </>}
                {result.region && <>{result.region} · </>}
                <Link
                  href={serviceDirectoryUrl({ category: result.category?.id })}
                >
                  Filtrlarni tozalash
                </Link>
              </p>
            )}
            {result.listings.length ? (
              <div className={styles.grid}>
                {result.listings.map((listing, index) => (
                  <ServiceCard
                    key={listing.slug}
                    listing={listing}
                    priority={index < 3}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.empty}>
                <Search size={32} strokeWidth={1.2} />
                <h3>Hozircha mos xizmat topilmadi</h3>
                <p>Boshqa nom yoki hudud bilan qidirib ko‘ring.</p>
                <Link
                  href={serviceDirectoryUrl({ category: result.category?.id })}
                >
                  Barcha natijalarni ko‘rish <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function ArrowUpRightIcon() {
  return (
    <ArrowRight
      size={13}
      aria-hidden="true"
      style={{ transform: "rotate(-45deg)" }}
    />
  );
}
