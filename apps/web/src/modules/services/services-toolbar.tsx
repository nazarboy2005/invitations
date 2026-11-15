"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin, Search, X } from "lucide-react";
import { useLayoutEffect, useRef, useState, useTransition } from "react";
import { SoftSelect } from "@/components/soft-select";
import { ServiceCategoryIcon } from "./service-category-icon";
import styles from "./services.module.css";

type ToolbarProps = {
  category?: string;
  title: string;
  query: string;
  region: string;
  regions: string[];
  page: number;
  pages: number;
  total: number;
  previousHref: string | null;
  nextHref: string | null;
};

export function ServicesToolbar({
  category,
  title,
  query,
  region,
  regions,
  page,
  pages,
  total,
  previousHref,
  nextHref,
}: ToolbarProps) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(Boolean(query));
  const [selectedRegion, setSelectedRegion] = useState(region);
  const [draftQuery, setDraftQuery] = useState(query);
  const [pending, startTransition] = useTransition();
  const form = useRef<HTMLFormElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);
  const previousButtonBounds = useRef<DOMRect | null>(null);
  const animation = useRef<Animation | null>(null);
  const heading = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    setSelectedRegion(region);
    setDraftQuery(query);
  }, [query, region]);

  useLayoutEffect(() => {
    const text = heading.current;
    if (!text) return;
    const fit = () => {
      text.style.fontSize = "";
      const size = parseFloat(getComputedStyle(text).fontSize);
      if (text.scrollWidth > text.clientWidth) {
        text.style.fontSize = `${(size * text.clientWidth) / text.scrollWidth}px`;
      }
    };
    const observer = new ResizeObserver(fit);
    observer.observe(text.parentElement!);
    document.fonts.ready.then(fit);
    fit();
    return () => observer.disconnect();
  }, [title]);

  // Animate the same icon between its two layout positions, including on phones.
  useLayoutEffect(() => {
    const before = previousButtonBounds.current;
    const button = searchButton.current;
    if (!before || !button) return;
    previousButtonBounds.current = null;
    animation.current?.cancel();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const after = button.getBoundingClientRect();
      animation.current = button.animate(
        [
          {
            transform: `translate(${before.left - after.left}px, ${before.top - after.top}px)`,
          },
          { transform: "translate(0, 0)" },
        ],
        { duration: 520, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
    }
    if (searchOpen) input.current?.focus({ preventScroll: true });
  }, [searchOpen]);

  function toggleSearch() {
    previousButtonBounds.current =
      searchButton.current?.getBoundingClientRect() ?? null;
    setSearchOpen((open) => !open);
  }

  function applyFilters(nextRegion = selectedRegion, nextQuery?: string) {
    if (!form.current) return;
    const fields = new FormData(form.current);
    const params = new URLSearchParams();
    const q = (nextQuery ?? String(fields.get("q") ?? "")).trim();
    if (q) params.set("q", q);
    if (nextRegion) params.set("region", nextRegion);
    const path = category
      ? `/services/${encodeURIComponent(category)}`
      : "/services";
    const search = params.toString();
    // Keep enough document height for the current viewport when results shrink.
    // Otherwise the browser clamps scrollY even with Next's scroll: false.
    const results = form.current.closest<HTMLElement>("#results");
    if (results) {
      const top = results.getBoundingClientRect().top + window.scrollY;
      results.style.minHeight = `${Math.max(0, window.scrollY + window.innerHeight - top)}px`;
    }
    startTransition(() => {
      router.push(`${path}${search ? `?${search}` : ""}`, {
        scroll: false,
      });
    });
  }

  return (
    <div
      className={styles.toolbar}
      data-search-open={searchOpen}
      aria-busy={pending}
    >
      <form
        ref={form}
        action={category ? `/services/${category}` : "/services"}
        className={styles.toolbarRow}
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          applyFilters();
        }}
      >
        <div className={styles.toolbarHeading}>
          <h2>
            <ServiceCategoryIcon category={category} size={27} />
            <span ref={heading}>{title}</span>
          </h2>
          <span className={styles.srOnly} role="status">
            {total} xizmat, {page} / {pages} sahifa
          </span>
        </div>
        <div className={styles.searchSpace}>
          <div className={styles.searchGroup}>
            <button
              ref={searchButton}
              type="button"
              className={styles.searchToggle}
              aria-label={searchOpen ? "Qidirishni yopish" : "Qidiruvni ochish"}
              aria-expanded={searchOpen}
              aria-controls="service-search-field"
              onClick={toggleSearch}
            >
              <Search size={19} aria-hidden="true" />
            </button>
            <div
              id="service-search-field"
              className={styles.searchField}
              inert={!searchOpen}
              aria-hidden={!searchOpen}
            >
              <label className={styles.srOnly} htmlFor="service-query">
                Xizmat yoki biznes nomi
              </label>
              <input
                ref={input}
                id="service-query"
                name="q"
                type="search"
                placeholder="Xizmat yoki biznes nomi…"
                value={draftQuery}
                maxLength={120}
                onChange={(event) => {
                  setDraftQuery(event.currentTarget.value);
                  // Removing all typed text clears the applied search too.
                  if (!event.currentTarget.value && query)
                    applyFilters(selectedRegion, "");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    toggleSearch();
                    searchButton.current?.focus({ preventScroll: true });
                  }
                }}
              />
              {draftQuery && (
                <button
                  type="button"
                  className={styles.clearSearch}
                  aria-label="Qidiruvni tozalash"
                  onClick={() => {
                    setDraftQuery("");
                    applyFilters(selectedRegion, "");
                    input.current?.focus({ preventScroll: true });
                  }}
                >
                  <X size={14} aria-hidden="true" />
                </button>
              )}
              <button
                type="submit"
                className={styles.searchButton}
                disabled={pending}
              >
                Qidirish
              </button>
            </div>
          </div>
        </div>
        <div className={styles.region}>
          <MapPin size={17} aria-hidden="true" />
          <SoftSelect
            preventScrollOnFocus
            value={selectedRegion}
            label="Hudud"
            options={[
              { value: "", label: "Barcha hududlar" },
              ...regions.map((item) => ({ value: item, label: item })),
            ]}
            onChange={(value) => {
              setSelectedRegion(value);
              applyFilters(value);
            }}
          />
        </div>
        <nav className={styles.pagination} aria-label="Xizmatlar sahifalari">
          {previousHref ? (
            <Link
              href={previousHref}
              prefetch={false}
              aria-label="Oldingi sahifa"
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </Link>
          ) : (
            <span aria-disabled="true" aria-label="Oldingi sahifa">
              <ArrowLeft size={18} aria-hidden="true" />
            </span>
          )}
          {nextHref ? (
            <Link href={nextHref} prefetch={false} aria-label="Keyingi sahifa">
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          ) : (
            <span aria-disabled="true" aria-label="Keyingi sahifa">
              <ArrowRight size={18} aria-hidden="true" />
            </span>
          )}
        </nav>
      </form>
    </div>
  );
}
