"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Eye, LayoutTemplate, Search } from "lucide-react";
import type {
  TemplateCategory,
  TemplateDefinition,
} from "@taklifnoma/contracts";
import { EVENT_TYPE_OPTIONS, formatPrice } from "@taklifnoma/contracts";
import styles from "@/app/home.module.css";
import { matchesTemplateSearch } from "./template-search";

export function TemplateGallery({
  templates,
  categories,
}: {
  templates: TemplateDefinition[];
  categories: TemplateCategory[];
}) {
  const [categoryId, setCategoryId] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const visibleTemplates = useMemo(
    () =>
      templates
        .filter(
          (template) =>
            categoryId === "all" || template.categoryIds.includes(categoryId),
        )
        .filter((template) =>
          matchesTemplateSearch(template, categories, searchQuery),
        ),
    [categoryId, categories, searchQuery, templates],
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
      {categories.length > 0 && (
        <div
          className={styles.categoryFilters}
          aria-label="Dizayn kategoriyalari"
        >
          <button
            type="button"
            aria-pressed={categoryId === "all"}
            className={categoryId === "all" ? styles.selectedFilter : ""}
            onClick={() => setCategoryId("all")}
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
                onClick={() => setCategoryId(category.id)}
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
        <div className={styles.catalogGrid}>
          {visibleTemplates.map((template) => {
            const previewUrl = `/preview?template=${encodeURIComponent(template.id)}`;
            return (
              <article className={styles.templateCard} key={template.id}>
                <Link
                  className={styles.templateArt}
                  href={previewUrl}
                  aria-label={`${template.name}: to‘liq ko‘rinishini ochish${template.published ? `, ${formatPrice(template.priceMinor)}` : ""}`}
                  style={{
                    backgroundImage: `url(${template.previewImage?.startsWith("/") ? template.previewImage : `/templates/${template.id}/${template.previewImage ?? "stage.webp"}`})`,
                  }}
                >
                  {template.published && (
                    <span className={styles.cardPrice}>
                      {formatPrice(template.priceMinor)}
                    </span>
                  )}
                </Link>
                <div className={styles.templateInfo}>
                  <span>
                    {categories
                      .filter((category) =>
                        template.categoryIds.includes(category.id),
                      )
                      .map((category) => category.name)
                      .join(" · ")}
                  </span>
                  <h3>{template.name}</h3>
                  <p
                    className={styles.templateDescription}
                    title={template.description}
                  >
                    {template.description}
                  </p>
                  <span className={styles.eventTypes}>
                    {template.supportedEventTypes
                      .map(
                        (id) =>
                          EVENT_TYPE_OPTIONS.find(
                            (eventType) => eventType.id === id,
                          )?.name ?? id,
                      )
                      .join(", ")}
                  </span>
                  {!template.published && (
                    <span className={styles.previewOnlyLabel}>
                      Faqat ko‘rib chiqish uchun
                    </span>
                  )}
                  <div className={styles.templateActions}>
                    <Link className="button secondary" href={previewUrl}>
                      <Eye size={14} /> Ko‘rish
                    </Link>
                    {template.published && (
                      <Link
                        className={styles.createAction}
                        href={`/studio?new=1&template=${encodeURIComponent(template.id)}`}
                      >
                        Yaratish <ArrowUpRight size={16} />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
