"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

function resetBox(element: HTMLElement) {
  element.style.removeProperty("height");
  element.style.removeProperty("overflow");
  element.inert = false;
}

/** Keep selection immediate, then replace the grid between its exit and entrance. */
export function useCategoryTransition(host: RefObject<HTMLDivElement | null>) {
  const [categoryId, setCategoryId] = useState("all");
  const [renderedCategoryId, setRenderedCategoryId] = useState("all");
  const requested = useRef("all");
  const rendered = useRef("all");
  rendered.current = renderedCategoryId;
  const generation = useRef(0);
  const oldHeight = useRef<number | null>(null);
  const animations = useRef<Animation[]>([]);

  const cancel = useCallback(() => {
    animations.current.forEach((animation) => animation.cancel());
    animations.current = [];
  }, []);

  function selectCategory(next: string) {
    if (requested.current === next) return;
    requested.current = next;
    setCategoryId(next);
    const ticket = ++generation.current;
    const element = host.current;
    const opacity = element ? getComputedStyle(element).opacity : "1";
    const height = element?.getBoundingClientRect().height ?? 0;
    cancel();
    oldHeight.current = null;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!element || reduce || !element.animate || next === rendered.current) {
      if (element) resetBox(element);
      setRenderedCategoryId(next);
      if (element && !reduce && element.animate && Number(opacity) < 1) {
        animations.current = [
          element.animate([{ opacity }, { opacity: 1 }], { duration: 120 }),
        ];
      }
      return;
    }

    oldHeight.current = height;
    element.style.height = `${height}px`;
    element.style.overflow = "clip";
    element.inert = true;
    const exit = element.animate([{ opacity }, { opacity: 0 }], {
      duration: 90,
      easing: "ease-out",
      fill: "forwards",
    });
    animations.current = [exit];
    void exit.finished
      .then(() => {
        if (generation.current === ticket) setRenderedCategoryId(next);
      })
      .catch(() => {
        /* A newer selection cancelled this exit. */
      });
  }

  useLayoutEffect(() => {
    if (renderedCategoryId !== requested.current) return;
    const element = host.current;
    const previousHeight = oldHeight.current;
    if (!element || previousHeight === null) return;
    cancel();
    resetBox(element);
    oldHeight.current = null;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const options: KeyframeAnimationOptions = {
      duration: 200,
      easing: "cubic-bezier(.2,.7,.3,1)",
    };
    const entering = [
      element.animate(
        [
          { opacity: 0, transform: "translateY(6px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        options,
      ),
    ];
    animations.current = entering;
    const ticket = generation.current;
    void Promise.all(entering.map((animation) => animation.finished))
      .then(() => {
        if (generation.current === ticket) {
          resetBox(element);
          animations.current = [];
        }
      })
      .catch(() => {
        /* Rapid category changes cancel the previous entrance. */
      });
  }, [renderedCategoryId, host, cancel]);

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    function preferenceChanged() {
      if (!motion.matches) return;
      generation.current++;
      cancel();
      oldHeight.current = null;
      if (host.current) resetBox(host.current);
      setRenderedCategoryId(requested.current);
    }
    motion.addEventListener("change", preferenceChanged);
    return () => {
      generation.current++;
      cancel();
      if (host.current) resetBox(host.current);
      motion.removeEventListener("change", preferenceChanged);
    };
  }, [host, cancel]);

  return { categoryId, renderedCategoryId, selectCategory };
}
