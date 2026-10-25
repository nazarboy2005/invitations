import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Flower2,
  Gift,
  Heart,
  MapPin,
  Navigation,
  Palette,
  UsersRound,
} from "lucide-react";
import styles from "./why-us.module.css";

export function WhyUs({ previewImage }: { previewImage?: string }) {
  return (
    <section
      id="why-us"
      className={styles.section}
      aria-labelledby="why-us-title"
    >
      <div className={`container ${styles.inner}`}>
        <header className={styles.heading}>
          <h2 id="why-us-title">Nega aynan biz?</h2>
          <p>
            Bir qarashda hayrat. Har bir bosishda qulaylik.
            <br />
            Sizning kuningiz uchun o‘ylangan kichik, ammo muhim tafsilotlar.
          </p>
        </header>
        <div className={styles.grid}>
          <article className={`${styles.card} ${styles.design}`}>
            <span className={styles.label}>
              <Palette size={15} aria-hidden="true" /> Sizning uslubingiz
            </span>
            <div className={styles.designArt} aria-hidden="true">
              <div className={styles.backSheet}>
                <Flower2 size={32} strokeWidth={1} />
                <span>
                  Quvonchga
                  <br />
                  taklif etamiz
                </span>
              </div>
              <div className={styles.invitation}>
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt=""
                    fill
                    sizes="(max-width: 600px) 190px, 250px"
                  />
                ) : (
                  <Flower2 size={64} />
                )}
                <span className={styles.invitationCaption}>
                  Sizning hikoyangiz
                  <br />
                  <i>shu yerdan boshlanadi.</i>
                </span>
              </div>
              <span className={styles.designSeal}>
                <Flower2 size={24} strokeWidth={1} />
              </span>
              <span className={styles.swatches}>
                <i />
                <i />
                <i />
                <span>O‘zingizga xos.</span>
              </span>
            </div>
            <div className={styles.designCopy}>
              <h3>
                Shunchaki taklif emas.
                <br />
                <em>Sizning didingiz.</em>
              </h3>
              <p>
                Milliy naqshlar yoki nafis minimalizm. O‘z ismlaringiz,
                suratlaringiz va sevimli kuyingiz bilan.
              </p>
              <Link href="/templates" className={styles.designLink}>
                Dizaynlarni ko‘rish{" "}
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </article>
          <article className={`${styles.card} ${styles.location}`}>
            <span className={styles.label}>
              <MapPin size={15} aria-hidden="true" /> Manzil aniq
            </span>
            <div className={styles.mapArt} aria-hidden="true">
              <svg
                viewBox="0 0 500 250"
                fill="none"
                preserveAspectRatio="xMidYMid slice"
              >
                <path
                  d="M-30 68 540 184M90-20 204 280M367-20 253 280M-20 225 525 20"
                  stroke="#fdfbf3"
                  strokeWidth="25"
                />
                <path
                  d="m-30 68 570 116M90-20l114 300M367-20 253 280M-20 225 525 20"
                  stroke="#e2d5b9"
                  strokeWidth="1"
                />
                <rect
                  x="45"
                  y="115"
                  width="68"
                  height="46"
                  rx="18"
                  transform="rotate(12 45 115)"
                  fill="#e6d7b5"
                />
                <rect
                  x="378"
                  y="174"
                  width="75"
                  height="54"
                  rx="22"
                  transform="rotate(-18 378 174)"
                  fill="#e6d7b5"
                />
                <path
                  className={styles.route}
                  d="m104 200 79-30 93-36 29-76"
                  stroke="#8a641c"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="7 8"
                />
                <circle
                  cx="104"
                  cy="200"
                  r="8"
                  fill="#8a641c"
                  stroke="#fffdf6"
                  strokeWidth="4"
                />
              </svg>
              <span className={styles.destination}>
                <MapPin size={24} />
                <i />
              </span>
              <span className={styles.mapPill}>
                <Navigation size={13} /> Google Maps bilan
              </span>
            </div>
            <div className={styles.copy}>
              <h3>
                “Qayerda ekan?”
                <br />
                <em>degan savol qolmaydi.</em>
              </h3>
              <p>
                Manzil taklifnomaning o‘zida. Mehmonlar Google Maps orqali
                yo‘lni bir bosishda ochadi.
              </p>
            </div>
          </article>
          <article className={`${styles.card} ${styles.rsvp}`}>
            <span className={styles.label}>
              <UsersRound size={15} aria-hidden="true" /> Mehmonlar javobi
            </span>
            <div className={styles.replyArt} aria-hidden="true">
              <div className={styles.avatars}>
                <span>M</span>
                <span>A</span>
                <span>S</span>
                <i>
                  <Check size={18} />
                </i>
              </div>
              <span className={styles.replyBubble}>
                Albatta, kelamiz! <Heart size={12} fill="currentColor" />
              </span>
            </div>
            <div className={styles.copy}>
              <h3>
                Kim keladi?
                <br />
                <em>Oldindan biling.</em>
              </h3>
              <p>
                Mehmonlar kelishini tasdiqlaydi. Siz javoblarni shaxsiy
                kabinetingizda kuzatib borasiz.
              </p>
            </div>
          </article>
          <article className={`${styles.card} ${styles.wishes}`}>
            <span className={styles.label}>
              <Heart size={15} aria-hidden="true" /> Samimiy tilaklar
            </span>
            <div className={styles.wishArt} aria-hidden="true">
              <span className={styles.quoteMark}>“</span>
              <span className={styles.handwriting}>
                Baxtingiz bir umr
                <br />
                butun bo‘lsin!
              </span>
              <Heart className={styles.wishHeart} size={23} strokeWidth={1} />
            </div>
            <div className={styles.copy}>
              <h3>
                Bir kunlik bayram.
                <br />
                <em>Bir umrlik so‘zlar.</em>
              </h3>
              <p>
                Yaqinlaringizning tabriklarini bir joyda jamlang. Tilaklarni
                ko‘rib chiqib, taklifnomada ko‘rsating.
              </p>
            </div>
          </article>
          <article className={`${styles.card} ${styles.gifting}`}>
            <span className={styles.label}>
              <Gift size={15} aria-hidden="true" /> To‘yona
            </span>
            <div className={styles.giftArt} aria-hidden="true">
              <div className={styles.giftNote}>
                <Heart size={16} strokeWidth={1} />
                <span>Chin dildan.</span>
              </div>
              <div className={styles.envelope}>
                <span className={styles.waxSeal}>
                  <Flower2 size={21} strokeWidth={1} />
                </span>
              </div>
            </div>
            <div className={styles.copy}>
              <h3>
                Ezgu niyatga
                <br />
                <em>qulay bir yo‘l.</em>
              </h3>
              <p>
                To‘yona uchun karta ma’lumotlarini ulashing. Ixtiyoriy yuklangan
                cheklarni o‘zingiz tekshirasiz.
              </p>
            </div>
          </article>
        </div>
        <footer className={styles.footer}>
          <span>
            <Check size={15} aria-hidden="true" /> Kerakli bo‘limlarni o‘zingiz
            tanlaysiz.
          </span>
          <p>
            Vizual misollar — namuna. Bo‘limlar tanlangan dizaynga qarab mavjud.
          </p>
        </footer>
      </div>
    </section>
  );
}
