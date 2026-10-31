"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import {
  retryFavorites,
  toggleFavorite,
  useFavorites,
} from "./favorites-store";
import styles from "./favorites.module.css";

export function FavoriteButton({
  templateId,
  name,
  overlay = false,
}: {
  templateId: string;
  name: string;
  overlay?: boolean;
}) {
  const { favorites, ready, busy } = useFavorites();
  const saved = favorites.some((item) => item.templateId === templateId);
  return (
    <button
      type="button"
      className={`${styles.button} ${overlay ? styles.overlay : ""}`}
      aria-label={`${name}: ${saved ? "saralanganlardan olib tashlash" : "saralanganlarga qo‘shish"}`}
      title={
        saved ? "Saralanganlardan olib tashlash" : "Saralanganlarga qo‘shish"
      }
      aria-pressed={saved}
      disabled={!ready || busy}
      onClick={() => {
        void toggleFavorite(templateId);
      }}
    >
      <Heart
        size={18}
        strokeWidth={1.6}
        fill={saved ? "currentColor" : "none"}
        aria-hidden="true"
      />
    </button>
  );
}

export function FavoritesLink({ className }: { className?: string }) {
  const { favorites, ready } = useFavorites();
  return (
    <Link href="/templates?favorites=1" className={className ?? styles.link}>
      <Heart size={17} aria-hidden="true" /> Saralanganlar
      {ready && favorites.length > 0 ? ` · ${favorites.length}` : ""}
    </Link>
  );
}

export function FavoritesStatus({
  guestHint = false,
}: {
  guestHint?: boolean;
}) {
  const { userId, error, ready, busy } = useFavorites();
  return (
    <>
      {error && (
        <p className={styles.status} role="alert">
          {error}{" "}
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              void retryFavorites();
            }}
          >
            Qayta urinish
          </button>
        </p>
      )}
      {guestHint && ready && !userId && (
        <p className={styles.status}>
          Bu qurilmada saqlanadi. Boshqa qurilmalarda ham ko‘rish uchun{" "}
          <Link href="/dashboard">hisobingizga kiring</Link>.
        </p>
      )}
    </>
  );
}
