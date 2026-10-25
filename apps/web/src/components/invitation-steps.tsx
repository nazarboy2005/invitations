import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Mail, Sparkles } from "lucide-react";
import styles from "./invitation-steps.module.css";

const steps = [
  {
    title: "Ko‘nglingizga mosini tanlang",
    text: "Turli uslubdagi nafis dizaynlar. Katta kuningiz uchun eng mosini toping.",
    icon: Sparkles,
    href: "/templates",
  },
  {
    title: "O‘z hikoyangizni qo‘shing",
    text: "Ismlar, sana, manzil va samimiy so‘zlaringiz. Har bir tafsilotda siz.",
    icon: Heart,
    href: "/studio",
  },
  {
    title: "Yaqinlaringizni chorlang",
    text: "Tayyor taklifnomangiz havolasini ulashing. Quvonchli kunga birga hozirlik ko‘ring.",
    icon: Mail,
    href: "/dashboard",
  },
];

export function InvitationSteps() {
  return (
    <section
      id="how-it-works"
      className={styles.section}
      aria-labelledby="process-title"
    >
      <div className={styles.photograph} aria-hidden="true">
        <picture>
          <source
            media="(max-width: 700px)"
            srcSet="/images/home/invitation-steps-mobile.webp"
          />
          <Image
            src="/images/home/invitation-steps.webp"
            alt=""
            fill
            sizes="100vw"
            unoptimized
          />
        </picture>
      </div>
      <div className={`container ${styles.inner}`}>
        <header className={styles.heading}>
          <p className={styles.eyebrow}>
            Sizning kuningiz. Sizning taklifnomangiz.
          </p>
          <h2 id="process-title">
            Katta kun sari.
            <br />
            <em>Uch kichik qadam.</em>
          </h2>
          <p className={styles.description}>
            Yaqinlaringizni eng go‘zal onlarga taklif qiling.
            <br /> Hammasi oson, hammasi o‘zingizga xos.
          </p>
          <Link href="/studio" className={styles.create}>
            Taklifnoma yaratish{" "}
            <ArrowRight size={20} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </header>
        <ol className={styles.steps}>
          {steps.map(({ title, text, icon: Icon, href }, index) => (
            <li key={title}>
              <Link href={href} className={styles.card}>
                <div className={styles.cardTop} aria-hidden="true">
                  <span className={styles.number}>
                    0{index + 1}
                    <i />
                  </span>
                  <span className={styles.icon}>
                    <Icon size={23} strokeWidth={1.2} />
                  </span>
                </div>
                <h3>{title}</h3>
                <div className={styles.cardBottom}>
                  <p>{text}</p>
                  <span className={styles.arrow} aria-hidden="true">
                    <ArrowRight size={19} strokeWidth={1.3} />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
