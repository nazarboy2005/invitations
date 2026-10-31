import { publicAsset } from "../lib/public-asset";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Heart,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";
import styles from "./landing-hero.module.css";
import { signature } from "@/app/platform-fonts";

const benefits = [
  { icon: Sparkles, lines: ["Zamonaviy", "dizaynlar"] },
  { icon: Smartphone, lines: ["Har qanday", "qurilmada"] },
  { icon: ShieldCheck, lines: ["Xavfsiz va", "ishonchli"] },
  { icon: Zap, lines: ["Tez va oson", "jarayon"] },
];

export function LandingHero() {
  return (
    <section
      className={`${styles.hero} ${signature.variable}`}
      aria-labelledby="hero-title"
    >
      <div className={styles.photograph}>
        <picture>
          <source
            media="(max-width: 900px)"
            srcSet={publicAsset("/images/home/invitation-scene-mobile.webp")}
          />
          <Image
            src={publicAsset("/images/home/invitation-scene.webp")}
            alt="Oq gullar yonida Ali va Malikaning telefondagi onlayn taklifnomasi va unga mos nafis qog‘oz taklifnoma"
            fill
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
            unoptimized
          />
        </picture>
      </div>
      <div className={styles.wash} aria-hidden="true" />
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Onlayn taklifnomalar</p>
        <h1 id="hero-title">
          <span>Eng muhim</span>
          <em>lahzalar uchun</em>
        </h1>
        <p className={styles.description}>
          To‘y, nikoh, marosim va boshqa tadbirlar uchun
          <br className={styles.desktopBreak} /> zamonaviy va nafis onlayn
          taklifnomalar yarating.
          <br className={styles.desktopBreak} /> Mehmonlaringizni oson va
          chiroyli tarzda taklif qiling.
        </p>
        <Link href="/studio" className={styles.create}>
          Taklifnoma yaratish{" "}
          <ArrowUpRight size={19} strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </div>
      <Link
        href="/templates"
        className={styles.artworkLink}
        aria-label="Taklifnoma dizaynlarini ko‘rish"
      />
      <div className={styles.portraitSpace} aria-hidden="true" />
      <div className={styles.benefitsPanel}>
        <ul className={styles.benefits} aria-label="Taklifnoma afzalliklari">
          {benefits.map(({ icon: Icon, lines }) => (
            <li key={lines[0]}>
              <Icon size={31} strokeWidth={1.15} aria-hidden="true" />
              <span>
                {lines[0]}
                <br />
                {lines[1]}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.signature} aria-hidden="true">
        Tabriklar,
        <br />
        endi onlayn!
        <svg viewBox="0 0 100 18" fill="none">
          <path d="M3 14C29 7 57 4 95 5" />
        </svg>
        <Heart className={styles.signatureHeart} size={14} strokeWidth={1.2} />
      </div>
      <svg
        className={styles.corner}
        viewBox="0 0 180 195"
        fill="none"
        aria-hidden="true"
      >
        <path d="M-6 1C33 18 58 52 65 99M83 120C130 130 163 157 178 197" />
        <path d="m66 107 3 9 9 3-9 3-3 9-3-9-9-3 9-3 3-9Z" />
      </svg>
    </section>
  );
}
