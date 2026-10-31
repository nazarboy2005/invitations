"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  FavoriteButton,
  FavoritesStatus,
} from "@/modules/favorites/favorite-button";
import { useFavorites } from "@/modules/favorites/favorites-store";
import type { Favorite } from "@/modules/favorites/favorites-data";
import { ChevronRight, Heart, LayoutTemplate, Search, X } from "lucide-react";
import {
  templateById,
  type TemplateCategory,
  type TemplateDefinition,
} from "@taklifnoma/contracts";

import styles from "@/app/home.module.css";
import cardStyles from "./template-cards.module.css";
import galleryStyles from "./template-gallery.module.css";
import { templatePoster } from "./template-poster";
import { matchesTemplateSearch } from "./template-search";
import { orderCatalogTemplates } from "./template-order";
import { TemplateCardPreview } from "./template-card-preview";
import { useCardPlayback } from "./use-card-playback";
import { useCategoryTransition } from "./use-category-transition";

const TemplateDetailDialog = dynamic(() =>
  import("./template-detail-dialog").then(
    (module) => module.TemplateDetailDialog,
  ),
);

export function TemplateGallery({
  templates,
  categories,
  featured = false,
  initialCategory = "all",
  favoritesOnly = false,
}: {
  templates: TemplateDefinition[];
  categories: TemplateCategory[];
  featured?: boolean;
  initialCategory?: string;
  favoritesOnly?: boolean;
}) {
  const favorites = useFavorites();
  // Keep this visit's cards available for undo; persistence still changes
  // immediately. A new visit (or account switch) gets a fresh collection.
  const [visit, setVisit] = useState<{
    userId: string | null;
    items: Favorite[];
  }>({ userId: favorites.userId, items: [] });
  const sameAccount = visit.userId === favorites.userId;
  const visitItems = sameAccount ? visit.items : [];
  const additions = favorites.favorites.filter(
    (item) => !visitItems.some((saved) => saved.templateId === item.templateId),
  );
  const displayedFavorites = favoritesOnly
    ? [...visitItems, ...additions]
    : favorites.favorites;
  if (favoritesOnly && (!sameAccount || additions.length > 0)) {
    setVisit({ userId: favorites.userId, items: displayedFavorites });
  }
  const savedIds = useMemo(
    () =>
      new Map(
        displayedFavorites.map((item) => [item.templateId, item.savedAt]),
      ),
    [displayedFavorites],
  );
  const unavailable = displayedFavorites.filter(
    (item) => !templates.some((template) => template.id === item.templateId),
  );
  const results = useRef<HTMLDivElement>(null);
  const { categoryId, renderedCategoryId, selectCategory } =
    useCategoryTransition(results, initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInput = useRef<HTMLInputElement>(null);
  const searchId = useId();
  const categoryNav = useRef<HTMLElement>(null);
  const categoryAnchor = useRef<HTMLSpanElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const selectedTrigger = useRef<HTMLButtonElement>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateDefinition | null>(null);
  const availableCategories = useMemo(() => {
    const collection = favoritesOnly
      ? templates.filter((template) => savedIds.has(template.id))
      : templates;
    return [
      { id: "all", name: "Barchasi", count: collection.length },
      ...categories
        .map((category) => ({
          ...category,
          count: collection.filter((template) =>
            template.categoryIds.includes(category.id),
          ).length,
        }))
        .filter((category) => category.count > 0),
    ];
  }, [categories, templates, favoritesOnly, savedIds]);
  const visibleTemplates = useMemo(() => {
    const filtered = (
      featured
        ? templates
        : orderCatalogTemplates(templates, renderedCategoryId)
    ).filter((template) =>
      matchesTemplateSearch(template, categories, searchQuery),
    );
    return favoritesOnly
      ? filtered
          .filter((template) => savedIds.has(template.id))
          .sort(
            (a, b) =>
              Date.parse(savedIds.get(b.id)!) - Date.parse(savedIds.get(a.id)!),
          )
      : filtered;
  }, [
    renderedCategoryId,
    categories,
    searchQuery,
    templates,
    featured,
    favoritesOnly,
    savedIds,
  ]);
  const playback = useCardPlayback(
    grid,
    visibleTemplates.map((template) => template.id),
    selectedTemplate !== null || categoryId !== renderedCategoryId,
  );
  const categoryName =
    availableCategories.find((category) => category.id === renderedCategoryId)
      ?.name ?? "Barchasi";
  const hasFilters = categoryId !== "all" || searchQuery.trim().length > 0;
  useEffect(() => {
    const nav = categoryNav.current;
    const selected = nav?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!nav || !selected || nav.scrollWidth <= nav.clientWidth) return;
    const navBox = nav.getBoundingClientRect();
    const selectedBox = selected.getBoundingClientRect();
    if (selectedBox.left >= navBox.left && selectedBox.right <= navBox.right)
      return;
    nav.scrollTo({
      left:
        nav.scrollLeft +
        selectedBox.left -
        navBox.left -
        (nav.clientWidth - selectedBox.width) / 2,
      behavior: "auto",
    });
  }, [categoryId]);
  function changeCategory(next: string) {
    const filterBar = categoryNav.current?.parentElement;
    if (
      filterBar &&
      categoryAnchor.current &&
      results.current &&
      results.current.getBoundingClientRect().top <
        filterBar.getBoundingClientRect().bottom
    ) {
      window.scrollTo({
        top:
          window.scrollY + categoryAnchor.current.getBoundingClientRect().top,
        behavior: "auto",
      });
    }
    selectCategory(next);
  }
  function resetFilters() {
    setSearchQuery("");
    changeCategory("all");
  }

  if (templates.length === 0 && !favoritesOnly)
    return (
      <div className={featured ? styles.catalogEmpty : galleryStyles.empty}>
        <LayoutTemplate size={28} strokeWidth={1.5} aria-hidden="true" />
        <p>Hozircha tanlash uchun nashr qilingan dizayn yo‘q.</p>
      </div>
    );

  return (
    <div className={featured ? undefined : galleryStyles.catalog}>
      <section
        className={featured ? undefined : galleryStyles.content}
        aria-label="Taklifnoma dizaynlari"
      >
        {!featured && (
          <>
            <div className={galleryStyles.toolbar}>
              <div className={galleryStyles.search} role="search">
                <label htmlFor={searchId}>
                  <Search size={18} strokeWidth={1.6} aria-hidden="true" />
                  <span className={galleryStyles.srOnly}>Dizayn qidirish</span>
                </label>
                <input
                  id={searchId}
                  ref={searchInput}
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Dizayn nomini kiriting…"
                />
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="Qidiruvni tozalash"
                    onClick={() => {
                      setSearchQuery("");
                      searchInput.current?.focus();
                    }}
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                )}
              </div>
              <Link
                className={galleryStyles.favoritesToggle}
                href={favoritesOnly ? "/templates" : "/templates?favorites=1"}
                data-active={favoritesOnly || undefined}
              >
                <Heart
                  size={17}
                  fill={favoritesOnly ? "currentColor" : "none"}
                  aria-hidden="true"
                />
                {favoritesOnly
                  ? "Barcha dizaynlar"
                  : `Saralanganlar · ${favorites.favorites.length}`}
              </Link>
            </div>

            <span
              ref={categoryAnchor}
              className={galleryStyles.filterAnchor}
              data-catalog-pin-boundary
              aria-hidden="true"
            />
            <div className={galleryStyles.filters} data-catalog-filters>
              <div className={galleryStyles.filterTitle}>
                <h2>Tadbir turi</h2>
              </div>
              <nav
                ref={categoryNav}
                className={galleryStyles.categories}
                aria-label="Dizayn kategoriyalari"
              >
                {availableCategories.map((category) => {
                  return (
                    <button
                      type="button"
                      key={category.id}
                      aria-pressed={categoryId === category.id}
                      onClick={() => changeCategory(category.id)}
                    >
                      <span>{category.name}</span>
                      <span className={galleryStyles.categoryCount}>
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
            <div
              className={galleryStyles.resultsHeading}
              data-default={(!hasFilters && !favoritesOnly) || undefined}
            >
              <div>
                <h2>
                  {favoritesOnly
                    ? "Saralangan dizaynlar"
                    : searchQuery.trim()
                      ? "Qidiruv natijalari"
                      : renderedCategoryId === "all"
                        ? "Barcha dizaynlar"
                        : categoryName}
                </h2>
                <span>{visibleTemplates.length} ta dizayn</span>
              </div>
              {hasFilters && (
                <button type="button" onClick={resetFilters}>
                  Tozalash <X size={13} aria-hidden="true" />
                </button>
              )}
            </div>
            <p
              className={galleryStyles.srOnly}
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {categoryName}. {visibleTemplates.length} ta dizayn
              {searchQuery.trim() ? `: ${searchQuery.trim()}` : ""}.
            </p>
          </>
        )}
        <div
          className={styles.catalogResults}
          ref={results}
          data-catalog-results
          aria-busy={categoryId !== renderedCategoryId}
        >
          <FavoritesStatus guestHint={favoritesOnly} />
          {favoritesOnly && !favorites.ready && !favorites.error ? (
            <p role="status">Saralanganlar yuklanmoqda…</p>
          ) : visibleTemplates.length === 0 ? (
            <div
              className={featured ? styles.catalogEmpty : galleryStyles.empty}
            >
              <Search size={28} strokeWidth={1.3} aria-hidden="true" />
              <h3>
                {favoritesOnly && !favorites.favorites.length
                  ? "Hali saralangan dizayn yo‘q"
                  : "Dizayn topilmadi"}
              </h3>
              <p>
                {favoritesOnly && !favorites.favorites.length
                  ? "Yoqtirgan dizayningizdagi yurakchani bosing — keyin shu yerdan topasiz."
                  : searchQuery.trim()
                    ? "Boshqa nom bilan qidiring yoki tadbir turini o‘zgartiring."
                    : "Bu kategoriyada hozircha dizayn yo‘q."}
              </p>
              {!favoritesOnly || hasFilters ? (
                <button type="button" onClick={resetFilters}>
                  Barcha dizaynlarni ko‘rish{" "}
                  <ChevronRight size={15} aria-hidden="true" />
                </button>
              ) : null}
              {favoritesOnly && (
                <Link href="/templates">Dizaynlarni ko‘rish</Link>
              )}
            </div>
          ) : (
            <div
              className={featured ? styles.catalogGrid : galleryStyles.grid}
              ref={grid}
            >
              {visibleTemplates.map((template) => (
                <article
                  className={cardStyles.card}
                  key={template.id}
                  data-template-id={template.id}
                >
                  <FavoriteButton
                    templateId={template.id}
                    name={template.name}
                    overlay
                  />
                  <button
                    type="button"
                    className={cardStyles.art}
                    data-card-art
                    onPointerEnter={(event) => {
                      if (event.pointerType !== "touch")
                        playback.start(template.id);
                    }}
                    onPointerLeave={(event) => {
                      if (event.pointerType !== "touch")
                        playback.stop(template.id);
                    }}
                    onFocus={() => playback.start(template.id)}
                    onBlur={() => playback.stop(template.id)}
                    aria-label={`${template.name}: batafsil ko‘rish`}
                    aria-haspopup="dialog"
                    onClick={(event) => {
                      selectedTrigger.current = event.currentTarget;
                      setSelectedTemplate(template);
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className={cardStyles.poster}
                      src={templatePoster(template)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                    {playback.activeId === template.id && (
                      <TemplateCardPreview
                        key={template.id}
                        templateId={template.id}
                      />
                    )}
                    {renderedCategoryId === "all" && (
                      <span className={cardStyles.category}>
                        {categories
                          .filter((category) =>
                            template.categoryIds.includes(category.id),
                          )
                          .map((category) => category.name)
                          .join(" · ")}
                      </span>
                    )}
                    <span className={cardStyles.caption}>
                      <span className={cardStyles.name}>{template.name}</span>
                      <span className={cardStyles.description}>
                        {template.description}
                      </span>
                    </span>
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
        {favoritesOnly &&
          unavailable.length > 0 &&
          renderedCategoryId === "all" &&
          !searchQuery.trim() && (
            <div className={galleryStyles.unavailable}>
              {unavailable.map((item) => (
                <div key={item.templateId}>
                  <span>
                    {templateById(item.templateId)?.name ?? "Saqlangan dizayn"}{" "}
                    — hozir mavjud emas
                  </span>
                  <FavoriteButton
                    templateId={item.templateId}
                    name="Mavjud bo‘lmagan dizayn"
                  />
                </div>
              ))}
            </div>
          )}
      </section>
      {selectedTemplate && (
        <TemplateDetailDialog
          template={selectedTemplate}
          returnFocus={selectedTrigger.current}
          onClose={() => setSelectedTemplate(null)}
        />
      )}
    </div>
  );
}
