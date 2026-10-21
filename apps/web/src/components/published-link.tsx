"use client";

import { useEffect, useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import styles from "./published-link.module.css";

export function PublishedLink({
  slug,
  canonicalUrl,
  compact = false,
}: {
  slug: string;
  canonicalUrl?: string;
  compact?: boolean;
}) {
  const [url, setUrl] = useState(canonicalUrl ?? `/i/${slug}`);
  const [message, setMessage] = useState("");
  useEffect(() => {
    setUrl(canonicalUrl ?? new URL(`/i/${slug}`, window.location.origin).href);
  }, [canonicalUrl, slug]);
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Havola nusxalandi.");
    } catch {
      setMessage("Havolani quyidagi maydondan tanlab nusxalang.");
    }
  }
  return (
    <section
      className={compact ? styles.compact : styles.panel}
      aria-label="Taklifnoma havolasi"
    >
      {!compact && (
        <>
          <div className={styles.heading}>
            <Check size={18} />
            <strong>Taklifnomangiz tayyor</strong>
          </div>
          <p>Havolani mehmonlaringizga yuborishingiz mumkin.</p>
        </>
      )}
      <input
        aria-label="Ommaviy taklifnoma havolasi"
        readOnly
        value={url}
        onFocus={(event) => event.currentTarget.select()}
      />
      <div className={styles.actions}>
        <button type="button" onClick={copy}>
          <Copy size={15} /> Nusxalash
        </button>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <ExternalLink size={15} /> Ochish
        </a>
      </div>
      <span className={styles.status} role="status" hidden={!message}>
        {message}
      </span>
    </section>
  );
}
