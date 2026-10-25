"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import styles from "./site-header.module.css";

export function HeroMobileMenu({ accountLabel }: { accountLabel: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const menu = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !menu.current?.contains(event.target))
        setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div ref={menu} className={styles.mobileMenu}>
      <button
        ref={trigger}
        type="button"
        className={styles.menuToggle}
        aria-expanded={open}
        aria-controls={id}
        aria-label={open ? "Menyuni yopish" : "Menyuni ochish"}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>
      {open && (
        <nav
          id={id}
          className={styles.mobileMenuPanel}
          aria-label="Mobil menyu"
          onClick={() => setOpen(false)}
        >
          <Link href="/templates?category=wedding">To‘ylar</Link>
          <Link href="/templates?category=osh">Marosimlar</Link>
          <Link href="/templates?category=other">Tantanalar</Link>
          <Link href="/#why-us">Biz haqimizda</Link>
          <Link href="/dashboard">{accountLabel}</Link>
        </nav>
      )}
    </div>
  );
}
