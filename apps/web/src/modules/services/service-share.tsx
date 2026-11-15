"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";
import styles from "./services.module.css";

export function ServiceShare({
  name,
  compact = false,
}: {
  name: string;
  compact?: boolean;
}) {
  const [message, setMessage] = useState("");
  async function share() {
    const url = `${window.location.origin}${window.location.pathname}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setMessage("Havola nusxalandi");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setMessage("Havolani brauzer manzilidan nusxalang.");
    }
  }
  return (
    <div
      className={`${styles.shareWrap} ${compact ? styles.compactShare : ""}`}
    >
      <button
        type="button"
        className={styles.shareButton}
        onClick={() => void share()}
      >
        <span className={compact ? styles.actionIcon : undefined}>
          {message === "Havola nusxalandi" ? (
            <Check size={17} />
          ) : (
            <Share2 size={17} />
          )}
        </span>
        <span>Ulashish</span>
      </button>
      <span role="status" className={styles.shareStatus}>
        {message}
      </span>
    </div>
  );
}
