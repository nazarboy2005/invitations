"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { LayoutTemplate, Search } from "lucide-react";
import type {
  TemplateCategory,
  TemplateDefinition,
} from "@taklifnoma/contracts";

import styles from "@/app/home.module.css";
import cardStyles from "./template-cards.module.css";
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
}: {
  templates: TemplateDefinition[];
  categories: TemplateCategory[];
  featured?: boolean;
  initialCategory?: string;
}) {
  const results = useRef<HTMLDivElement>(null);
  const { categoryId, renderedCategoryId, selectCategory } =
    useCategoryTransition(results, initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const grid = useRef<HTMLDivElement>(null);
  const selectedTrigger = useRef<HTMLButtonElement>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateDefinition | null>(null);
  const visibleTemplates = useMemo(
    () =>
      (featured
        ? templates
        : orderCatalogTemplates(templates, renderedCategoryId)
      ).filter((template) =>
        matchesTemplateSearch(template, categories, searchQuery),
      ),
    [renderedCategoryId, categories, searchQuery, templates, featured],
  );
  const playback = useCardPlayback(
    grid,
    visibleTemplates.map((template) => template.id),
    selectedTemplate !== null || categoryId !== renderedCategoryId,
  );

  if (templates.length === 0)
    return (
      <div className={styles.catalogEmpty}>
        <LayoutTemplate size={25} strokeWidth={1.5} />
        <p>Hozircha tanlash uchun nashr qilingan dizayn yo‘q.</p>
      </div>
    );

  return (
    <>
      {!featured && (
        <label className={styles.catalogSearch}>
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Dizayn qidirish"
            aria-label="Dizayn qidirish"
          />
        </label>
      )}
      {!featured && categories.length > 0 && (
        <div
          className={styles.categoryFilters}
          aria-label="Dizayn kategoriyalari"
        >
          <button
            type="button"
            aria-pressed={categoryId === "all"}
            className={categoryId === "all" ? styles.selectedFilter : ""}
            onClick={() => selectCategory("all")}
          >
            Barchasi <span>{templates.length}</span>
          </button>
          {categories
            .filter((category) =>
              templates.some((template) =>
                template.categoryIds.includes(category.id),
              ),
            )
            .map((category) => (
              <button
                type="button"
                key={category.id}
                aria-pressed={categoryId === category.id}
                className={
                  categoryId === category.id ? styles.selectedFilter : ""
                }
                onClick={() => selectCategory(category.id)}
              >
                {category.name}
                <span>
                  {
                    templates.filter((template) =>
                      template.categoryIds.includes(category.id),
                    ).length
                  }
                </span>
              </button>
            ))}
        </div>
      )}
      <div
        className={styles.catalogResults}
        ref={results}
        data-catalog-results
        aria-busy={categoryId !== renderedCategoryId}
      >
        {visibleTemplates.length === 0 ? (
          <div className={styles.catalogEmpty}>
            <LayoutTemplate size={25} strokeWidth={1.5} />
            <p>
              {searchQuery.trim()
                ? "Qidiruv bo‘yicha dizayn topilmadi."
                : "Bu kategoriyada hozircha dizayn yo‘q."}
            </p>
          </div>
        ) : (
          <div className={styles.catalogGrid} ref={grid}>
            {visibleTemplates.map((template) => (
              <article
                className={cardStyles.card}
                key={template.id}
                data-template-id={template.id}
                onPointerEnter={(event) => {
                  if (event.pointerType !== "touch")
                    playback.start(template.id);
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType !== "touch") playback.stop(template.id);
                }}
                onFocus={() => playback.start(template.id)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget))
                    playback.stop(template.id);
                }}
              >
                <button
                  type="button"
                  className={cardStyles.art}
                  data-card-art
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
      {selectedTemplate && (
        <TemplateDetailDialog
          template={selectedTemplate}
          returnFocus={selectedTrigger.current}
          onClose={() => setSelectedTemplate(null)}
        />
      )}
    </>
  );
}
