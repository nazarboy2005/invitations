import Link from "next/link";
import { ChevronRight, Flower2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { TemplateGallery } from "@/modules/catalog/template-gallery";
import { getCatalog } from "@/server/catalog";
import { display, sans } from "@/app/platform-fonts";
import styles from "./templates.module.css";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Barcha taklifnoma dizaynlari",
  description:
    "Nikoh to‘yi, tug‘ilgan kun, nahorgi osh va boshqa quvonchli kunlar uchun dizaynlarni ko‘ring va o‘zingizga mosini tanlang.",
};

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; favorites?: string }>;
}) {
  const catalog = await getCatalog();
  const { category, favorites } = await searchParams;
  const initialCategory = catalog.categories.some(
    (item) => item.id === category,
  )
    ? category
    : "all";
  return (
    <div data-page-scrollbar="gold" className={`${styles.page} ${display.variable} ${sans.variable}`}>
      <SiteHeader catalog />
      <main id="main" className={styles.main}>
        <header className={styles.header}>
          <div className={`${styles.shell} ${styles.headerInner}`}>
            <div>
              <p className={styles.eyebrow}>
                <Flower2 size={15} strokeWidth={1.4} aria-hidden="true" />
                To‘liq kolleksiya <span>·</span> {catalog.templates.length}{" "}
                dizayn
              </p>
              <h1>
                Har bir quvonchga<span>o‘ziga xos dizayn.</span>
              </h1>
            </div>
            <div className={styles.intro}>
              <span className={styles.collection}>
                {catalog.templates.length} ta dizayn
              </span>
              <p>
                To‘y, marosim va boshqa muhim voqealar uchun eng chiroyli
                taklifnoma shablonlarini toping.
              </p>
            </div>
          </div>
        </header>
        <div className={`${styles.shell} ${styles.gallery}`}>
          <TemplateGallery
            key={`${initialCategory}:${favorites === "1"}`}
            favoritesOnly={favorites === "1"}
            initialCategory={initialCategory}
            templates={catalog.templates}
            categories={catalog.categories}
          />
          <footer className={styles.footer}>
            <Link href="/" className={styles.wordmark}>
              visol
            </Link>
            <p>Quvonchli kunlar chiroyli taklifdan boshlanadi.</p>
            <Link href="/#questions">
              Savollaringiz bormi? <ChevronRight size={14} aria-hidden="true" />
            </Link>
          </footer>
        </div>
      </main>
    </div>
  );
}
