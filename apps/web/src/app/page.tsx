import { LayoutTemplate } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { getCatalog } from "@/server/catalog";
import { TemplateGallery } from "@/modules/catalog/template-gallery";
import styles from "./home.module.css";

export const dynamic = "force-dynamic";
export default async function Home() {
  const catalog = await getCatalog(true);
  const visibleTemplates = catalog.templates.filter(
    (template) => template.published || template.id === "anor",
  );
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className={`container ${styles.hero}`}>
          <div className={styles.heroCopy}>
            <span className={styles.occasion}>Taklifnoma</span>
            <h1>Yaqinlaringizga o‘zgacha taklif yuboring.</h1>
            <p>
              Har bir quvonchli kun uchun o‘zbekona ruhdagi taklifnoma yarating.
              Ma’lumotlaringizni kiriting va tayyor dizaynni tanlang.
            </p>
          </div>
          <div className={styles.emptyArt} aria-hidden="true">
            <LayoutTemplate size={56} strokeWidth={1} />
          </div>
        </section>
        <section id="templates" className={`container ${styles.templates}`}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionLabel}>Dizaynlar</p>
              <h2>Taklifnoma dizaynlarini tanlang</h2>
            </div>
            <p>
              Ma’lumotlaringizni saqlab, chop etishdan oldin istalgan nashr
              qilingan dizaynni ko‘rib tanlashingiz mumkin.
            </p>
          </div>
          <TemplateGallery
            templates={visibleTemplates}
            categories={catalog.categories}
          />
        </section>
      </main>
      <footer className="site-footer">
        <div className="container">
          <span>© {new Date().getFullYear()} Taklifnoma</span>
          <span>Mehr bilan taklif qiling.</span>
        </div>
      </footer>
    </>
  );
}
