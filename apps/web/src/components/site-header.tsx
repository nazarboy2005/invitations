import { BRAND_NAME } from "@/lib/brand";
import Link from "next/link";
import Image from "next/image";
import { Home, LayoutGrid } from "lucide-react";
import { getSessionUser } from "@/server/auth";
import styles from "./site-header.module.css";
import { ScrollHeader } from "./scroll-header";
import { display, sans } from "@/app/platform-fonts";
import { HeroMobileMenu } from "@/components/hero-mobile-menu";
import { SiteSounds } from "./site-sounds";
import { FavoritesLink, MobileFavoritesLink } from "@/modules/favorites/favorite-button";
import { AccountNavLink } from "@/components/account-nav-link";
import { SignOutControl } from "@/components/sign-out-control";
export async function SiteHeader({
  dashboard = false,
  catalog = false,
}: {
  dashboard?: boolean;
  catalog?: boolean;
}) {
  const user = await getSessionUser().catch(() => null);
  return (
    <>
    <ScrollHeader
      className={`${styles.header} ${styles.heroHeader} ${catalog ? styles.catalogHeader : ""} ${sans.className}`}
      followScroll
      yieldToCatalog={catalog}
    >
      <div className={styles.heroInner}>
        <Link
          href="/"
          className={styles.heroBrand}
          aria-label={`${BRAND_NAME} bosh sahifa`}
        >
          <Image
            className={styles.heroMark}
            src="/images/brand/fotiha-mark.png"
            alt=""
            width={1280}
            height={1169}
            priority
            aria-hidden="true"
          />
          <span className={styles.heroBrandText}>
            <span className={`${styles.heroBrandName} ${display.className}`}>
              {BRAND_NAME}
            </span>
            <span className={styles.heroBrandTagline}>Go'zal kunlar sari.</span>
          </span>
        </Link>
        {dashboard && user && (
          <SignOutControl enabled placement="phone" />
        )}
        <nav className={styles.heroNav} aria-label="Asosiy menyu">
          <Link href="/templates">Shablonlar</Link>
          <a href="https://t.me/fotiha_support_bot">Bog‘lanish</a>
          <Link href="/#why-us">Biz haqimizda</Link>
        </nav>
        <SiteSounds />
        <div className={styles.heroActions}>
          <FavoritesLink className={styles.heroFavorites} />
          <AccountNavLink
            signedIn={Boolean(user)}
            className={styles.heroAccount}
            dashboard={dashboard}
            icon
          />
          {dashboard && user && (
            <SignOutControl enabled placement="desktop" />
          )}
        </div>
        <HeroMobileMenu
          accountLink={<AccountNavLink signedIn={Boolean(user)} />}
          isAdmin={user?.isAdmin ?? false}
        />
      </div>
    </ScrollHeader>
      <nav className={`${styles.bottomNav} ${sans.className}`} aria-label="Mobil asosiy menyu">
        <Link href="/"><Home size={21} aria-hidden="true" />Asosiy</Link>
        <Link href="/templates"><LayoutGrid size={21} aria-hidden="true" />Shablonlar</Link>
        <MobileFavoritesLink />
        <AccountNavLink signedIn={Boolean(user)} dashboard={dashboard} icon />
      </nav>
    </>
  );
}
