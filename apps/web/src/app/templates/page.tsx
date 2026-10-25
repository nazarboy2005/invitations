import Link from "next/link";
import { ArrowLeft, Flower2 } from "lucide-react";
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

export default async function TemplatesPage() {
  const catalog = await getCatalog();
  return (
    <div className={`${styles.page} ${display.variable} ${sans.variable}`}>
      <SiteHeader />
      <main id="main" className={`container ${styles.main}`}>
        <Link href="/#templates" className={styles.back}>
          <ArrowLeft size={15} /> Bosh sahifaga
        </Link>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>
              <Flower2 size={15} strokeWidth={1.3} /> To‘liq kolleksiya
            </p>
            <h1>
              Har bir quvonchga
              <br />
              <em>o‘ziga xos dizayn.</em>
            </h1>
          </div>
          <div className={styles.intro}>
            <span>{catalog.templates.length} ta dizayn</span>
            <p>
              Kategoriyani tanlang yoki nomi bilan qidiring. Dizayn ustiga
              bosing — narxi va to‘liq ko‘rinishi bilan tanishing.
            </p>
          </div>
        </header>
        <TemplateGallery
          templates={catalog.templates}
          categories={catalog.categories}
        />
        <footer className={styles.footer}>
          <Flower2 size={19} strokeWidth={1.1} />
          <p>
            Ko‘nglingizga mosini topdingizmi? Dizaynni ochib, o‘z
            taklifnomangizni yarating.
          </p>
          <Link href="/#why-us">
            Taklifnoma imkoniyatlari <ArrowLeft size={14} />
          </Link>
        </footer>
      </main>
    </div>
  );
}
