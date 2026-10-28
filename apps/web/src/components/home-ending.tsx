import Link from "next/link";
import { ArrowUp, ArrowUpRight, Flower2, Plus } from "lucide-react";
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
      <div className={styles.helpInner}>
        <div className={styles.introduction}>
          <span className={styles.eyebrow}>Barchasi oddiy</span>
          <h2 id="faq-title">
            Kichik savollar.
            <br />
            <em>Katta kun oldidan.</em>
          </h2>
          <p>
            Ilk tanlovdan birinchi yuborilgan taklifgacha — bilish foydali
            bo‘lgan javoblar shu yerda.
          </p>
          <div className={styles.note}>
            <Flower2 size={30} strokeWidth={0.9} aria-hidden="true" />
            <span>
              Siz quvonchli kunni o‘ylang.
              <br />
              Tafsilotlarni birga tartiblaymiz.
            </span>
          </div>
        </div>
        <div className={styles.questions}>
          {questions.map((question, index) => (
            <details key={question.title} name="home-help" open={index === 0}>
              <summary>
                <span className={styles.number}>0{index + 1}</span>
                <span>{question.title}</span>
                <span className={styles.toggle}>
                  <Plus size={17} strokeWidth={1.3} aria-hidden="true" />
                </span>
              </summary>
              <div className={styles.answer}>
                <p>{question.answer}</p>
              </div>
            </details>
          ))}
          <p className={styles.afterword}>
            Avval ko‘ring, keyin tanlang.{" "}
            <Link href="/templates">
              Dizaynlar bilan tanishing{" "}
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export function HomeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.invitation}>
          <div>
            <span className={styles.eyebrow}>Eng yaqinlaringiz uchun</span>
            <h2>
              Yaxshi kunlar
              <br />
              <em>bir taklifdan boshlanadi.</em>
            </h2>
          </div>
          <Link href="/templates" className={styles.start}>
            Taklifnomangizni tanlang{" "}
            <ArrowUpRight size={20} strokeWidth={1.3} aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.footerMiddle}>
          <div className={styles.brandBlock}>
            <Link
              href="/"
              className={styles.brand}
              aria-label="Visol bosh sahifa"
            >
              <svg viewBox="0 0 32 36" fill="none" aria-hidden="true">
                <path
                  d="m16 1 4.3 12.7L32 18l-11.7 4.3L16 35l-4.3-12.7L0 18l11.7-4.3L16 1Z"
                  fill="currentColor"
                />
              </svg>
              visol
            </Link>
            <p>
              Bir kunlik bayram.
              <br />
              Bir umr eslanadigan taklif.
            </p>
          </div>
          <nav className={styles.footerNav} aria-label="Visol bo‘limlari">
            <span>Kashf eting</span>
            <Link href="/templates">
              Dizaynlar <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
            <a href="#why-us">Nega Visol?</a>
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
          <span>© {new Date().getFullYear()} Visol</span>
          <span>O‘zbekistonda, mehr bilan yaratilgan.</span>
          <Flower2 size={18} strokeWidth={1} aria-hidden="true" />
        </div>
      </div>
    </footer>
  );
}
