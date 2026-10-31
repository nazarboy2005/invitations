import { publicAsset } from "../lib/public-asset";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { InvitationProcess } from "./invitation-process";
import styles from "./invitation-steps.module.css";

export function InvitationSteps({ children }: { children: ReactNode }) {
  return (
    <div className={styles.scrollTrack} data-invitation-track>
      <div className={styles.stage} data-invitation-stage>
        <section
          id="how-it-works"
          className={styles.section}
          aria-labelledby="process-title"
        >
          <div className={styles.photograph} aria-hidden="true">
            <picture>
              <source
                media="(max-width: 700px)"
                srcSet={publicAsset("/images/home/invitation-steps-mobile-full.webp")}
              />
              <Image
                src={publicAsset("/images/home/invitation-steps.webp")}
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
            <InvitationProcess />
          </div>
        </section>
        {children}
      </div>
    </div>
  );
}
