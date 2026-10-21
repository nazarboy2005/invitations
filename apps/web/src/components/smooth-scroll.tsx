"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/** Homepage wheel inertia; touch, forms and invitation frames keep native scrolling. */
export function SmoothScroll() {
  useEffect(() => {
    const nativeScroll = window.matchMedia(
      "(prefers-reduced-motion: reduce), (pointer: coarse)",
    );
    let lenis: Lenis | undefined;
    function syncPreference() {
      lenis?.destroy();
      lenis = undefined;
      if (!nativeScroll.matches) {
        lenis = new Lenis({
          autoRaf: true,
          lerp: 0.065,
          wheelMultiplier: 0.85,
          syncTouch: false,
          anchors: { offset: -112 },
          allowNestedScroll: true,
          stopInertiaOnNavigate: true,
          respectReducedMotion: true,
        });
      }
    }
    syncPreference();
    nativeScroll.addEventListener("change", syncPreference);
    return () => {
      nativeScroll.removeEventListener("change", syncPreference);
      lenis?.destroy();
    };
  }, []);
  return null;
}
