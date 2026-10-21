import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Flower2,
  Globe2,
  Heart,
  Mail,
  MapPin,
  Music2,
  Plus,
  Sparkles,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { getCatalog, getPublishedInvitationCount } from "@/server/catalog";
import { TemplateGallery } from "@/modules/catalog/template-gallery";
import styles from "./home.module.css";
import { display, script, sans } from "./platform-fonts";
import { SmoothScroll } from "@/components/smooth-scroll";
import { DesignRating } from "@/components/design-rating";
import { HeroArtwork } from "@/components/hero-artwork";

const steps = [
  {
    title: "Ko‘nglingizga mosini tanlang",
    text: "Milliy naqshlardan nafis minimalizmgacha. Dizaynni ochib, har bir tafsilotini ko‘ring.",
    icon: Sparkles,
  },
  {
    title: "O‘z hikoyangizni qo‘shing",
    text: "Ismlar, sana, manzil va samimiy so‘zlaringiz. Taklifnomani o‘zingizga xos qiling.",
    icon: Heart,
  },
  {
    title: "Yaqinlaringizni chorlang",
    text: "Tayyor taklifnomangiz havolasini ulashing. Quvonchli kuningizga birga hozirlik ko‘ring.",
    icon: Mail,
  },
];

const questions = [
  {
    title: "Taklifnoma yaratish uchun dasturlashni bilish kerakmi?",
    answer:
      "Yo‘q. Tayyor dizaynni tanlab, ma’lumotlaringizni kiritasiz. Natijani yaratish jarayonidayoq ko‘rib borishingiz mumkin.",
  },
  {
    title: "Dizaynni tanlashdan oldin to‘liq ko‘rsam bo‘ladimi?",
    answer:
      "Ha. Har bir dizayn ostidagi “Ko‘rish” tugmasi uning to‘liq namunasini ochadi. Ochilish sahnasi, harakatlar va bo‘limlarni bemalol ko‘rib chiqing.",
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
  const [catalog, publishedCount] = await Promise.all([
    getCatalog(true),
    getPublishedInvitationCount(),
  ]);
  const visibleTemplates = catalog.templates.filter(
    (template) => template.published || template.id === "anor",
  );
  const heroTemplate =
    visibleTemplates.find((template) => template.id === "anor") ??
    visibleTemplates[0];
  const secondaryTemplate =
    visibleTemplates.find((template) => template.id === "sahifa") ??
    visibleTemplates.find((template) => template.id !== heroTemplate?.id);
  const artwork = (template: NonNullable<typeof heroTemplate>) =>
    template.previewImage?.startsWith("/")
      ? template.previewImage
      : `/templates/${template.id}/${template.previewImage ?? "stage.webp"}`;

  return (
    <div
      className={`${styles.page} ${display.variable} ${script.variable} ${sans.variable}`}
    >
      <SmoothScroll />
      <SiteHeader />
      <main id="main">
        <div className={styles.heroStage}>
          <section
            className={`container ${styles.hero}`}
            aria-labelledby="hero-title"
          >
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>
                <Sparkles size={13} /> Quvonchingizning ilk sahifasi
              </p>
              <h1 id="hero-title">
                <span className={styles.heroTitle}>Yaxshi kunlar</span>{" "}
                <span className={styles.script}>birga boshlanadi.</span>
              </h1>
              <p className={styles.heroDescription}>
                Bir havolada butun bir hayajon. Eng aziz insonlaringizni
                hayotingizning eng go‘zal kuniga o‘zingizga xos taklif qiling.
              </p>
              <div className={styles.heroNote}>
                <span className={styles.noteIcon}>
                  <Flower2 size={25} strokeWidth={1.2} />
                </span>
                <p>
                  O‘zbekona ruh. Zamonaviy ko‘rinish.
                  <br />
                  <strong>Har bir tafsilotda — siz.</strong>
                </p>
              </div>
              <DesignRating />
            </div>
            <HeroArtwork>
              <div className={styles.artHalo} aria-hidden="true" />
              <span className={styles.orbitDot} aria-hidden="true" />
              <span className={styles.artLabel}>
                <span /> Bir qarashda — bayram
              </span>
              <svg
                className={styles.ribbon}
                viewBox="0 0 600 610"
                fill="none"
                aria-hidden="true"
              >
                <path d="M580 53C388-39 533 221 310 185S-38 242 80 395s449 48 390-70-203 105-16 226" />
                <path d="M570 45C378-47 523 213 300 177S-48 234 70 387s449 48 390-70-203 105-16 226" />
              </svg>
              {secondaryTemplate && (
                <Link
                  href={`/preview?template=${encodeURIComponent(secondaryTemplate.id)}`}
                  className={styles.backPreview}
                  aria-label={`${secondaryTemplate.name} dizaynini ko‘rish`}
                >
                  <Image
                    src={artwork(secondaryTemplate)}
                    alt=""
                    width={360}
                    height={640}
                    sizes="(max-width: 600px) 160px, 210px"
                  />
                </Link>
              )}
              {heroTemplate ? (
                <Link
                  href={`/preview?template=${encodeURIComponent(heroTemplate.id)}`}
                  className={styles.mainPreview}
                  aria-label={`${heroTemplate.name} dizaynini to‘liq ko‘rish`}
                >
                  <Image
                    src={artwork(heroTemplate)}
                    alt={`${heroTemplate.name} taklifnoma dizayni`}
                    width={360}
                    height={640}
                    sizes="(max-width: 600px) 210px, 270px"
                    preload
                  />
                  <span className={styles.previewCaption}>
                    {heroTemplate.name}{" "}
                    <span>
                      Ko‘rish <ArrowUpRight size={14} />
                    </span>
                  </span>
                </Link>
              ) : (
                <div className={styles.artFallback}>
                  <Flower2 size={75} strokeWidth={0.7} />
                  <span>Mehr bilan taklif qiling.</span>
                </div>
              )}
              <div className={styles.seal} aria-hidden="true">
                <Heart size={24} strokeWidth={1.1} />
                <span>chin dildan</span>
              </div>
              <div className={styles.invitationReady}>
                <span className={styles.readyIcon}>
                  <Check size={16} strokeWidth={2} />
                </span>
                <div>
                  <strong>Quvonch ulashishga tayyor</strong>
                  <span>
                    Javohir & Madina <i>· Namuna</i>
                  </span>
                </div>
                <Heart size={15} strokeWidth={1.4} />
              </div>
              <span className={styles.artAnnotation} aria-hidden="true">
                Bir taklif. Ming hayajon.
              </span>
              <Sparkles
                className={styles.artSparkle}
                size={32}
                strokeWidth={0.8}
                aria-hidden="true"
              />
            </HeroArtwork>
            <div className={styles.heroBottom}>
              <dl className={styles.heroStats}>
                <div>
                  <dt>
                    {
                      visibleTemplates.filter((template) => template.published)
                        .length
                    }
                  </dt>
                  <dd>nafis dizayn</dd>
                </div>
                <div>
                  <dt>4</dt>
                  <dd>yaqinlaringizga yaqin til</dd>
                </div>
                <div>
                  <dt>{publishedCount ? publishedCount : 3}</dt>
                  <dd>
                    {publishedCount
                      ? "nashr qilingan taklifnoma"
                      : "oddiy qadam"}
                  </dd>
                </div>
              </dl>
              <a href="#templates">
                Kolleksiyani kashf eting{" "}
                <span>
                  <ArrowDown size={16} />
                </span>
              </a>
            </div>
          </section>
        </div>

        <div
          className={styles.occasionStrip}
          aria-label="Quvonchli kunlaringiz uchun"
        >
          <div className={`container ${styles.occasionInner}`}>
            <span>Nikoh to‘yi</span>
            <Flower2 aria-hidden="true" />
            <span>Tug‘ilgan kun</span>
            <Flower2 aria-hidden="true" />
            <span>Oilaviy tantana</span>
            <Flower2 aria-hidden="true" />
            <span>Unutilmas lahzalar</span>
          </div>
        </div>

        <section
          id="templates"
          className={`container ${styles.templates}`}
          aria-labelledby="designs-title"
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>01 / Dizaynlar kolleksiyasi</p>
              <h2 id="designs-title">
                Har bir hikoyaning
                <br />
                o‘z <em>ohangi bor.</em>
              </h2>
            </div>
            <p>
              Ba’zi takliflar ilk qarashdayoq ko‘ngilga yaqin bo‘ladi.
              O‘zingiznikini toping — qolganini birga yaratamiz.
            </p>
          </div>
          <TemplateGallery
            templates={visibleTemplates}
            categories={catalog.categories}
          />
          <p className={styles.collectionNote}>
            <Sparkles size={15} strokeWidth={1.3} /> Har bir dizaynni tanlashdan
            oldin to‘liq ko‘rishingiz mumkin.
          </p>
        </section>

        <section
          id="how-it-works"
          className={styles.process}
          aria-labelledby="process-title"
        >
          <div className="container">
            <div className={styles.processHeading}>
              <p className={styles.eyebrow}>02 / Juda oddiy</p>
              <h2 id="process-title">
                Katta kun sari.
                <br />
                <em>Uch kichik qadam.</em>
              </h2>
              <p>
                Chiroyli taklifnoma yaratish ham
                <br />
                yoqimli bir lahzaga aylansin.
              </p>
            </div>
            <ol className={styles.steps}>
              {steps.map(({ title, text, icon: Icon }, index) => (
                <li key={title}>
                  <div className={styles.stepTop}>
                    <span>0{index + 1}</span>
                    <Icon size={28} strokeWidth={1.1} />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className={`container ${styles.detailsSection}`}
          aria-labelledby="details-title"
        >
          <div className={styles.detailIllustration} aria-hidden="true">
            <div className={styles.illustrationOrbit} />
            <div className={styles.letter}>
              <Flower2 size={26} strokeWidth={1} />
              <span>Sizni kutamiz</span>
              <strong>
                Javohir <i>&</i> Madina
              </strong>
              <div className={styles.letterRule} />
              <p>Bir kun. Bir umrga xotira.</p>
              <Heart size={18} strokeWidth={1} />
            </div>
            <span className={styles.floatingDetail}>
              <MapPin size={17} /> Manzil ham shu yerda
            </span>
            <span className={styles.floatingMusic}>
              <Music2 size={18} />
              <span>Sevimli kuy bilan</span>
              <i />
              <i />
              <i />
              <i />
            </span>
          </div>
          <div className={styles.detailCopy}>
            <p className={styles.eyebrow}>03 / Tafsilotlar gapirsin</p>
            <h2 id="details-title">
              Shunchaki taklifdan
              <br />
              <em>ko‘prog‘i.</em>
            </h2>
            <p>
              Mehmoningiz ochgan ilk lahzadan boshlab bayram kayfiyati. Samimiy
              so‘zlar, sevimli kuy va kerakli ma’lumotlar — barchasi bir joyda.
            </p>
            <ul>
              <li>
                <Globe2 size={20} strokeWidth={1.3} />
                <div>
                  <strong>Yaqinlaringizga yaqin tilda</strong>
                  <span>O‘zbek lotin va kirill, rus va ingliz tillari.</span>
                </div>
              </li>
              <li>
                <MapPin size={20} strokeWidth={1.3} />
                <div>
                  <strong>Kerakli tafsilotlar bir havolada</strong>
                  <span>Sana, manzil va bayram dasturi doim qo‘l ostida.</span>
                </div>
              </li>
              <li>
                <Heart size={20} strokeWidth={1.3} />
                <div>
                  <strong>Sizga xos kichik detallar</strong>
                  <span>O‘z so‘zlaringiz, suratlaringiz va musiqangiz.</span>
                </div>
              </li>
            </ul>
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
            <a href="#templates" className={styles.manifestoLink}>
              O‘z taklifnomangizni toping <ArrowUpRight size={18} />
            </a>
            <span className={styles.manifestoWatermark} aria-hidden="true">
              birga
            </span>
          </div>
        </section>

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
            <a href="#templates">Dizaynlar</a>
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
