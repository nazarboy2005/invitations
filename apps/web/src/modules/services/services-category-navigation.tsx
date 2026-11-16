"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
  type ComponentProps,
  type ReactNode,
} from "react";
import styles from "./services.module.css";

type IndicatorPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};
type NavPosition = {
  indicator: IndicatorPosition;
  left: number;
  top: number;
};
const NavigationContext = createContext<{
  selectedPath: string;
  navigate: (href: string) => void;
  positions: Map<string, NavPosition>;
} | null>(null);

let categoryScroll: { path: string; y: number } | null = null;
const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Survives category route changes, so an in-flight highlight can continue. */
export function ServicesNavigationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [target, setTarget] = useState(pathname);
  const [pending, startTransition] = useTransition();
  const positions = useRef(new Map<string, NavPosition>());

  function navigate(href: string) {
    const path = href.split("?")[0];
    categoryScroll = path !== pathname ? { path, y: window.scrollY } : null;
    setTarget(path);
    startTransition(() => router.push(href, { scroll: false }));
  }

  return (
    <NavigationContext.Provider
      value={{
        selectedPath: pending ? target : pathname,
        navigate,
        positions: positions.current,
      }}
    >
      <div
        className={styles.navigation}
        data-category-pending={pending && target !== pathname}
      >
        {children}
      </div>
    </NavigationContext.Provider>
  );
}

export function ServiceCategoryLink(props: ComponentProps<typeof Link>) {
  const navigation = useContext(NavigationContext)!;
  const search = useSearchParams();
  const originalHref = String(props.href);
  const url = new URL(originalHref, "https://fotiha.local");
  if (url.pathname.startsWith("/services") && search.get("favorites") === "1")
    url.searchParams.set("favorites", "1");
  const href = url.pathname + url.search;
  const isDirectory = href.split("?")[0].startsWith("/services");
  return (
    <Link
      {...props}
      href={href}
      data-selected={
        isDirectory && href.split("?")[0] === navigation.selectedPath
      }
      scroll={isDirectory ? false : undefined}
      onNavigate={(event) => {
        if (!isDirectory) return;
        event.preventDefault();
        navigation.navigate(href);
      }}
    />
  );
}

export function ServiceCategories({
  variant,
  children,
}: {
  variant: "sidebar" | "mobile";
  children: ReactNode;
}) {
  const navigation = useContext(NavigationContext)!;
  const nav = useRef<HTMLElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const container = nav.current!;
    const updateScrollHints = () => {
      container.dataset.scrollAbove = String(container.scrollTop > 1);
      container.dataset.scrollBelow = String(
        container.scrollHeight - container.clientHeight - container.scrollTop >
          1,
      );
    };
    updateScrollHints();
    container.addEventListener("scroll", updateScrollHints, { passive: true });
    const resize = new ResizeObserver(updateScrollHints);
    resize.observe(container);
    for (const link of container.querySelectorAll("a")) resize.observe(link);
    return () => {
      container.removeEventListener("scroll", updateScrollHints);
      resize.disconnect();
    };
  }, [children]);

  useLayoutEffect(() => {
    const container = nav.current!;
    const highlight = indicator.current!;
    const saved = navigation.positions.get(variant);
    if (saved) {
      container.scrollLeft = saved.left;
      container.scrollTop = saved.top;
    }
    let animation: Animation | undefined;
    let destination: IndicatorPosition | undefined;
    let origin: IndicatorPosition | undefined;
    const position = (element: HTMLElement): IndicatorPosition => {
      const bounds = element.getBoundingClientRect();
      const parent = container.getBoundingClientRect();
      return {
        x: bounds.left - parent.left + container.scrollLeft,
        y: bounds.top - parent.top + container.scrollTop,
        width: bounds.width,
        height: bounds.height,
      };
    };
    const frame = ({ x, y, width, height }: IndicatorPosition) => ({
      transform: `translate(${x}px, ${y}px)`,
      width: `${width}px`,
      height: `${height}px`,
    });
    // Read the in-flight frame even if React has already detached the old nav.
    const currentPosition = () => {
      if (!destination) return undefined;
      if (!animation || !origin) return destination;
      const progress = animation.effect?.getComputedTiming().progress ?? 1;
      return {
        x: origin.x + (destination.x - origin.x) * progress,
        y: origin.y + (destination.y - origin.y) * progress,
        width: origin.width + (destination.width - origin.width) * progress,
        height: origin.height + (destination.height - origin.height) * progress,
      };
    };
    const place = (animate: boolean) => {
      if (!container.getClientRects().length) return;
      const selected = container.querySelector<HTMLElement>(
        '[data-selected="true"]',
      );
      if (!selected) return;
      const before = currentPosition() ?? saved?.indicator;
      animation?.cancel();
      const next = position(selected);
      destination = next;
      origin = before;
      animation = undefined;
      Object.assign(highlight.style, frame(next));
      container.dataset.animated = "true";
      if (animate && before && !reducedMotion()) {
        animation = highlight.animate([frame(before), frame(next)], {
          duration: 260,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        });
      }
      // Reveal a new selection within its own scroller, never the document.
      const left = Math.max(
        0,
        next.x - (container.clientWidth - next.width) / 2,
      );
      const top = Math.max(
        0,
        next.y - (container.clientHeight - next.height) / 2,
      );
      container.scrollTo({
        left: container.scrollWidth > container.clientWidth ? left : 0,
        top: container.scrollHeight > container.clientHeight ? top : 0,
        behavior: animate && !reducedMotion() ? "smooth" : "instant",
      });
    };
    place(true);
    let width = container.clientWidth;
    let height = container.clientHeight;
    const resize = new ResizeObserver(() => {
      if (width === container.clientWidth && height === container.clientHeight)
        return;
      width = container.clientWidth;
      height = container.clientHeight;
      place(false);
    });
    resize.observe(container);
    return () => {
      const current = currentPosition();
      if (current)
        navigation.positions.set(variant, {
          indicator: current,
          left: container.scrollLeft,
          top: container.scrollTop,
        });
      animation?.cancel();
      resize.disconnect();
    };
  }, [navigation.selectedPath, navigation.positions, variant]);

  return (
    <nav
      ref={nav}
      className={styles.categories}
      aria-label="Xizmat yo‘nalishlari"
    >
      <span
        ref={indicator}
        className={styles.categoryIndicator}
        aria-hidden="true"
      />
      {children}
    </nav>
  );
}

/** Keep the result surface steady; individual cards handle their own reveal. */
export function ServiceResults({ children }: { children: ReactNode }) {
  return <div className={styles.resultsContent}>{children}</div>;
}

/** Restore before paint, including when a new category has fewer cards. */
export function ServicesScrollPosition() {
  const pathname = usePathname();
  useLayoutEffect(() => {
    if (!categoryScroll || categoryScroll.path !== pathname) return;
    const { y } = categoryScroll;
    categoryScroll = null;
    const results = document.getElementById("results");
    if (results) {
      const top = results.getBoundingClientRect().top + window.scrollY;
      results.style.minHeight = `${Math.max(0, y + window.innerHeight - top)}px`;
    }
    window.scrollTo({ top: y, behavior: "instant" });
  }, [pathname]);
  return null;
}
