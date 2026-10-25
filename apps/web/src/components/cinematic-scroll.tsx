"use client";

import {
  Children,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

const READING_SCREENS = 0.9;
const ENTRY_SCREENS = 0.32;

/** A short covering reveal, then a stationary photograph with bottom-to-top copy. */
export function CinematicScroll({
  children,
  className,
  stageClassName,
}: {
  children: ReactNode;
  className: string;
  stageClassName: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const count = Children.count(children);

  useLayoutEffect(() => {
    const root = track.current;
    const viewport = stage.current;
    if (!root || !viewport) return;
    const scenes = Array.from(
      root.querySelectorAll<HTMLElement>("[data-cinematic-scene]"),
    );
    const copies = scenes.map((scene) =>
      scene.querySelector<HTMLElement>("[data-cinematic-copy]"),
    );
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const short = window.matchMedia(
      "(max-height: 500px), (min-width: 701px) and (max-height: 640px)",
    );
    const phone = window.matchMedia("(max-width: 700px)");
    let start = 0;
    let height = 1;
    let copyStarts: number[] = [];
    let copyTravel: number[] = [];
    let frame = 0;
    let visible = false;
    let enabled = false;

    function measure() {
      if (!root || !viewport) return;
      start = root.getBoundingClientRect().top + window.scrollY;
      height = Math.max(1, viewport.offsetHeight);
      copyStarts = copies.map((copy) =>
        copy
          ? Math.max(
              height * 0.46,
              height - copy.offsetHeight - height * 0.08,
            ) - copy.offsetTop
          : 0,
      );
      copyTravel = copies.map((copy, i) =>
        copy
          ? copy.offsetTop + copyStarts[i] + copy.offsetHeight + height * 0.035
          : 0,
      );
      draw();
    }

    function draw() {
      frame = 0;
      if (!enabled || !visible) return;
      const distance = window.scrollY - start;
      const readingDistance = height * READING_SCREENS;
      const entryDistance = height * ENTRY_SCREENS;
      scenes.forEach((scene, i) => {
        const readingStart = i * (readingDistance + entryDistance);
        const incoming =
          i === 0
            ? 1
            : Math.max(
                0,
                Math.min(
                  1,
                  (distance - readingStart + entryDistance) / entryDistance,
                ),
              );
        const reading = Math.max(
          0,
          Math.min(1, (distance - readingStart) / readingDistance),
        );
        scene.style.setProperty(
          "--panel-y",
          `${((1 - incoming) * height).toFixed(2)}px`,
        );
        scene.style.setProperty(
          "--image-y",
          `${(-(1 - incoming) * height * 0.1).toFixed(2)}px`,
        );
        scene.style.setProperty(
          "--copy-y",
          `${(copyStarts[i] - reading * copyTravel[i]).toFixed(2)}px`,
        );
        // On phones, the sample artwork clears the copy's path before they meet.
        scene.style.setProperty(
          "--detail-opacity",
          phone.matches
            ? String(1 - Math.max(0, Math.min(1, (reading - 0.04) / 0.12)))
            : "1",
        );
      });
    }

    function schedule() {
      if (enabled && visible && !frame) frame = requestAnimationFrame(draw);
    }

    function syncPreference() {
      if (!root) return;
      enabled = !reduced.matches && !short.matches;
      if (enabled) root.dataset.cinematicReady = "true";
      else root.removeAttribute("data-cinematic-ready");
      scenes.forEach((scene) => {
        ["--panel-y", "--image-y", "--copy-y", "--detail-opacity"].forEach(
          (name) => scene.style.removeProperty(name),
        );
      });
      measure();
    }

    function revealFocusedScene(event: FocusEvent) {
      if (
        !enabled ||
        !(event.target instanceof HTMLElement) ||
        !event.target.matches(":focus-visible")
      )
        return;
      const scene = event.target.closest<HTMLElement>("[data-cinematic-scene]");
      const index = scene ? scenes.indexOf(scene) : -1;
      if (index < 0) return;
      const readingStart =
        start + index * height * (READING_SCREENS + ENTRY_SCREENS);
      const local = window.scrollY - readingStart;
      if (local < 0 || local > height * READING_SCREENS * 0.45) {
        window.scrollTo({ top: readingStart, behavior: "instant" });
        draw();
      }
    }

    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) measure();
      },
      { rootMargin: "100% 0px" },
    );
    const resize = new ResizeObserver(measure);
    intersection.observe(root);
    resize.observe(viewport);
    copies.forEach((copy) => {
      if (copy) resize.observe(copy);
    });
    window.addEventListener("scroll", schedule, { passive: true });
    root.addEventListener("focusin", revealFocusedScene);
    reduced.addEventListener("change", syncPreference);
    short.addEventListener("change", syncPreference);
    phone.addEventListener("change", syncPreference);
    syncPreference();

    return () => {
      cancelAnimationFrame(frame);
      intersection.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      root.removeEventListener("focusin", revealFocusedScene);
      reduced.removeEventListener("change", syncPreference);
      short.removeEventListener("change", syncPreference);
      phone.removeEventListener("change", syncPreference);
      root.removeAttribute("data-cinematic-ready");
    };
  }, []);

  return (
    <div
      ref={track}
      className={className}
      data-header-theme="dark"
      style={
        {
          "--scroll-screens":
            1 +
            count * READING_SCREENS +
            Math.max(0, count - 1) * ENTRY_SCREENS,
        } as CSSProperties
      }
    >
      <div ref={stage} className={stageClassName}>
        {children}
      </div>
    </div>
  );
}
