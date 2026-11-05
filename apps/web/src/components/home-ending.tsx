import { BRAND_NAME } from "@/lib/brand";
import Link from "next/link";
import Image from "next/image";
import { ArrowUp, ArrowUpRight, Flower2, Headset, Plus } from "lucide-react";
import styles from "./home-ending.module.css";

const questions = [
  {
    title: "Qayerdan boshlayman?",
    answer:
      "Avval o‘zingizga yoqqan dizaynni tanlang va uning namunasini ochib ko‘ring. Keyin ismlar, sana va manzilni kiriting. Taklifnomangiz qanday ko‘rinayotganini yaratish davomida ko‘rib borasiz. Dasturlash yoki dizayn tajribasi kerak emas.",
  },
  {
    title: "Faqat to‘y uchunmi?",
    answer:
      "Yo‘q, quvonchli kunlar ko‘p. Kolleksiyada nikoh to‘yi, tug‘ilgan kun, oilaviy tantana va marosimlar uchun dizaynlar bor. Tadbir turini tanlasangiz, unga mos taklifnomalar ko‘rsatiladi.",
  },
  {
    title: "Taklifnomaga nimalar qo‘sha olaman?",
    answer:
      "Ismlar, samimiy taklif matni, sana va manzil — asosiy tafsilotlar sizniki. Tanlangan dizaynga qarab suratlar, musiqa, tadbir dasturi va boshqa bo‘limlarni ham qo‘shishingiz mumkin. Muharrirda aynan shu dizayn uchun mavjud imkoniyatlarni ko‘rasiz.",
  },
  {
    title: "Bir nechta tilda tayyorlasa bo‘ladimi?",
    answer:
      "Ha. O‘zbek lotin, o‘zbek kirill, rus va ingliz tillaridan keraklilarini tanlashingiz mumkin. Har bir til uchun matnni alohida yozasiz — taklifingiz har bir mehmon uchun tushunarli bo‘lsin.",
  },
  {
    title: "Mehmonlarga qanday yuboraman?",
    answer:
      "Taklifnomani nashr qilganingizdan so‘ng uning havolasini ulashasiz. Uni Telegram, WhatsApp yoki o‘zingizga qulay boshqa messenjer orqali yuborish mumkin. Mehmon havolani telefon yoki kompyuter brauzerida ochadi; alohida ilova o‘rnatishi shart emas.",
  },
  {
    title: "Yuborgandan keyin ma’lumotlarni o‘zgartirsam-chi?",
    answer:
      "Nashrdan keyin belgilangan tahrirlash muddati ichida manzil, dastur, matn, surat va musiqa kabi tafsilotlarni yangilashingiz mumkin. Havola o‘sha holicha qoladi. Asosiy ismlarni tuzatish yoki sanani ko‘chirish uchun shaxsiy kabinetingizdan so‘rov yuboriladi.",
  },
];

