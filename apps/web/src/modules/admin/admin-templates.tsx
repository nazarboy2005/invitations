"use client";

import { publicTemplateId } from "@taklifnoma/contracts";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  EVENT_TYPE_OPTIONS,
  formatPrice,
  type TemplateCategory,
  type TemplateDefinition,
} from "@taklifnoma/contracts";
import { Search, ChevronDown, ExternalLink, ImageOff } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SoftSelect } from "@/components/soft-select";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { templatePoster } from "@/modules/catalog/template-poster";
import styles from "./admin.module.css";
import { useAdminDirty } from "./admin-navigation-guard";

const inputStyle: CSSProperties = {
  padding: "11px 12px",
  border: "1px solid var(--line)",
  borderRadius: 7,
  background: "var(--surface)",
  color: "var(--ink)",
  width: "100%",
  minWidth: 0,
  minHeight: 44,
};
const labelStyle: CSSProperties = {
  display: "grid",
  gap: 8,
  fontSize: 13,
  minWidth: 0,
  overflowWrap: "anywhere",
};

export function AdminTemplates({
  initialCatalog,
  view,
}: {
  initialCatalog: {
    templates: TemplateDefinition[];
    categories: TemplateCategory[];
    configured: boolean;
  };
  view: "templates" | "categories";
}) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [status, setStatus] = useState(
    ["published", "hidden"].includes(searchParams.get("status") ?? "")
      ? searchParams.get("status")!
      : "all",
  );
  const [page, setPage] = useState(
    Math.max(1, Math.floor(Number(searchParams.get("page")) || 1)),
  );
  const [templates, setTemplates] = useState<TemplateDefinition[]>(
    initialCatalog.templates,
  );
  const [categories, setCategories] = useState<TemplateCategory[]>(
    initialCatalog.categories,
  );
  const [configured, setConfigured] = useState(initialCatalog.configured);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [hideTarget, setHideTarget] = useState<TemplateDefinition | null>(null);
  const [hideReplacement, setHideReplacement] = useState("");
  const leave = useAdminDirty(
    !!newCategoryId.trim() || !!newCategoryName.trim(),
  );
  const loading = false;
  useEffect(() => {
    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries({
      q: query,
      status: status === "all" ? "" : status,
      page: page === 1 ? "" : String(page),
    })) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    window.history.replaceState(null, "", url);
  }, [query, status, page]);

  async function load() {
    const response = await fetch("/api/admin/templates", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok)
      throw new Error(
        data.error?.message ?? "Bu sahifa faqat sayt administratorlari uchun.",
      );
    setTemplates(data.templates ?? []);
    setCategories(
      (data.categories ?? []).sort(
        (a: TemplateCategory, b: TemplateCategory) =>
          a.position - b.position || a.name.localeCompare(b.name),
      ),
    );
    setConfigured(data.configured === true);
  }

  async function mutate(
    url: string,
    method: "PATCH" | "POST",
    body: Record<string, unknown>,
    message: string,
  ) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.error?.code === "ADMIN_REAUTH_REQUIRED") {
        throw new Error(
          "Tasdiqlash muddati tugadi. Yuqoridagi «Hisobni tasdiqlash» havolasini oching, so‘ng o‘zgarishlarni qayta saqlang.",
        );
      }
      if (!response.ok)
        throw new Error(
          data.error?.message ??
            "O‘zgarishlarni saqlab bo‘lmadi. Qayta urinib ko‘ring.",
        );
      setNotice(
        data.replaced
          ? `${data.replaced} ta taklifnoma yangi dizaynga o‘tkazildi.`
          : message,
      );
      try {
        await load();
      } catch {
        setError(
          "O‘zgarish saqlandi, lekin yangi ro‘yxat yuklanmadi. Sahifani yangilang.",
        );
      }
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Saqlab bo‘lmadi.");
      return false;
    } finally {
      setBusy(false);
    }
  }
  const unavailable = busy || !configured;
  const filtered = templates.filter(
    (template) =>
      (status === "all" || template.published === (status === "published")) &&
      `${template.name} ${template.id}`
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 12));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * 12, currentPage * 12);

  return (
    <div>
      {view === "templates" && (
        <>
          <div className={styles.overview} aria-label="Dizaynlar holati">
            <div>
              <span>Jami dizaynlar</span>
              <strong>{templates.length}</strong>
            </div>
            <div>
              <span>Nashr qilingan</span>
              <strong>
                {templates.filter((item) => item.published).length}
              </strong>
            </div>
            <div>
              <span>Yashirilgan</span>
              <strong>
                {templates.filter((item) => !item.published).length}
              </strong>
            </div>
          </div>
          <div className={styles.toolbar}>
            <label className={styles.search}>
              <Search size={18} aria-hidden="true" />
              <span className={styles.srOnly}>Dizaynlarni qidirish</span>
              <input
                name="q"
                type="search"
                autoComplete="off"
                placeholder="Nomi yoki belgisi bo‘yicha qidirish…"
                value={query}
                onChange={(event) => {
                  const value = event.target.value;
                  leave(() => {
                    setQuery(value);
                    setPage(1);
                  });
                }}
              />
            </label>
            <label className={styles.statusFilter}>
              <span>Holat</span>
              <select
                name="status"
                value={status}
                onChange={(event) => {
                  const value = event.target.value;
                  leave(() => {
                    setStatus(value);
                    setPage(1);
                  });
                }}
              >
                <option value="all">Barchasi</option>
                <option value="published">Nashr qilingan</option>
                <option value="hidden">Yashirilgan</option>
              </select>
            </label>
          </div>
        </>
      )}
      {error && (
        <p role="alert" className="inline-note">
          {error}{" "}
          <Link href="/dashboard" style={{ textDecoration: "underline" }}>
            Hisobga qaytish
          </Link>
        </p>
      )}
      {notice && (
        <p role="status" className="inline-note">
          {notice}
        </p>
      )}
      {loading && (
        <p role="status" className="muted">
          Dizaynlar va kategoriyalar yuklanmoqda…
        </p>
      )}
      {!loading && !configured && !error && (
        <p className="inline-note">
          O‘zgarishlarni saqlash hozircha mavjud emas. Sozlamalar tayyor
          bo‘lgach boshqaruv yoqiladi.
        </p>
      )}

      {view === "categories" && !loading && categories.length > 0 && (
        <section className={styles.panel} aria-labelledby="categories-title">
          <h2
            id="categories-title"
            style={{
              margin: "0 0 10px",
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: 27,
            }}
          >
            Kategoriyalar
          </h2>
          <p className="muted" style={{ fontSize: 13, lineHeight: 1.8 }}>
            Nomini o‘zgartirsangiz, sayt va dizayn tanlashdagi ro‘yxatlar ham
            yangilanadi. Kategoriya tadbir turini cheklamaydi.
          </p>
          <div style={{ display: "grid", gap: 12, marginBlock: 20 }}>
            {categories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                disabled={unavailable}
                onSave={(name) =>
                  mutate(
                    `/api/admin/categories/${encodeURIComponent(category.id)}`,
                    "PATCH",
                    { name },
                    "Kategoriya nomi saqlandi.",
                  )
                }
              />
            ))}
          </div>
        </section>
      )}

      {view === "categories" &&
        !loading &&
        (configured || categories.length > 0) && (
          <section
            className="inline-note"
            style={{ marginBlock: 24, padding: 24 }}
            aria-labelledby="create-category-title"
          >
            <h2
              id="create-category-title"
              style={{ fontSize: 17, margin: "0 0 18px", fontWeight: 500 }}
            >
              Yangi kategoriya
            </h2>
            <form
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                alignItems: "end",
              }}
              onSubmit={async (event) => {
                event.preventDefault();
                const result = await mutate(
                  "/api/admin/categories",
                  "POST",
                  { id: newCategoryId.trim(), name: newCategoryName.trim() },
                  "Yangi kategoriya yaratildi.",
                );
                if (result) {
                  setNewCategoryId("");
                  setNewCategoryName("");
                }
              }}
            >
              <label style={{ ...labelStyle, flex: "1 1 240px" }}>
                Kategoriya nomi
                <input
                  required
                  name="categoryName"
                  autoComplete="off"
                  maxLength={120}
                  value={newCategoryName}
                  onChange={(event) => setNewCategoryName(event.target.value)}
                  disabled={unavailable}
                  style={inputStyle}
                  placeholder="Masalan: Fotiha…"
                />
              </label>
              <label style={{ ...labelStyle, flex: "1 1 240px" }}>
                Qisqa belgi
                <input
                  required
                  name="categoryId"
                  autoComplete="off"
                  spellCheck={false}
                  pattern="[a-z][a-z0-9]*(?:-[a-z0-9]+)*"
                  maxLength={64}
                  value={newCategoryId}
                  onChange={(event) => setNewCategoryId(event.target.value)}
                  disabled={unavailable}
                  style={inputStyle}
                  placeholder="Masalan: fotiha…"
                  aria-describedby="category-id-help"
                />
                <small
                  id="category-id-help"
                  className="muted"
                  style={{ fontSize: 11 }}
                >
                  Kichik lotin harfidan boshlang. Harf, raqam va chiziqcha; 64
                  belgigacha. Keyin o‘zgarmaydi.
                </small>
              </label>
              <button className="button" disabled={unavailable}>
                Kategoriya qo‘shish
              </button>
            </form>
          </section>
        )}

      {view === "templates" && (
        <section className={styles.panel} aria-label="Dizaynlar ro‘yxati">
          <div className={styles.panelHeading}>
            <h2>Katalog dizaynlari</h2>
            <span className={styles.count}>{filtered.length} ta dizayn</span>
          </div>
          {visible.map((template) => (
            <details className={styles.templateItem} key={template.id}>
              <summary>
                <TemplateArtwork template={template} />
                <span className={styles.templateName}>
                  <strong>{template.name}</strong>
                  <small>{template.id}</small>
                </span>
                <span
                  className={
                    template.published ? styles.published : styles.hidden
                  }
                >
                  {template.published ? "Nashr qilingan" : "Yashirilgan"}
                </span>
                <span className={styles.price}>
                  {formatPrice(template.priceMinor)}
                </span>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className={styles.expandIcon}
                />
              </summary>
              <div className={styles.templateEditor}>
                <Link
                  href={`/preview?template=${encodeURIComponent(publicTemplateId(template.id))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.previewLink}
                >
                  Dizaynni ko‘rish
                  <ExternalLink size={15} aria-hidden="true" />
                </Link>
                <TemplateRow
                  key={template.id}
                  template={template}
                  templates={templates}
                  categories={categories}
                  busy={unavailable}
                  onHideRequest={(replacementId) => {
                    setHideTarget(template);
                    setHideReplacement(replacementId);
                  }}
                  onUpdate={(id, body) =>
                    mutate(
                      `/api/admin/templates/${encodeURIComponent(id)}`,
                      "PATCH",
                      body,
                      "Dizayn o‘zgarishlari saqlandi.",
                    )
                  }
                />
              </div>
            </details>
          ))}
          {!filtered.length && (
            <p className={styles.empty}>
              Dizayn topilmadi. Qidiruv yoki holat filtrini o‘zgartiring.
            </p>
          )}
          <nav className={styles.pagination} aria-label="Dizaynlar sahifalari">
            <span>
              {currentPage} / {pages} sahifa
            </span>
            <div>
              <button
                type="button"
                className="button secondary"
                disabled={currentPage <= 1 || busy}
                onClick={() => leave(() => setPage(currentPage - 1))}
              >
                Oldingi
              </button>
              <button
                type="button"
                className="button secondary"
                disabled={currentPage >= pages || busy}
                onClick={() => leave(() => setPage(currentPage + 1))}
              >
                Keyingi
              </button>
            </div>
          </nav>
        </section>
      )}
      {hideTarget && (
        <ConfirmationDialog
          title="Dizaynni faolsizlantirasizmi?"
          description="Dizayn unga tegishli taklifnomalar bilan tanlangan dizaynga almashtiriladi."
          confirmLabel="Faolsizlantirish va almashtirish"
          onCancel={() => setHideTarget(null)}
          onConfirm={async () => {
            const target = hideTarget;
            const saved = await mutate(
              `/api/admin/templates/${encodeURIComponent(target.id)}`,
              "PATCH",
              {
                published: false,
                ...(hideReplacement
                  ? { replacementTemplateId: hideReplacement }
                  : {}),
              },
              "Dizayn yashirildi.",
            );
            if (saved) setHideTarget(null);
          }}
          busy={busy}
        />
      )}
    </div>
  );
}

function TemplateArtwork({ template }: { template: TemplateDefinition }) {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (ref.current?.complete && !ref.current.naturalWidth) setFailed(true);
  }, []);
  return (
    <span className={styles.poster}>
      <ImageOff size={18} aria-hidden="true" />
      {!failed && (
        <img
          ref={ref}
          src={templatePoster(template)}
          width={54}
          height={72}
          loading="lazy"
          alt=""
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

function CategoryRow({
  category,
  disabled,
  onSave,
}: {
  category: TemplateCategory;
  disabled: boolean;
  onSave: (name: string) => Promise<boolean>;
}) {
  const [name, setName] = useState(category.name);
  useAdminDirty(name.trim() !== category.name);
  useEffect(() => {
    setName(category.name);
  }, [category.name]);
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        await onSave(name.trim());
      }}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        alignItems: "end",
        paddingTop: 12,
        borderTop: "1px solid var(--line)",
      }}
    >
      <label style={{ ...labelStyle, flex: "1 1 240px", maxWidth: 500 }}>
        {category.id}
        <input
          required
          name="name"
          autoComplete="off"
          maxLength={120}
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={disabled}
          style={inputStyle}
          aria-label={`${category.id} kategoriya nomi`}
        />
      </label>
      <button
        className="button secondary"
        disabled={disabled || name.trim() === category.name}
      >
        Nomini saqlash
      </button>
    </form>
  );
}

function TemplateRow({
  template,
  templates,
  categories,
  busy,
  onUpdate,
  onHideRequest,
}: {
  template: TemplateDefinition;
  templates: TemplateDefinition[];
  categories: TemplateCategory[];
  busy: boolean;
  onUpdate: (id: string, body: Record<string, unknown>) => Promise<boolean>;
  onHideRequest: (replacementId: string) => void;
}) {
  const [price, setPrice] = useState(String(template.priceMinor / 100));
  const [replacement, setReplacement] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>(
    template.categoryIds,
  );
  const [supportedEventTypes, setSupportedEventTypes] = useState(
    template.supportedEventTypes,
  );
  const categoryKey = JSON.stringify(template.categoryIds);
  const eventTypesKey = JSON.stringify(template.supportedEventTypes);
  useEffect(() => {
    setPrice(String(template.priceMinor / 100));
  }, [template.priceMinor]);
  useEffect(() => {
    setCategoryIds(JSON.parse(categoryKey));
  }, [categoryKey]);
  useEffect(() => {
    setSupportedEventTypes(JSON.parse(eventTypesKey));
  }, [eventTypesKey]);
  const changedCategories =
    [...categoryIds].sort().join("|") !==
    [...template.categoryIds].sort().join("|");
  useAdminDirty(
    changedCategories ||
      Number(price) * 100 !== template.priceMinor ||
      [...supportedEventTypes].sort().join("|") !==
        [...template.supportedEventTypes].sort().join("|"),
  );
  return (
    <section
      className="inline-note"
      style={{ display: "grid", gap: 22, padding: 24 }}
      aria-labelledby={`template-${template.id}`}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 22,
          alignItems: "center",
        }}
      >
        <div style={{ minWidth: 180 }}>
          <h2
            id={`template-${template.id}`}
            style={{
              margin: "0 0 8px",
              fontFamily: "var(--font-display)",
              fontWeight: 400,
            }}
          >
            {template.name}
          </h2>
          <span className="tag">
            {template.published ? "Nashr qilingan" : "Yashirilgan"}
          </span>
          <p style={{ marginBottom: 0 }}>{formatPrice(template.priceMinor)}</p>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const amount = Number(price);
            if (Number.isFinite(amount) && amount >= 0)
              void onUpdate(template.id, {
                priceMinor: Math.round(amount * 100),
              });
          }}
          style={{
            display: "flex",
            alignItems: "end",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <label style={labelStyle}>
            Narx (so‘m)
            <input
              required
              name="price"
              inputMode="numeric"
              min="0"
              max="10000000000"
              step="1"
              type="number"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              disabled={busy}
              style={{ ...inputStyle, width: 170 }}
            />
          </label>
          <button
            disabled={busy || Number(price) * 100 === template.priceMinor}
            className="button secondary"
          >
            Narxni saqlash
          </button>
        </form>
        <div
          style={{
            display: "grid",
            gap: 10,
            marginLeft: "auto",
            minWidth: "min(100%, 230px)",
          }}
        >
          {template.published && (
            <label style={labelStyle}>
              O‘rniga qo‘yiladigan dizayn
              <SoftSelect
                label="O‘rniga qo‘yiladigan dizayn"
                value={replacement}
                placeholder="Tanlang"
                options={templates
                  .filter((item) => item.published && item.id !== template.id)
                  .map((item) => ({ value: item.id, label: item.name }))}
                onChange={setReplacement}
                disabled={busy}
              />
            </label>
          )}
          <button
            className="button secondary"
            disabled={busy}
            onClick={() => {
              if (template.published) {
                onHideRequest(replacement);
                return;
              }
              void onUpdate(template.id, {
                published: !template.published,
                ...(replacement ? { replacementTemplateId: replacement } : {}),
              });
            }}
          >
            {template.published
              ? "Faolsizlantirish va almashtirish"
              : "Faollashtirish"}
          </button>
        </div>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void onUpdate(template.id, { categoryIds });
        }}
        style={{ borderTop: "1px solid var(--line)", paddingTop: 20 }}
      >
        <fieldset disabled={busy} style={{ border: 0, padding: 0, margin: 0 }}>
          <legend
            style={{
              fontWeight: 500,
              fontSize: 14,
              padding: 0,
              marginBottom: 10,
            }}
          >
            Kategoriyalar
          </legend>
          <p
            className="muted"
            style={{ margin: "0 0 12px", fontSize: 12, lineHeight: 1.8 }}
          >
            Bir nechta kategoriya tanlashingiz yoki barchasini olib
            tashlashingiz mumkin. Dizaynning matni va tadbir turi o‘zgarmaydi.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 12px" }}>
            {categories.map((category) => (
              <label
                key={category.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  minHeight: 44,
                  padding: "9px 12px",
                  borderRadius: 6,
                  border: "1px solid var(--line)",
                  background: categoryIds.includes(category.id)
                    ? "var(--accent-soft)"
                    : "var(--surface)",
                  cursor: busy ? "default" : "pointer",
                  fontSize: 13,
                  overflowWrap: "anywhere",
                  maxWidth: "100%",
                }}
              >
                <input
                  type="checkbox"
                  checked={categoryIds.includes(category.id)}
                  onChange={(event) =>
                    setCategoryIds((current) =>
                      event.target.checked
                        ? [...current, category.id]
                        : current.filter((id) => id !== category.id),
                    )
                  }
                  style={{
                    width: 17,
                    height: 17,
                    accentColor: "var(--primary)",
                  }}
                />
                {category.name}
              </label>
            ))}
          </div>
          {categories.length === 0 && (
            <p className="muted" style={{ fontSize: 12 }}>
              Avval kategoriya yarating.
            </p>
          )}
          <button
            className="button secondary"
            disabled={busy || !changedCategories}
            style={{ marginTop: 16 }}
          >
            Kategoriyalarni saqlash
          </button>
        </fieldset>
      </form>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void onUpdate(template.id, { supportedEventTypes });
        }}
        style={{ borderTop: "1px solid var(--line)", paddingTop: 20 }}
      >
        <fieldset disabled={busy} style={{ border: 0, padding: 0, margin: 0 }}>
          <legend
            style={{
              fontWeight: 500,
              fontSize: 14,
              padding: 0,
              marginBottom: 10,
            }}
          >
            Mos keladigan tadbirlar
          </legend>
          <p className="muted" style={{ margin: "0 0 12px", fontSize: 12 }}>
            Faqat belgilangan tadbir turlari uchun dizayn tanlovda ko‘rinadi.
            Amaldagi taklifnomalar ishlatadigan turini olib tashlab bo‘lmaydi.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 12px" }}>
            {EVENT_TYPE_OPTIONS.map((eventType) => (
              <label
                key={eventType.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  minHeight: 44,
                  padding: "9px 12px",
                  borderRadius: 10,
                  border: "1px solid var(--line)",
                  background: supportedEventTypes.includes(eventType.id)
                    ? "var(--accent-soft)"
                    : "var(--surface)",
                  cursor: busy ? "default" : "pointer",
                  fontSize: 13,
                }}
              >
                <input
                  type="checkbox"
                  checked={supportedEventTypes.includes(eventType.id)}
                  onChange={(event) =>
                    setSupportedEventTypes((current) =>
                      event.target.checked
                        ? [...current, eventType.id]
                        : current.filter((id) => id !== eventType.id),
                    )
                  }
                  style={{
                    width: 17,
                    height: 17,
                    accentColor: "var(--primary)",
                  }}
                />
                {eventType.name}
              </label>
            ))}
          </div>
          <button
            className="button secondary"
            disabled={
              busy ||
              supportedEventTypes.length === 0 ||
              [...supportedEventTypes].sort().join("|") ===
                [...template.supportedEventTypes].sort().join("|")
            }
            style={{ marginTop: 16 }}
          >
            Tadbir mosligini saqlash
          </button>
        </fieldset>
      </form>
    </section>
  );
}
