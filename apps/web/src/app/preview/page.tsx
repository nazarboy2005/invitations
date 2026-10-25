import { redirect } from "next/navigation";
import { templateById } from "@taklifnoma/contracts";
import { FullTemplatePreview } from "@/modules/catalog/full-template-preview";
import { getCatalog } from "@/server/catalog";

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
    qaSilent?: string | string[];
    qaLongNames?: string | string[];
    qaReducedMotion?: string | string[];
    qaMobile?: string | string[];
    card?: string | string[];
    poster?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const templateId = Array.isArray(params.template)
    ? params.template[0]
    : params.template;
  const draftId = Array.isArray(params.draft) ? params.draft[0] : params.draft;
  const demoParam = Array.isArray(params.demo) ? params.demo[0] : params.demo;
  const qaSilentParam = Array.isArray(params.qaSilent)
    ? params.qaSilent[0]
    : params.qaSilent;
  const qaLongNamesParam = Array.isArray(params.qaLongNames)
    ? params.qaLongNames[0]
    : params.qaLongNames;
  const qaReducedMotionParam = Array.isArray(params.qaReducedMotion)
    ? params.qaReducedMotion[0]
    : params.qaReducedMotion;
  const qaMobileParam = Array.isArray(params.qaMobile)
    ? params.qaMobile[0]
    : params.qaMobile;
  const template = templateId ? templateById(templateId) : undefined;

  if (template) {
    const cardPreview = params.card === "1";
    const catalog = cardPreview ? { templates: [] } : await getCatalog();
    return (
      <FullTemplatePreview
        template={template}
        cardPreview={cardPreview}
        posterCapture={params.poster === "1"}
        canSelect={catalog.templates.some((item) => item.id === template.id)}
        canCreate={catalog.templates.some(
          (item) => item.id === template.id && item.published,
        )}
        draftId={draftId}
        demo={demoParam === "1"}
        silentPlayback={qaSilentParam === "1"}
        longNames={qaLongNamesParam === "1"}
        qaReducedMotion={qaReducedMotionParam === "1"}
        qaMobile={qaMobileParam === "1"}
      />
    );
  }

  redirect("/templates");
}
