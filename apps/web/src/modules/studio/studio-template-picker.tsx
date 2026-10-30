"use client";

import { publicTemplateId } from "@taklifnoma/contracts";

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
import { TemplateCardPreview } from "@/modules/catalog/template-card-preview";
import { useCardPlayback } from "@/modules/catalog/use-card-playback";
import cardStyles from "@/modules/catalog/template-cards.module.css";
import { studioTemplateDescription } from "./template-copy";
import styles from "./studio.module.css";

export function StudioTemplatePicker({
  invitation,
  templates,
  categories,
  onSelect,
  onOpen,
  disabled,
}: {
  invitation: Invitation;
  templates: TemplateDefinition[];
  categories: TemplateCategory[];
  onSelect: (id: TemplateDefinition["id"]) => void;
  onOpen: () => void;
  disabled: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const changeButton = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(12);
  const [open, setOpen] = useState(false);
  const inlineGrid = useRef<HTMLDivElement>(null);
  const dialogGrid = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setQuery("");
    setLimit(12);
    dialog.current?.close();
  }, [invitation.eventType]);
  const selected = templates.find(
    (template) => template.id === invitation.templateId,
  );
  const inlineTemplates = templates.slice(0, 6);
  const orderedTemplates = selected
    ? [selected, ...templates.filter((template) => template.id !== selected.id)]
    : templates;
  const filtered = orderedTemplates.filter((template) =>
    matchesTemplateSearch(
      {
        ...template,
        description: `${template.description} ${studioTemplateDescription(template)}`,
      },
      categories,
      query,
    ),
  );
  const inlinePlayback = useCardPlayback(
    inlineGrid,
    inlineTemplates.map((template) => template.id),
    open || !!selected,
  );
  const dialogPlayback = useCardPlayback(
    dialogGrid,
    filtered.slice(0, limit).map((template) => template.id),
    !open,
  );
  function openPicker() {
    onOpen();
    setQuery("");
    setLimit(12);
    setOpen(true);
    dialog.current?.showModal();
    dialog.current?.scrollTo({ top: 0 });
  }
  function choose(template: TemplateDefinition) {
    onSelect(template.id);
    dialog.current?.close();
    // The initial collection trigger disappears after the first selection.
    requestAnimationFrame(() =>
      changeButton.current?.focus({ preventScroll: true }),
    );
  }
  function card(template: TemplateDefinition, playback: typeof inlinePlayback) {
    return (
      <div
        className={styles.templateCard}
        key={template.id}
        data-template-id={template.id}
        onPointerEnter={(event) => {
          if (event.pointerType !== "touch") playback.start(template.id);
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
          disabled={disabled}
          aria-pressed={template.id === invitation.templateId}
          className={`${cardStyles.art} ${styles.templateSelect}`}
          data-card-art
          onClick={() => choose(template)}
        >
          <img
            className={cardStyles.poster}
            src={templatePoster(template)}
            alt=""
            loading="lazy"
          />
          {playback.activeId === template.id && (
            <TemplateCardPreview templateId={template.id} />
          )}
          {template.id === invitation.templateId && (
            <span className={styles.pickerCheck}>
              <Check size={15} /> Tanlangan
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
          href={`/preview?template=${encodeURIComponent(publicTemplateId(template.id))}&draft=${encodeURIComponent(invitation.id)}`}
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
            onClick={openPicker}
          >
            Almashtirish
          </button>
        </div>
      ) : (
        <>
          <div className={styles.templateGrid} ref={inlineGrid}>
            {inlineTemplates.map((template) => card(template, inlinePlayback))}
          </div>
          {!templates.length && (
            <p className={styles.help}>
              Bu tadbir uchun hozircha tayyor dizayn yo‘q. Qoralamani
              saqlashingiz mumkin.
            </p>
          )}
        </>
      )}
      {!selected && templates.length > inlineTemplates.length && (
        <button
          type="button"
          className={styles.secondaryButton}
          disabled={disabled}
          onClick={openPicker}
        >
          Barcha dizaynlarni ko‘rish · {templates.length}
        </button>
      )}
      <dialog
        ref={dialog}
        className={styles.pickerDialog}
        aria-labelledby="studio-picker-title"
        onClose={() => setOpen(false)}
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
          {filtered.length} ta dizayn · tanlangan tadbir uchun
        </p>
        <div className={styles.pickerGrid} ref={dialogGrid}>
          {filtered
            .slice(0, limit)
            .map((template) => card(template, dialogPlayback))}
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
