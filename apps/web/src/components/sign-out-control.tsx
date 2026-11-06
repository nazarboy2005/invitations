"use client";

import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { Check, LoaderCircle, LogOut, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./sign-out-control.module.css";

type Props = { enabled: boolean; placement: "desktop" | "phone" };

export function SignOutControl({ enabled, placement }: Props) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const cancelRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const busyRef = useRef(false);
  const closeTimer = useRef<number | null>(null);
  const show = enabled && pathname === "/dashboard";

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => cancelRef.current?.focus(), 20);
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !busyRef.current) dismiss();
      if (event.key === "Tab") {
        const controls = Array.from(
          document.querySelectorAll<HTMLElement>(
            `.${styles.dialog} button:not(:disabled)`,
          ),
        );
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = priorOverflow;
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      triggerRef.current?.focus();
    };
    // dismiss is intentionally stable for the lifetime of this open dialog.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(
    () => () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    },
    [],
  );

  function dismiss() {
    if (busyRef.current) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setError("");
    }, 260);
  }

  async function signOut() {
    if (busy) return;
    busyRef.current = true;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        cache: "no-store",
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(result.error?.message ?? "Hisobdan chiqib bo‘lmadi.");
      try {
        sessionStorage.setItem("taklifnoma:manual-signout", "1");
      } catch {
        /* Cookie revocation still signs the browser session out. */
      }
      window.dispatchEvent(
        new CustomEvent("session-changed", { detail: { userId: null } }),
      );
      window.location.assign("/");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Hisobdan chiqib bo‘lmadi.",
      );
      busyRef.current = false;
      setBusy(false);
    }
  }

  if (!show) return null;
  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.trigger} ${placement === "phone" ? styles.phoneTrigger : styles.desktopTrigger}`}
        aria-label="Hisobdan chiqish"
        title="Hisobdan chiqish"
        onClick={() => {
          setOpen(true);
          setClosing(false);
          setError("");
        }}
      >
        <LogOut size={18} strokeWidth={1.7} aria-hidden="true" />
      </button>
      {mounted && open &&
        createPortal(
          <div
            className={`${styles.overlay} ${closing ? styles.overlayClosing : ""}`}
            data-state={closing ? "closing" : "open"}
            onPointerDown={(event) => {
              if (event.target === event.currentTarget) dismiss();
            }}
          >
            <section
              className={`${styles.dialog} ${closing ? styles.dialogClosing : ""}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="sign-out-title"
              aria-describedby="sign-out-description"
            >
              <button
                type="button"
                className={styles.close}
                aria-label="Oynani yopish"
                disabled={busy}
                onClick={dismiss}
              >
                <X size={17} aria-hidden="true" />
              </button>
              <div className={styles.art} aria-hidden="true">
                <span className={styles.orbit} />
                <span className={styles.sparkle}>✦</span>
                <span className={styles.seal}><LogOut size={22} strokeWidth={1.5} /></span>
                <span className={styles.sparkleSmall}>✧</span>
              </div>
              <p className={styles.eyebrow}>FOTIHA · SHAXSIY HISOB</p>
              <h2 id="sign-out-title">Hisobdan chiqasizmi?</h2>
              <p id="sign-out-description" className={styles.description}>
                Keyinroq Telegram orqali yana bemalol kirishingiz mumkin.
              </p>
              {error && <p className={styles.error} role="alert">{error}</p>}
              <div className={styles.actions}>
                <button
                  ref={cancelRef}
                  type="button"
                  className={styles.cancel}
                  disabled={busy}
                  onClick={dismiss}
                >
                  Qolish
                </button>
                <button
                  type="button"
                  className={styles.confirm}
                  disabled={busy}
                  onClick={() => void signOut()}
                >
                  {busy ? (
                    <LoaderCircle className={styles.spinner} size={16} aria-hidden="true" />
                  ) : (
                    <Check size={16} aria-hidden="true" />
                  )}
                  {busy ? "Chiqilmoqda…" : "Hisobdan chiqish"}
                </button>
              </div>
            </section>
          </div>,
          document.body,
        )}
    </>
  );
}
