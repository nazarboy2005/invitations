import { publicAsset } from "../lib/public-asset";

import { publicTemplateId } from "@taklifnoma/contracts";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { getCatalog } from "@/server/catalog";
import { TemplateGallery } from "@/modules/catalog/template-gallery";
import styles from "./home.module.css";
import { display, script, sans } from "./platform-fonts";
import { SmoothScroll } from "@/components/smooth-scroll";
import { LandingHero } from "@/components/landing-hero";
import { OccasionOrbit } from "@/components/occasion-orbit";
import { WhyUs } from "@/components/why-us";
import { selectFeaturedTemplates } from "@/modules/catalog/featured-templates";
import { PaperShowcase } from "@/components/paper-showcase";
import { InvitationSteps } from "@/components/invitation-steps";
import { HomeHelp, HomeFooter } from "@/components/home-ending";

export const dynamic = "force-dynamic";

export default async function Home() {
  const catalog = await getCatalog();
  const visibleTemplates = catalog.templates.filter(
    (template) => template.published,
  );
  const featuredTemplates = selectFeaturedTemplates(visibleTemplates);
  const showcasePapers = [
    "anor",
    "cloud-castle",
    "kuzgi-chinor",
    "bogi-eram",
  ].flatMap((id) => {
    const template = visibleTemplates.find((template) => template.id === id);
    return template
      ? [
          {
            id,
            name: template.name,
            description: template.description,
            image: publicAsset(`/images/home/paper/${id === "bogi-eram" ? "bogi-eram-cover" : id}.webp`),
            href: `/preview?template=${encodeURIComponent(publicTemplateId(id))}`,
          },
        ]
      : [];
  });
  const heroTemplate =
    visibleTemplates.find((template) => template.id === "anor") ??
    visibleTemplates[0];
  const artwork = (template: NonNullable<typeof heroTemplate>) =>
    template.previewImage?.startsWith("/")
      ? publicAsset(template.previewImage)
      : publicAsset(`/templates/${template.id}/${template.previewImage ?? "stage.webp"}`);

  return (
    <div
      data-page-scrollbar="gold"
      className={`${styles.page} ${display.variable} ${script.variable} ${sans.variable}`}
    >
      <SmoothScroll />
      <SiteHeader />
      <main id="main">
        <LandingHero />

        <OccasionOrbit />

        <section
          id="templates"
          className={`container ${styles.templates}`}
          aria-labelledby="designs-title"
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>01 / Siz uchun tanladik</p>
              <h2 id="designs-title">
                Har bir hikoyaning
                <br />
                o‘z <em>ohangi bor.</em>
              </h2>
            </div>
            <p>
              Turli uslub va quvonchli kunlar uchun tanlangan dizaynlar. To‘liq
              kolleksiyada yana ko‘plab hikoyalar sizni kutmoqda.
            </p>
          </div>
          <TemplateGallery
            templates={featuredTemplates}
            categories={catalog.categories}
            featured
          />
          <div className={styles.collectionCta}>
            <Link href="/templates" className={styles.collectionLink}>
              Barcha shablonlar <ArrowUpRight size={18} />
            </Link>
          </div>
          <p className={styles.collectionNote}>
            <Sparkles size={15} strokeWidth={1.3} /> Har bir dizaynni tanlashdan
            oldin to‘liq ko‘rishingiz mumkin.
          </p>
        </section>

        <WhyUs
          previewImage={heroTemplate ? artwork(heroTemplate) : undefined}
        />

        <InvitationSteps>
          <PaperShowcase papers={showcasePapers} />
        </InvitationSteps>

        <HomeHelp />
      </main>

      <HomeFooter />
    </div>
  );
}
