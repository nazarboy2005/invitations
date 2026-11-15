import { publicAsset } from "@/lib/public-asset";
import { SiteHeader } from "@/components/site-header";
import { display, sans } from "@/app/platform-fonts";
import styles from "@/modules/services/services.module.css";

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${styles.page} ${display.variable} ${sans.variable}`}
      data-page-scrollbar="services"
    >
      {/* Paint the root canvas too, so transparent scrollbar gutters reveal the backdrop. */}
      <style>{`
        html:has([data-page-scrollbar="services"]) {
          background: linear-gradient(rgb(255 248 240 / 18%), rgb(255 248 240 / 18%)),
            url("${publicAsset("/images/services/backdrops/wedding-desktop.webp")}") center / cover fixed;
        }
        @media (max-width: 900px) {
          html:has([data-page-scrollbar="services"]) {
            background-image: linear-gradient(rgb(255 248 240 / 18%), rgb(255 248 240 / 18%)),
              url("${publicAsset("/images/services/backdrops/wedding-mobile.webp")}");
          }
        }
      `}</style>
      <picture className={styles.backdrop} aria-hidden="true">
        <source
          media="(max-width: 900px)"
          srcSet={publicAsset("/images/services/backdrops/wedding-mobile.webp")}
        />
        {/* Native picture selects one locally packaged responsive backdrop. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={publicAsset("/images/services/backdrops/wedding-desktop.webp")}
          alt=""
          decoding="async"
          fetchPriority="high"
        />
      </picture>
      <SiteHeader catalog />
      <main id="main" className={styles.shell}>
        {children}
      </main>
    </div>
  );
}
