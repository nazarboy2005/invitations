"use client";
import { useEffect, useRef, useState } from "react";
import {
  type Invitation,
  type Locale,
} from "@taklifnoma/contracts";
import styles from "./static-image.module.css";

export function StaticImagePreview({
  invitation,
  locale = invitation.defaultLocale,
  compact = false,
}: {
  invitation: Invitation;
  locale?: Locale;
  compact?: boolean;
}) {
  const input = JSON.stringify({ invitation, locale });
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);
  const [retry, setRetry] = useState(0);
  const currentUrl = useRef("");
  useEffect(
    () => () => {
      if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
    },
    [],
  );
  useEffect(() => {
    const controller = new AbortController();
    let current = true;
    const timer = setTimeout(
      async () => {
        setBusy(true);
        setError("");
        try {
          const response = await fetch("/api/static-images/preview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: input,
            signal: controller.signal,
          });
          if (!response.ok)
            throw new Error(
              (await response.json()).error?.message || "Rasm tayyorlanmadi.",
            );
          const blob = await response.blob();
          if (current) {
            const nextUrl = URL.createObjectURL(blob);
            const previousUrl = currentUrl.current;
            currentUrl.current = nextUrl;
            setUrl(nextUrl);
            if (previousUrl)
              setTimeout(() => URL.revokeObjectURL(previousUrl), 1000);
          }
        } catch (e) {
          if (current)
            setError(e instanceof Error ? e.message : "Rasm tayyorlanmadi.");
        } finally {
          if (current) setBusy(false);
        }
      },
      compact ? 50 : 500,
    );
    return () => {
      current = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [input, compact, retry]);
  return (
    <div
      className={styles.preview}
      data-compact={compact || undefined}
      aria-busy={busy}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {url && (
        <img
          src={url}
          width={750}
          height={1050}
          alt="Rasm taklifnoma ko‘rinishi"
          draggable={false}
        />
      )}
      {!url && !error && (
        <span className={styles.status} role="status">
          Rasm tayyorlanmoqda…
        </span>
      )}
      {error && (
        <div className={styles.error} role="alert">
          {error}
          <button type="button" onClick={() => setRetry((n) => n + 1)}>
            Qayta urinish
          </button>
        </div>
      )}
      {busy && url && (
        <span className={styles.updating} role="status">
          Yangilanmoqda…
        </span>
      )}
    </div>
  );
}

export function StaticImageFullPreview({
  invitation,
}: {
  invitation: Invitation;
}) {
  return (
    <section
      style={{
        padding: "80px 16px 24px",
        minHeight: "100dvh",
        background: "#e9e3d8",
      }}
    >
      <StaticImagePreview invitation={invitation} locale={invitation.defaultLocale} />
    </section>
  );
}
