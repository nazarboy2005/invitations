"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { selectViewportCard, type VisibleCard } from "./card-playback-policy";

export function useCardPlayback(
  grid: RefObject<HTMLDivElement | null>,
  templateIds: string[],
  paused = false,
) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const hovered = useRef<string | null>(null);
  const allowed = useRef(false);
  const hoverChanged = useRef<() => void>(() => {});
  const ids = templateIds.join("|");

  useEffect(() => {
    const element = grid.current;
    if (!element || paused) {
      allowed.current = false;
      setActiveId(null);
      return;
    }
    hovered.current = null;
    setActiveId(null);
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const touch = matchMedia("(hover: none), (pointer: coarse)");
    const connection = (
      navigator as Navigator & {
        connection?: {
          saveData?: boolean;
          addEventListener?: (type: string, listener: () => void) => void;
          removeEventListener?: (type: string, listener: () => void) => void;
        };
      }
    ).connection;
    const visible = new Set<HTMLElement>();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let lastId: string | null = null;
    function play(id: string | null) {
      if (id === lastId) return;
      lastId = id;
      setActiveId(id);
    }

    function choose() {
      timer = undefined;
      allowed.current =
        !motion.matches && !connection?.saveData && !document.hidden;
      if (!allowed.current) {
        play(null);
        return;
      }
      const hoveredCard = hovered.current
        ? element?.querySelector<HTMLElement>(
            `[data-template-id="${CSS.escape(hovered.current)}"]`,
          )
        : null;
      if (hoveredCard && visible.has(hoveredCard)) {
        play(hovered.current);
        return;
      }
      if (!touch.matches) {
        play(null);
        return;
      }
      const candidates: VisibleCard[] = [];
      for (const card of visible) {
        const art = card.querySelector<HTMLElement>("[data-card-art]");
        if (!art) continue;
        const rect = art.getBoundingClientRect();
        candidates.push({
          id: card.dataset.templateId!,
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height,
        });
      }
      play(selectViewportCard(candidates, innerHeight));
    }
    function schedule() {
      clearTimeout(timer);
      timer = setTimeout(choose, 200);
    }
    function scrolling() {
      // Do not mount or run a template renderer during a swipe/wheel gesture.
      play(null);
      schedule();
    }
    hoverChanged.current = () => {
      // A row can move under the cursor during a scroll gesture.
      if (timer === undefined) choose();
    };
    function visibilityChanged() {
      if (document.hidden) {
        allowed.current = false;
        play(null);
      } else schedule();
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target as HTMLElement);
        else visible.delete(entry.target as HTMLElement);
      }
      schedule();
    });
    element
      .querySelectorAll<HTMLElement>("[data-template-id]")
      .forEach((card) => observer.observe(card));
    motion.addEventListener("change", schedule);
    touch.addEventListener("change", schedule);
    document.addEventListener("visibilitychange", visibilityChanged);
    window.addEventListener("scroll", scrolling, { passive: true });
    window.addEventListener("resize", schedule);
    connection?.addEventListener?.("change", schedule);
    choose();
    return () => {
      hoverChanged.current = () => {};
      observer.disconnect();
      clearTimeout(timer);
      motion.removeEventListener("change", schedule);
      touch.removeEventListener("change", schedule);
      document.removeEventListener("visibilitychange", visibilityChanged);
      window.removeEventListener("scroll", scrolling);
      window.removeEventListener("resize", schedule);
      connection?.removeEventListener?.("change", schedule);
    };
  }, [grid, ids, paused]);

  return {
    activeId: !paused && templateIds.includes(activeId ?? "") ? activeId : null,
    start(id: string) {
      hovered.current = id;
      if (allowed.current && !paused) hoverChanged.current();
    },
    stop(id: string) {
      if (hovered.current === id) hovered.current = null;
      hoverChanged.current();
    },
  };
}
