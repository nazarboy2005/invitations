import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Flower2,
  Heart,
  Plus,
  Sparkles,
} from "lucide-react";
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

const questions = [
  {
    title: "Taklifnoma yaratish uchun dasturlashni bilish kerakmi?",
    answer:
      "Yo‘q. Tayyor dizaynni tanlab, ma’lumotlaringizni kiritasiz. Natijani yaratish jarayonidayoq ko‘rib borishingiz mumkin.",
  },
  {
    title: "Dizaynni tanlashdan oldin to‘liq ko‘rsam bo‘ladimi?",
    answer:
      "Ha. Dizayn ustiga bosing. Ochilgan oynadagi “To‘liq ko‘rish” tugmasi orqali ochilish sahnasi, harakatlar va barcha bo‘limlarni ko‘rib chiqing.",
  },
  {
    title: "Taklifnoma qaysi tillarda bo‘lishi mumkin?",
    answer:
      "O‘zbek lotin, o‘zbek kirill, rus va ingliz tillari mavjud. Kerakli tillarni tanlab, har biri uchun o‘z matningizni kiritishingiz mumkin.",
  },
  {
    title: "Taklifnoma ichiga nimalar qo‘sha olaman?",
    answer:
      "Tadbirga mos ma’lumotlar, sana va manzil, dastur, suratlar hamda dizayn qo‘llab-quvvatlaydigan qo‘shimcha bo‘limlarni qo‘shishingiz mumkin. Ixtiyoriy bo‘limlarni muharrirda boshqarasiz.",
  },
];

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
            image: `/images/home/paper/${id === "bogi-eram" ? "bogi-eram-cover" : id}.webp`,
            href: `/preview?template=${encodeURIComponent(id)}`,
          },
        ]
      : [];
  });
  const heroTemplate =
    visibleTemplates.find((template) => template.id === "anor") ??
    visibleTemplates[0];
  const artwork = (template: NonNullable<typeof heroTemplate>) =>
    template.previewImage?.startsWith("/")
      ? template.previewImage
      : `/templates/${template.id}/${template.previewImage ?? "stage.webp"}`;

  return (
    <div
      className={`${styles.page} ${display.variable} ${script.variable} ${sans.variable}`}
    >
      <SmoothScroll />
      <SiteHeader hero />
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

        <section
          id="questions"
          className={`container ${styles.faq}`}
          aria-labelledby="faq-title"
        >
          <div>
            <p className={styles.eyebrow}>04 / Savol-javob</p>
            <h2 id="faq-title">
              Ko‘nglingizda
              <br />
              <em>savol qoldimi?</em>
            </h2>
            <p>
              Boshlashdan oldin bilish <br />
              foydali bo‘lgan bir necha narsa.
            </p>
            <ArrowDownRight size={48} strokeWidth={0.8} aria-hidden="true" />
          </div>
          <div className={styles.questions}>
            {questions.map((question) => (
              <details key={question.title}>
                <summary>
                  {question.title}
                  <Plus size={18} aria-hidden="true" />
                </summary>
                <p>{question.answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className={styles.manifesto} aria-labelledby="manifesto-title">
          <div className={`container ${styles.manifestoInner}`}>
            <Flower2 size={40} strokeWidth={0.8} aria-hidden="true" />
            <p className={styles.eyebrow}>
              Eng go‘zal kunlar, eng yaqin insonlar
            </p>
            <h2 id="manifesto-title">
              Bayram bir kun.
              <br />
              <span>Xotirasi bir umr.</span>
            </h2>
            <p>Hammasi esa bir samimiy taklifdan boshlanadi.</p>
            <Link href="/templates" className={styles.manifestoLink}>
              O‘z taklifnomangizni toping <ArrowUpRight size={18} />
            </Link>
            <span className={styles.manifestoWatermark} aria-hidden="true">
              birga
            </span>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={`container ${styles.footerTop}`}>
          <div>
            <Link
              className={styles.footerBrand}
              href="/"
              aria-label="Taklifnoma bosh sahifa"
            >
              <Flower2 size={26} strokeWidth={1.2} /> taklifnoma<span>.</span>
            </Link>
            <p>Yaxshi kunlar birga boshlanadi.</p>
          </div>
          <nav aria-label="Sahifa bo‘limlari">
            <Link href="/templates">Barcha dizaynlar</Link>
            <a href="#why-us">Nega biz?</a>
            <a href="#how-it-works">Qanday ishlaydi</a>
            <a href="#questions">Savol-javob</a>
            <Link href="/dashboard">
              Taklifnomalarim <ArrowUpRight size={13} />
            </Link>
          </nav>
        </div>
        <div className={`container ${styles.footerBottom}`}>
          <span>© {new Date().getFullYear()} Taklifnoma</span>
          <span>
            Mehr bilan yaratildi <Heart size={12} aria-hidden="true" />
          </span>
          <a href="#main">
            Yuqoriga <ArrowUpRight size={13} />
          </a>
        </div>
      </footer>
    </div>
  );
}
