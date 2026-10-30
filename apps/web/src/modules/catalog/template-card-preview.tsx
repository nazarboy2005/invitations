"use client";

import { publicTemplateId } from "@taklifnoma/contracts";

import { useEffect, useRef, useState } from "react";
import styles from "@/app/home.module.css";

/** Mount only the active card. Unmounting stops its timers, video, and requests. */
export function TemplateCardPreview({ templateId }: { templateId: string }) {
  const host = useRef<HTMLSpanElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(0);
  const [frameHeight, setFrameHeight] = useState(844);
  const [loaded, setLoaded] = useState(false);
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & {
        connection?: EventTarget & { saveData?: boolean };
      }
    ).connection;
    function sync() {
      setCanPlay(!motion.matches && !connection?.saveData);
    }
    sync();
    motion.addEventListener("change", sync);
    connection?.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      connection?.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    function ready(event: MessageEvent) {
      if (
        event.origin === location.origin &&
        event.source === frame.current?.contentWindow &&
        event.data?.type === "catalog-preview:ready"
      )
        setLoaded(true);
    }
    window.addEventListener("message", ready);
    return () => window.removeEventListener("message", ready);
  }, []);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const nextScale = entry.contentRect.width / 390;
      setScale(nextScale);
      // The mockup's fixed bezel makes its inner ratio vary slightly by size.
      // Fill that exact height so the poster cannot peek below the live frame.
      setFrameHeight(
        nextScale > 0
          ? Math.max(844, Math.ceil(entry.contentRect.height / nextScale))
          : 844,
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={host}
      className={styles.templatePlayback}
      aria-hidden="true"
      inert
    >
      {scale > 0 && canPlay && (
        <iframe
          ref={frame}
          title="Dizayn animatsiyasi"
          src={`/preview?template=${encodeURIComponent(publicTemplateId(templateId))}&card=1`}
          className={styles.templatePlaybackFrame}
          style={{
            height: frameHeight,
            transform: `scale(${scale})`,
            opacity: loaded ? 1 : 0,
          }}
          tabIndex={-1}
        />
      )}
    </span>
  );
}
