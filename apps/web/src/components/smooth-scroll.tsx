"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/** Light wheel smoothing. Touch devices keep their native, momentum-aware scroll. */
export function SmoothScroll() {
  useEffect(() => {
    const nativeScroll = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touch = window.matchMedia("(hover: none), (pointer: coarse)");
    let lenis: Lenis | undefined;
    function syncPreference() {
      lenis?.destroy();
      lenis = undefined;
      if (!nativeScroll.matches && !touch.matches) {
        lenis = new Lenis({
          autoRaf: true,
          lerp: 0.16,
          wheelMultiplier: 1,
          syncTouch: false,
          anchors: { offset: -112 },
          allowNestedScroll: true,
          stopInertiaOnNavigate: true,
          respectReducedMotion: true,
          prevent: (node) =>
            Boolean(
              node.closest(
                "input, textarea, select, [contenteditable='true'], [data-lenis-prevent]",
              ),
            ),
        });
      }
    }
    syncPreference();
    function dialogChanged(event: Event) {
      if ((event as CustomEvent<boolean>).detail) lenis?.stop();
      else lenis?.start();
    }
    nativeScroll.addEventListener("change", syncPreference);
    touch.addEventListener("change", syncPreference);
    window.addEventListener("catalog-dialog", dialogChanged);
    return () => {
      nativeScroll.removeEventListener("change", syncPreference);
      touch.removeEventListener("change", syncPreference);
      window.removeEventListener("catalog-dialog", dialogChanged);
      lenis?.destroy();
    };
  }, []);
  return null;
}
