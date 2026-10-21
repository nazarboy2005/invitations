"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ScrollHeader({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    let lastY = Math.max(0, window.scrollY);
    let anchor = lastY;
    let direction = 0;
    let frame = 0;

    function update() {
      frame = 0;
      if (!header.current) return;
      const y = Math.max(0, window.scrollY);
      const nextDirection = Math.sign(y - lastY);
      header.current.dataset.scrolled = String(y > 20);
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
  }, []);

  return (
    <header ref={header} className={className}>
      {children}
    </header>
  );
}
