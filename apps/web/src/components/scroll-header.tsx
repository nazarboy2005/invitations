"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ScrollHeader({
  children,
  className,
  followScroll = false,
}: {
  children: ReactNode;
  className: string;
  followScroll?: boolean;
}) {
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    let lastY = Math.max(0, window.scrollY);
    let anchor = lastY;
    let direction = 0;
    let frame = 0;
    let offset = 0;
    let upwardDistance = 0;
    const lightSections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-header-theme="light"]'),
    );

    function update() {
      frame = 0;
      if (!header.current) return;
      const y = Math.max(0, window.scrollY);
      const headerLine = header.current.offsetHeight / 2;
      header.current.dataset.tone = lightSections.some((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= headerLine && bounds.bottom > headerLine;
      })
        ? "light"
        : "default";
      const nextDirection = Math.sign(y - lastY);
      header.current.dataset.scrolled = String(y > 20);
      if (followScroll) {
        const delta = y - lastY;
        const menuOpen =
          header.current.querySelector('[aria-expanded="true"]') !== null;
        if (y === 0 || menuOpen) {
          offset = 0;
          upwardDistance = 0;
        } else if (delta > 0) {
          upwardDistance = 0;
          offset = Math.min(header.current.offsetHeight + 2, offset + delta);
          header.current.dataset.direction = "down";
        } else if (delta < 0) {
          upwardDistance -= delta;
          if (upwardDistance >= 8) {
            offset = 0;
            header.current.dataset.direction = "up";
          }
        }
        header.current.style.setProperty("--header-offset", `${-offset}px`);
        header.current.dataset.hidden = String(
          offset >= header.current.offsetHeight,
        );
        lastY = y;
        return;
      }
      if (y < 110) {
        header.current.dataset.hidden = "false";
        anchor = y;
      } else if (nextDirection !== 0) {
        if (nextDirection !== direction) anchor = lastY;
        if (Math.abs(y - anchor) > (nextDirection > 0 ? 24 : 8)) {
          header.current.dataset.hidden = String(nextDirection > 0);
          anchor = y;
        }
      }
      if (nextDirection !== 0) direction = nextDirection;
      lastY = y;
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [followScroll]);

  return (
    <header ref={header} className={className}>
      {children}
    </header>
  );
}
