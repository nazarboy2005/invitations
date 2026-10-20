import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TEMPLATE_CATEGORIES, templateById } from "@taklifnoma/contracts";
import { SiteHeader } from "@/components/site-header";
import { FullTemplatePreview } from "@/modules/catalog/full-template-preview";
import { TemplateGallery } from "@/modules/catalog/template-gallery";
import { getCatalog } from "@/server/catalog";
import styles from "./preview.module.css";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Taklifnoma dizaynlari",
  robots: { index: false, follow: false },
};

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{
    template?: string | string[];
    draft?: string | string[];
    demo?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const templateId = Array.isArray(params.template)
    ? params.template[0]
    : params.template;
  const draftId = Array.isArray(params.draft) ? params.draft[0] : params.draft;
  const demoParam = Array.isArray(params.demo) ? params.demo[0] : params.demo;
  const template = templateId ? templateById(templateId) : undefined;

  if (template) {
    const catalog = await getCatalog();
    return (
      <FullTemplatePreview
        template={template}
        canSelect={catalog.templates.some((item) => item.id === template.id)}
        draftId={draftId}
        demo={demoParam === "1"}
      />
    );
  }

  const catalog = await getCatalog(true);
  return (
    <>
      <SiteHeader />
      <main id="main" className={styles.galleryPage}>
        <div className={styles.galleryHeader}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={16} /> Bosh sahifaga
          </Link>
          <p>Dizaynlar</p>
          <h1>Taklifnomalarni to‘liq ko‘ring</h1>
          <span>
            Har bir dizayn o‘zining asl ko‘rinishi va harakatlari bilan
            ochiladi.
          </span>
        </div>
        <TemplateGallery
          templates={catalog.templates.filter(
            (item) => item.published || item.id === "anor",
          )}
          categories={catalog.categories ?? TEMPLATE_CATEGORIES}
        />
      </main>
    </>
  );
}