export function HomeHelp() {
  return (
    <section id="questions" className={styles.help} aria-labelledby="faq-title">
      <svg
        className={styles.helpWaves}
        viewBox="0 0 1774 887"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="help-paper"
            x1="887"
            y1="0"
            x2="887"
            y2="887"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#eee7dc" stopOpacity="0.4" />
            <stop offset="0.5" stopColor="#fffdf9" stopOpacity="0.1" />
            <stop offset="1" stopColor="#eee7dc" stopOpacity="0.38" />
          </linearGradient>
        </defs>
        <path
          d="M0 0H280C610 162 741 233 992 195C1290 150 1480 47 1650 0H1774V0H0Z"
          fill="url(#help-paper)"
        />
        <path
          d="M0 0H1320C1020 125 900 200 670 237C360 288 174 182 0 147V0Z"
          fill="url(#help-paper)"
        />
        <path
          d="M0 770C346 853 495 736 760 631C1120 490 1390 573 1774 434V887H0Z"
          fill="url(#help-paper)"
        />
      </svg>
      <div className={styles.helpInner}>
        <div className={styles.introduction}>
          <span className={styles.eyebrow}>Barchasi oddiy</span>
          <h2 id="faq-title">
            Kichik savollar.
            <br />
            <em>Katta kun oldidan.</em>
          </h2>
          <p>
            Iltimos, eng ko‘p beriladigan savollarga javoblarni quyidagi
            ro‘yxatdan toping.
          </p>
          <a href="https://t.me/HyperLean" className={styles.note}>
            <Headset size={42} strokeWidth={1} aria-hidden="true" />
            <span>
              Siz qidirgan javobni topa olmasangiz,
              <br />
              biz bilan bog‘laning.{" "}
              <ArrowUpRight size={17} strokeWidth={1.3} aria-hidden="true" />
            </span>
          </a>
        </div>
        <div className={styles.questions}>
          {questions.map((question, index) => (
            <details key={question.title} name="home-help">
              <summary>
                <span className={styles.number}>0{index + 1}</span>
                <span>{question.title}</span>
                <span className={styles.toggle}>
                  <Plus size={28} strokeWidth={1.3} aria-hidden="true" />
                </span>
              </summary>
              <div className={styles.answer}>
                <p>{question.answer}</p>
              </div>
            </details>
          ))}
          <p className={styles.afterword}>
            <Link href="/templates">
              Dizaynlar bilan tanishing{" "}
              <ArrowUpRight size={20} strokeWidth={1.3} aria-hidden="true" />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export function HomeCta() {
  return (
    <section className={styles.cta} aria-labelledby="invitation-title">
      <svg
        className={styles.ctaWaves}
        viewBox="0 0 2048 683"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="cta-paper"
            x1="1024"
            y1="0"
            x2="1024"
            y2="683"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#eee7dc" stopOpacity="0.52" />
            <stop offset="0.45" stopColor="#fffdf9" stopOpacity="0.15" />
            <stop offset="1" stopColor="#eee7dc" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        <path
          d="M0 0H2048V60C1740 144 1570 198 1310 113C1110 47 1010 -40 820 0C590 54 390 6 210 0H0Z"
          fill="url(#cta-paper)"
        />
        <path
          d="M340 0C630 65 800 186 1150 159C1480 132 1690 226 2048 279V0H340Z"
          fill="url(#cta-paper)"
        />
        <path
          d="M0 517C280 528 400 666 790 632C1170 600 1380 569 1630 506C1800 462 1920 422 2048 408V683H0Z"
          fill="url(#cta-paper)"
        />
      </svg>
      <div className={styles.invitation}>
        <div>
          <span className={styles.eyebrow}>Eng yaqinlaringiz uchun</span>
          <h2 id="invitation-title">
            Yaxshi kunlar
            <br />
            bir taklifdan boshlanadi.
          </h2>
        </div>
        <Link href="/templates" className={styles.start}>
          Taklifnomangizni tanlang{" "}
          <ArrowUpRight size={28} strokeWidth={1.3} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export function HomeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerMiddle}>
          <div className={styles.brandBlock}>
            <Link
              href="/"
              className={styles.brand}
              aria-label={`${BRAND_NAME} bosh sahifa`}
            >
              <Image
                className={styles.brandMark}
                src="/images/brand/fotiha-mark.png"
                alt=""
                width={1280}
                height={1169}
                aria-hidden="true"
              />
              {BRAND_NAME}
            </Link>
            <p>
              Bir kunlik bayram.
              <br />
              Bir umr eslanadigan taklif.
            </p>
          </div>
          <nav
            className={styles.footerNav}
            aria-label={`${BRAND_NAME} bo‘limlari`}
          >
            <span>Kashf eting</span>
            <Link href="/templates">
              Dizaynlar <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
            <a href="#why-us">Nega {BRAND_NAME}?</a>
            <a href="#how-it-works">Qanday ishlaydi</a>
          </nav>
          <nav className={styles.footerNav} aria-label="Foydali havolalar">
            <span>Siz uchun</span>
            <Link href="/dashboard">
              Shaxsiy kabinet <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
            <a href="#questions">Savol-javob</a>
          </nav>
          <a
            href="#main"
            className={styles.backTop}
            aria-label="Sahifa boshiga qaytish"
          >
            <ArrowUp size={20} strokeWidth={1.2} aria-hidden="true" />
            <span>Yuqoriga</span>
          </a>
        </div>
        <div className={styles.bottom}>
          <span>
            © {new Date().getFullYear()} {BRAND_NAME}
          </span>
          <span>O‘zbekistonda, mehr bilan yaratilgan.</span>
          <Flower2 size={18} strokeWidth={1} aria-hidden="true" />
        </div>
      </div>
    </footer>
  );
}
