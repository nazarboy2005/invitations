"use client";
import Link from "next/link";
import { ArrowRight, Flower2, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useFavorites } from "@/modules/favorites/service-favorites-store";
import {
  ServiceFavoritesStatus,
  ServiceFavoritesFilter,
} from "./service-favorite";
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
  serviceDirectory,
  serviceDirectoryUrl,
  type ServiceFilters,
  type ServiceListing,
  type ServiceCategory,
} from "./services-utils";
import styles from "./services.module.css";

export function ServicesDirectoryClient({
  filters,
  serviceListings,
  serviceCategories,
  templateCount,
}: {
  filters: ServiceFilters;
  serviceListings: ServiceListing[];
  serviceCategories: ServiceCategory[];
  templateCount: number;
}) {
  const search = useSearchParams();
  const saved = useFavorites();
  const favoritesOnly = search.get("favorites") === "1";
  const savedIds = new Set(saved.favorites.map((item) => item.serviceSlug));
  const result = serviceDirectory(
    {
      ...filters,
      // Native history updates keep pagination local to the loaded directory.
      // Read all query filters here so Back/Forward restores the same results.
      q: search.get("q") ?? "",
      region: search.get("region") ?? "",
      page: search.get("page") ?? "1",
    },
    favoritesOnly
      ? serviceListings.filter((item) => savedIds.has(item.slug))
      : serviceListings,
    serviceCategories,
  );
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
    favorites: favoritesOnly,
    category: result.category?.id,
    q: result.query,
    region: result.region,
  };
  const categories = (
    <>
      <ServiceCategoryLink
        href={serviceDirectoryUrl({
          region: result.region,
          favorites: favoritesOnly,
        })}
        aria-current={!result.category ? "page" : undefined}
        prefetch={false}
      >
        <span className={styles.categoryName}>
          <ServiceCategoryIcon />
          <span className={styles.categoryLabel}>Barchasi</span>
        </span>
        <small>{serviceListings.length}</small>
      </ServiceCategoryLink>
      {serviceCategories.map((category) => (
        <ServiceCategoryLink
          key={category.id}
          href={serviceDirectoryUrl({
            favorites: favoritesOnly,
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
            <span className={styles.categoryLabel}>{category.name}</span>
          </span>
          <small>
            {category.id === "invitation"
              ? templateCount
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
          <div className={styles.sidebarHeading}>
            <p className={styles.sectionLabel}>YO‘NALISHLAR</p>
            <ServiceFavoritesFilter />
          </div>
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
              title={
                favoritesOnly
                  ? `Saralanganlar${result.category ? ` · ${result.category.name}` : ""}`
                  : (result.category?.name ?? "Barcha servislar")
              }
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
              <ServiceFavoritesStatus guestHint={favoritesOnly} />
              {(result.query || result.region) && (
                <p className={styles.activeFilters}>
                  {result.query && <>“{result.query}” bo‘yicha </>}
                  {result.region && <>{result.region} · </>}
                  <Link
                    href={serviceDirectoryUrl({
                      category: result.category?.id,
                      favorites: favoritesOnly,
                    })}
                    scroll={false}
                  >
                    Filtrlarni tozalash
                  </Link>
                </p>
              )}
              {favoritesOnly && !saved.ready ? (
                <p role="status">Saralanganlar yuklanmoqda…</p>
              ) : result.listings.length ? (
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
                  <h3>
                    {favoritesOnly
                      ? "Saralangan xizmat topilmadi"
                      : "Hozircha mos xizmat topilmadi"}
                  </h3>
                  <p>Boshqa nom yoki hudud bilan qidirib ko‘ring.</p>
                  <Link
                    href={serviceDirectoryUrl({
                      category: result.category?.id,
                      favorites: favoritesOnly,
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
