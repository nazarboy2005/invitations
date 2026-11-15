import Link from "next/link";
import { ArrowRight, Flower2, Search } from "lucide-react";
import { getCatalog } from "@/server/catalog";
import {
  ServiceCategoryLink,
  ServiceCategories,
  ServiceResults,
  ServicesScrollPosition,
} from "./services-category-navigation";
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
  const categories = (
    <>
      <ServiceCategoryLink
        href={serviceDirectoryUrl({ region: result.region })}
        aria-current={!result.category ? "page" : undefined}
        prefetch={false}
      >
        <span className={styles.categoryName}>
          <ServiceCategoryIcon /> Barchasi
        </span>
        <small>{serviceListings.length}</small>
      </ServiceCategoryLink>
      {serviceCategories.map((category) => (
        <ServiceCategoryLink
          key={category.id}
          href={serviceDirectoryUrl({
            region: result.region,
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
        </ServiceCategoryLink>
      ))}
    </>
  );
  return (
    <>
      <section className={styles.directory} aria-label="Xizmatlar katalogi">
        <ServicesScrollPosition />
        <aside className={styles.sidebar} data-services-mobile-pin>
          <p className={styles.sectionLabel}>YO‘NALISHLAR</p>
          <ServiceCategories variant="sidebar">{categories}</ServiceCategories>
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
            </div>
          </section>
          <div
            className={styles.results}
            id="results"
            data-catalog-pin-boundary
          >
            <ServicesToolbar
              key={result.category?.id ?? "all"}
              category={result.category?.id}
              title={result.category?.name ?? "Barcha servislar"}
              mobileCategories={
                <ServiceCategories variant="mobile">
                  {categories}
                </ServiceCategories>
              }
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
            <ServiceResults>
              {(result.query || result.region) && (
                <p className={styles.activeFilters}>
                  {result.query && <>“{result.query}” bo‘yicha </>}
                  {result.region && <>{result.region} · </>}
                  <Link
                    href={serviceDirectoryUrl({
                      category: result.category?.id,
                    })}
                    scroll={false}
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
                    href={serviceDirectoryUrl({
                      category: result.category?.id,
                    })}
                    scroll={false}
                  >
                    Barcha natijalarni ko‘rish <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </ServiceResults>
          </div>
        </div>
      </section>
    </>
  );
}
