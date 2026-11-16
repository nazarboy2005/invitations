"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import styles from "./services.module.css";

/** Reveal each visible group in DOM (row) order, including cached covers. */
export function ServiceCardGrid({ children }: { children: ReactNode }) {
  const grid = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = grid.current!;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    const cards = Array.from(
      container.querySelectorAll<HTMLElement>("[data-service-card]"),
    );
    const animations = new Set<Animation>();
    const controller = new AbortController();
    const { signal } = controller;
    let stopped = false;
    const animate = (
      element: HTMLElement,
      frames: Keyframe[],
      options: KeyframeAnimationOptions,
    ) => {
      const animation = element.animate(frames, options);
      animations.add(animation);
      if (options.fill !== "both")
        animation.onfinish = () => animations.delete(animation);
      return animation;
    };

    // A slow or broken cover must never hold the directory blank indefinitely.
    // Late covers fade separately after the card has already been revealed.
    const covers = new Map<HTMLElement, Promise<void>>();
    for (const card of cards) {
      const image = card.querySelector("img");
      covers.set(
        card,
        new Promise<void>((resolve) => {
          if (!image || image.complete) return resolve();
          const finish = () => {
            if (!stopped && image.naturalWidth)
              animate(image, [{ opacity: 0 }, { opacity: 1 }], {
                duration: 240,
                easing: "ease-out",
              });
            resolve();
          };
          image.addEventListener("load", finish, { once: true, signal });
          image.addEventListener("error", () => resolve(), {
            once: true,
            signal,
          });
          signal.addEventListener("abort", () => resolve(), { once: true });
        }),
      );
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entering = new Set(
          entries
            .filter((entry) => entry.isIntersecting)
            .map((entry) => entry.target),
        );
        const batch = cards.filter((card) => entering.has(card));
        if (!batch.length) return;
        const holds = batch.map((card) => {
          observer.unobserve(card);
          return animate(card, [{ opacity: 0 }, { opacity: 0 }], {
            duration: 1,
            fill: "both",
          });
        });
        let timeout: ReturnType<typeof setTimeout>;
        const deadline = new Promise<void>((resolve) => {
          timeout = setTimeout(resolve, 1200);
          signal.addEventListener(
            "abort",
            () => {
              clearTimeout(timeout);
              resolve();
            },
            { once: true },
          );
        });
        void Promise.race([
          Promise.all(batch.map((card) => covers.get(card))),
          deadline,
        ]).then(() => {
          clearTimeout(timeout);
          holds.forEach((hold) => {
            hold.cancel();
            animations.delete(hold);
          });
          if (stopped) return;
          batch.forEach((card, index) =>
            animate(
              card,
              [
                { opacity: 0, translate: "0 6px" },
                { opacity: 1, translate: "0 0" },
              ],
              {
                duration: 280,
                delay: index * 65,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                fill: "backwards",
              },
            ),
          );
        });
      },
      { rootMargin: "60px 0px" },
    );
    cards.forEach((card) => observer.observe(card));

    const stop = () => {
      stopped = true;
      observer.disconnect();
      controller.abort();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    };
    // Keyboard focus must never land on an invisible card. Also honor a motion
    // preference changed while this page is open, without waiting for reload.
    container.addEventListener("focusin", stop, { once: true });
    motion.addEventListener("change", stop, { once: true });
    return () => {
      stop();
      container.removeEventListener("focusin", stop);
      motion.removeEventListener("change", stop);
    };
  }, []);

  return (
    <div ref={grid} className={styles.grid}>
      {children}
    </div>
  );
}
