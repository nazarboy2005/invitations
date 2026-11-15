"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";
import styles from "./services.module.css";

export function ServiceShare({ name }: { name: string }) {
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
    <div className={styles.shareWrap}>
      <button
        type="button"
        className={styles.shareButton}
        onClick={() => void share()}
      >
        {message === "Havola nusxalandi" ? (
          <Check size={17} />
        ) : (
          <Share2 size={17} />
        )}
        Ulashish
      </button>
      <span role="status" className={styles.shareStatus}>
        {message}
      </span>
    </div>
  );
}
