import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Flower2,
  MapPin,
  Music2,
  Navigation,
} from "lucide-react";
import { CinematicScroll } from "./cinematic-scroll";
import { CelebrationStory } from "./celebration-story";
import styles from "./why-us.module.css";

const chapters = [
  {
    id: "design",
    label: "Sizning uslubingiz",
    title: (
      <>
        Har bir hikoyaning
        <br />
        <em>o‘z uslubi bor.</em>
      </>
    ),
    text: "Milliy naqshlardan nafis minimalizmgacha. Ko‘nglingizga mos dizaynni tanlang.",
    image: "design-daylight",
    side: "left",
  },
  {
    id: "personal",
    label: "Sizning hikoyangiz",
    title: (
      <>
        Har bir
        <br />
        <em>tafsilotda siz.</em>
      </>
    ),
    text: "Ismlaringiz, suratlaringiz va sevimli kuyingiz bilan taklifnomani o‘zingizga xos qiling.",
    image: "personal-daylight",
    side: "right",
  },
  {
    id: "venue",
    label: "Uchrashadigan manzil",
    title: (
      <>
        Yaqinlaringiz
        <br />
        <em>yo‘lini topsin.</em>
      </>
    ),
    text: "Sana, vaqt va manzil bir joyda. Mehmonlaringiz xaritada yo‘lni bir bosishda ochadi.",
    image: "venue-daylight",
    side: "left",
  },
  {
    id: "together",
    label: "Eng yaqin insonlar",
    title: (
      <>
        Eng yaqinlaringiz
        <br />
        <em>bilan, birga.</em>
      </>
    ),
    text: "Kelish xabarlari va samimiy tilaklar bir joyda. Quvonchli kuningizga birga hozirlik ko‘ring.",
    image: "together-daylight",
    side: "right",
  },
] as const;

function InvitationPhone({ previewImage }: { previewImage: string }) {
  return (
    <div className={styles.phone}>
      <div className={styles.phoneScreen}>
        <Image
          src={previewImage}
          alt=""
          fill
          sizes="(max-width: 700px) 220px, 310px"
          className={styles.poster}
        />
        <span className={styles.phoneIsland} />
      </div>
    </div>
  );
}

function SceneDetail({
  chapter,
  previewImage,
}: {
  chapter: string;
  previewImage: string;
}) {
  if (chapter === "design")
    return (
      <div
        className={`${styles.detail} ${styles.designDetail}`}
        aria-hidden="true"
      >
        <div className={styles.paperBehind}>
          <Flower2 size={34} strokeWidth={0.8} />
          <span>J & M</span>
          <i>Birga boshlanadi.</i>
        </div>
        <InvitationPhone previewImage={previewImage} />
        <span className={styles.detailNote}>Bir samimiy taklifdan.</span>
      </div>
    );
  if (chapter === "personal")
    return (
      <div
        className={`${styles.detail} ${styles.personalDetail}`}
        aria-hidden="true"
      >
        <div className={styles.personalPaper}>
          <div className={styles.personalImage}>
            <Image
              src={previewImage}
              alt=""
              fill
              sizes="(max-width: 700px) 250px, 380px"
            />
          </div>
        </div>
        <div className={styles.musicNote}>
          <Music2 size={18} strokeWidth={1.4} />
          <span>
            Sevimli kuyingiz<small>Har bir lahzaga o‘z ohangi.</small>
          </span>
          <span className={styles.wave}>
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
    );
  if (chapter === "venue")
    return (
      <div
        className={`${styles.detail} ${styles.venueDetail}`}
        aria-hidden="true"
      >
        <svg
          className={styles.venueRoute}
          viewBox="0 0 400 420"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M35 375C110 350 60 255 160 240S282 155 250 95"
            stroke="#914358"
            strokeWidth="2.8"
            strokeDasharray="3 8"
            strokeLinecap="round"
          />
          <circle
            cx="35"
            cy="375"
            r="6"
            fill="#914358"
            stroke="#fffaf2"
            strokeWidth="2"
          />
        </svg>
        <div className={styles.venueMarker}>
          <MapPin size={29} strokeWidth={1.2} />
          <span />
        </div>
        <div className={styles.venueInfo}>
          <span>QUVONCHGA ELTUVCHI MANZIL</span>
          <h4>Toshkent</h4>
          <p>
            14 noyabr <i /> 18:00
          </p>
          <div className={styles.venueNavigation}>
            <Navigation size={13} /> Google Maps orqali{" "}
            <ArrowUpRight size={14} />
          </div>
        </div>
      </div>
    );
  return null;
}

export function WhyUs({
  previewImage = "/templates/anor/preview.webp",
}: {
  previewImage?: string;
}) {
  return (
    <section
      id="why-us"
      className={styles.section}
      aria-labelledby="why-us-title"
    >
      <header className={`container ${styles.heading}`}>
        <h2 id="why-us-title">Nega aynan biz?</h2>
        <p>
          Bir qarashda hayrat. Har bir bosishda qulaylik.
          <br />
          Sizning kuningiz uchun o‘ylangan kichik, ammo muhim tafsilotlar.
        </p>
      </header>
      <CinematicScroll className={styles.track} stageClassName={styles.stage}>
        {chapters.map((chapter, index) => (
          <article
            key={chapter.id}
            className={styles.scene}
            data-cinematic-scene
            data-scene={chapter.id}
            data-side={chapter.side}
            aria-labelledby={`scene-${chapter.id}`}
          >
            <div className={styles.photograph} data-cinematic-image>
              <picture>
                <source
                  media="(max-width: 700px)"
                  srcSet={`/images/home/cinematic/${chapter.image}-mobile.webp`}
                />
                <Image
                  src={`/images/home/cinematic/${chapter.image}.webp`}
                  alt=""
                  fill
                  sizes="100vw"
                  unoptimized
                />
              </picture>
            </div>
            <div className={styles.shade} />
            <div className={styles.chapter} aria-hidden="true">
              <span>0{index + 1}</span>
              <i />
              04
            </div>
            <SceneDetail chapter={chapter.id} previewImage={previewImage} />
            <div className={styles.copy} data-cinematic-copy>
              <p className={styles.eyebrow}>{chapter.label}</p>
              <h3 id={`scene-${chapter.id}`}>{chapter.title}</h3>
              <p className={styles.description}>{chapter.text}</p>
              {index === chapters.length - 1 && (
                <Link href="/templates" className={styles.action}>
                  Dizaynlarni ko‘rish <ArrowUpRight size={19} />
                </Link>
              )}
            </div>
            <span className={styles.sceneCaption} aria-hidden="true">
              VISOL <i /> Birga boshlanadi.
            </span>
          </article>
        ))}
      </CinematicScroll>
      <CelebrationStory />
    </section>
  );
}
