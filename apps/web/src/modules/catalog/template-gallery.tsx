"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Eye, LayoutTemplate } from "lucide-react";
import type {
  TemplateCategory,
  TemplateDefinition,
} from "@taklifnoma/contracts";
import { formatPrice } from "@taklifnoma/contracts";
import styles from "@/app/home.module.css";

export function TemplateGallery({
  templates,
  categories,
}: {
  templates: TemplateDefinition[];
  categories: TemplateCategory[];
}) {
  const [categoryId, setCategoryId] = useState("all");
  const visibleTemplates = useMemo(
    () =>
      templates.filter(
        (template) =>
          categoryId === "all" || template.categoryIds.includes(categoryId),
      ),
    [categoryId, templates],
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
          {categories.map((category) => (
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
          <p>Bu kategoriyada hozircha dizayn yo‘q.</p>
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
                  aria-label={`${template.name}: to‘liq ko‘rinishini ochish`}
                  style={{
                    backgroundImage: `url(${template.previewImage?.startsWith("/") ? template.previewImage : `/templates/${template.id}/${template.previewImage ?? "stage.webp"}`})`,
                  }}
                />
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
                  <p>{template.description}</p>
                  {template.published ? (
                    <strong>{formatPrice(template.priceMinor)}</strong>
                  ) : (
                    <span className={styles.previewOnlyLabel}>
                      Faqat ko‘rib chiqish uchun
                    </span>
                  )}
                  <div className={styles.templateActions}>
                    <Link className="button secondary" href={previewUrl}>
                      <Eye size={16} /> To‘liq ko‘rish
                    </Link>
                    {template.published && (
                      <Link
                        className="button"
                        href={`/studio?template=${encodeURIComponent(template.id)}`}
                      >
                        Shu dizaynni tanlash <ArrowUpRight size={16} />
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
