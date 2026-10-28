"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Eye, Search, X } from "lucide-react";
import {
  formatPrice,
  type Invitation,
  type TemplateCategory,
  type TemplateDefinition,
  switchTemplate,
} from "@taklifnoma/contracts";
import { matchesTemplateSearch } from "@/modules/catalog/template-search";
import { templatePoster } from "@/modules/catalog/template-poster";
import cardStyles from "@/modules/catalog/template-cards.module.css";
import { studioTemplateDescription } from "./template-copy";
import styles from "./studio.module.css";

export function StudioTemplatePicker({
  invitation,
  templates,
  categories,
  onSelect,
  disabled,
}: {
  invitation: Invitation;
  templates: TemplateDefinition[];
  categories: TemplateCategory[];
  onSelect: (id: TemplateDefinition["id"]) => void;
  disabled: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const changeButton = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(12);
  useEffect(() => {
    setQuery("");
    setLimit(12);
    dialog.current?.close();
  }, [invitation.eventType]);
  const selected = templates.find(
    (template) => template.id === invitation.templateId,
  );
  const filtered = templates.filter((template) =>
    matchesTemplateSearch(
      {
        ...template,
        description: `${template.description} ${studioTemplateDescription(template)}`,
      },
      categories,
      query,
    ),
  );
  function choose(template: TemplateDefinition) {
    onSelect(template.id);
    dialog.current?.close();
    // The initial collection trigger disappears after the first selection.
    requestAnimationFrame(() =>
      changeButton.current?.focus({ preventScroll: true }),
    );
  }
  function card(template: TemplateDefinition) {
    return (
      <div className={styles.templateCard} key={template.id}>
        <button
          type="button"
          disabled={disabled}
          aria-pressed={template.id === invitation.templateId}
          className={`${cardStyles.art} ${styles.templateSelect}`}
          onClick={() => choose(template)}
        >
          <img
            className={cardStyles.poster}
            src={templatePoster(template)}
            alt=""
            loading="lazy"
          />
          {template.id === invitation.templateId && (
            <span className={styles.pickerCheck}>
              <Check size={17} />
            </span>
          )}
          <span className={`${cardStyles.caption} ${styles.templateMeta}`}>
            <strong className={cardStyles.name}>{template.name}</strong>
            <span className={cardStyles.description}>
              {studioTemplateDescription(template)}
            </span>
            <span className={styles.templatePrice}>
              {formatPrice(template.priceMinor)}
            </span>
          </span>
        </button>
        <Link
          className={styles.templateFullPreview}
          href={`/preview?template=${encodeURIComponent(template.id)}&draft=${encodeURIComponent(invitation.id)}`}
          onClick={() => {
            try {
              sessionStorage.setItem(
                `taklifnoma:full-preview:v1:${invitation.id}`,
                JSON.stringify(switchTemplate(invitation, template.id)),
              );
            } catch {
              /* Browser draft remains the fallback. */
            }
          }}
        >
          <Eye size={15} /> Ko‘rish
          <span className={styles.srOnly}> · {template.name}</span>
        </Link>
      </div>
    );
  }
  return (
    <div className={styles.designPicker}>
      {selected ? (
        <div className={styles.designSummary}>
          <img src={templatePoster(selected)} alt="" />
          <div>
            <small>Tanlangan dizayn</small>
            <strong>{selected.name}</strong>
            <span>{formatPrice(selected.priceMinor)}</span>
          </div>
          <button
            ref={changeButton}
            type="button"
            className={styles.secondaryButton}
            disabled={disabled}
            onClick={() => dialog.current?.showModal()}
          >
            Almashtirish
          </button>
        </div>
      ) : (
        <>
          <div className={styles.templateGrid}>
            {templates.slice(0, 4).map(card)}
          </div>
          {!templates.length && (
            <p className={styles.help}>
              Bu tadbir uchun hozircha tayyor dizayn yo‘q. Qoralamani
              saqlashingiz mumkin.
            </p>
          )}
        </>
      )}
      {!selected && templates.length > 4 && (
        <button
          type="button"
          className={styles.secondaryButton}
          disabled={disabled}
          onClick={() => dialog.current?.showModal()}
        >
          Barcha dizaynlarni ko‘rish · {templates.length}
        </button>
      )}
      <dialog
        ref={dialog}
        className={styles.pickerDialog}
        aria-labelledby="studio-picker-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const box = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < box.left ||
              event.clientX > box.right ||
              event.clientY < box.top ||
              event.clientY > box.bottom
            )
              event.currentTarget.close();
          }
        }}
      >
        <div className={styles.pickerToolbar}>
          <h2 id="studio-picker-title">Dizayn tanlang</h2>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Dizaynlarni yopish"
            onClick={() => dialog.current?.close()}
          >
            <X size={20} />
          </button>
        </div>
        <label className={styles.templateSearch}>
          <Search size={17} />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setLimit(12);
            }}
            placeholder="Dizayn qidirish"
            aria-label="Dizayn qidirish"
          />
        </label>
        <p className={styles.help} role="status">
          {filtered.length} ta dizayn
        </p>
        <div className={styles.pickerGrid}>
          {filtered.slice(0, limit).map(card)}
        </div>
        {!filtered.length && <p>Qidiruv bo‘yicha dizayn topilmadi.</p>}
        {filtered.length > limit && (
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => setLimit((value) => value + 12)}
          >
            Yana ko‘rsatish
          </button>
        )}
      </dialog>
    </div>
  );
}
