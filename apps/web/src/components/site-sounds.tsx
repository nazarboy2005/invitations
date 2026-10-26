"use client";

import { useEffect } from "react";
import {
  blockSiteSound,
  playSiteSound,
  quietSiteSound,
  resumeSiteSound,
  startSiteSound,
} from "./site-sound";

/** Quiet default-on effects, unlocked by normal interaction without extra UI. */
export function SiteSounds() {
  useEffect(() => {
    resumeSiteSound();
    const start = () => {
      void startSiteSound();
    };
    const key = (event: KeyboardEvent) => {
      if (!event.repeat) start();
    };
    const visibility = () =>
      document.hidden ? quietSiteSound() : resumeSiteSound();
    const dialog = (event: Event) => {
      const open = Boolean((event as CustomEvent<boolean>).detail);
      if (open) {
        blockSiteSound(true);
        blockSiteSound(false);
        playSiteSound("paper");
      }
      // Let the brief paper cue finish; no further effects play while previewing.
      blockSiteSound(open, false);
    };
    document.addEventListener("click", start, true);
    document.addEventListener("touchend", start, { passive: true });
    document.addEventListener("keydown", key);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("catalog-dialog", dialog);
    window.addEventListener("pagehide", quietSiteSound);
    window.addEventListener("pageshow", visibility);
    return () => {
      document.removeEventListener("click", start, true);
      document.removeEventListener("touchend", start);
      document.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("catalog-dialog", dialog);
      window.removeEventListener("pagehide", quietSiteSound);
      window.removeEventListener("pageshow", visibility);
      blockSiteSound(false);
      quietSiteSound();
    };
  }, []);
  return null;
}
