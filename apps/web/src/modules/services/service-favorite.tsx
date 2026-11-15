"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Heart } from "lucide-react";
import {
  useFavorites,
  toggleFavorite,
  retryFavorites,
} from "@/modules/favorites/service-favorites-store";
import styles from "./services.module.css";

export function ServiceFavoriteButton({
  slug,
  name,
  overlay = false,
}: {
  slug: string;
  name: string;
  overlay?: boolean;
}) {
  const { favorites, ready, busy, error } = useFavorites();
  const saved = favorites.some((item) => item.serviceSlug === slug);
  return (
    <div className={overlay ? styles.cardFavorite : styles.detailFavorite}>
      <button
        type="button"
        className={styles.serviceFavoriteButton}
        aria-label={`${name}: ${saved ? "saralanganlardan olib tashlash" : "saralanganlarga qo‘shish"}`}
        title={
          saved ? "Saralanganlardan olib tashlash" : "Saralanganlarga qo‘shish"
        }
        aria-pressed={saved}
        disabled={!ready || busy}
        onClick={() => void toggleFavorite(slug)}
      >
        <Heart
          size={19}
          fill={saved ? "currentColor" : "none"}
          aria-hidden="true"
        />
        <span>Sevimlilar</span>
      </button>
      {error && (
        <span className={styles.favoriteError} role="alert">
          {error}{" "}
          <button
            type="button"
            disabled={busy}
            onClick={() => void retryFavorites()}
          >
            Qayta urinish
          </button>
        </span>
      )}
    </div>
  );
}
export function ServiceFavoritesFilter({
  className,
  iconOnly = true,
}: {
  className?: string;
  iconOnly?: boolean;
}) {
  const path = usePathname();
  const search = useSearchParams();
  const active =
    search.get("favorites") === "1" && !path.startsWith("/services/b/");
  const params = new URLSearchParams(
    path.startsWith("/services/b/") ? "" : search.toString(),
  );
  params.delete("page");
  if (active) params.delete("favorites");
  else params.set("favorites", "1");
  const base = path.startsWith("/services/b/") ? "/services" : path;
  return (
    <Link
      href={`${base}${params.size ? `?${params}` : ""}`}
      className={className ?? styles.serviceFavoritesFilter}
      aria-label={
        active ? "Barcha xizmatlarni ko‘rish" : "Saralangan xizmatlar"
      }
      title={active ? "Barcha xizmatlarni ko‘rish" : "Saralangan xizmatlar"}
      aria-current={active ? "page" : undefined}
      scroll={false}
      prefetch={false}
    >
      <Heart
        size={21}
        fill={active ? "currentColor" : "none"}
        aria-hidden="true"
      />
      {!iconOnly && " Saralanganlar"}
    </Link>
  );
}
export function ServiceFavoritesStatus({
  guestHint = false,
}: {
  guestHint?: boolean;
}) {
  const { userId, ready, error, busy } = useFavorites();
  return (
    <>
      {error && (
        <p role="alert">
          {error}{" "}
          <button
            type="button"
            disabled={busy}
            onClick={() => void retryFavorites()}
          >
            Qayta urinish
          </button>
        </p>
      )}
      {guestHint && ready && !userId && (
        <p className={styles.activeFilters}>
          Bu qurilmada saqlanadi. Boshqa qurilmalarda ham ko‘rish uchun{" "}
          <Link href="/dashboard">hisobingizga kiring</Link>.
        </p>
      )}
    </>
  );
}
