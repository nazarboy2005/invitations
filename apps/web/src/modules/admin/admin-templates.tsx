"use client";

import { useEffect, useState, type CSSProperties } from "react";
import {
  EVENT_TYPE_OPTIONS,
  formatPrice,
  type TemplateCategory,
  type TemplateDefinition,
} from "@taklifnoma/contracts";
import Link from "next/link";
import { SoftSelect } from "@/components/soft-select";

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

export function AdminTemplates() {
  const [templates, setTemplates] = useState<TemplateDefinition[]>([]);
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [configured, setConfigured] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

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
  useEffect(() => {
    let alive = true;
    void load()
      .catch((cause) => {
        if (alive)
          setError(
            cause instanceof Error ? cause.message : "Sahifani ochib bo‘lmadi.",
          );
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

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

  return (
    <main id="main" className="container" style={{ paddingBlock: 40 }}>
      <p className="muted">Sayt administratori</p>
      <h1 className="page-heading">Dizaynlarni boshqarish</h1>
      <p className="muted" style={{ lineHeight: 1.8, maxWidth: 760 }}>
        Dizayn narxi, ko‘rinishi va kategoriyalarini boshqaring. Bitta dizaynni
        bir nechta kategoriyada ko‘rsatish mumkin. Bu taklifnoma ma’lumotlarini
        o‘zgartirmaydi.
      </p>
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

      {!loading && categories.length > 0 && (
        <section
          className="inline-note"
          style={{ marginBlock: 28, padding: 24 }}
          aria-labelledby="categories-title"
        >
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

      {!loading && (configured || categories.length > 0) && (
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
                maxLength={120}
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
                disabled={unavailable}
                style={inputStyle}
                placeholder="Masalan: Fotiha"
              />
            </label>
            <label style={{ ...labelStyle, flex: "1 1 240px" }}>
              Qisqa belgi
              <input
                required
                pattern="[a-z][a-z0-9]*(?:-[a-z0-9]+)*"
                maxLength={64}
                value={newCategoryId}
                onChange={(event) => setNewCategoryId(event.target.value)}
                disabled={unavailable}
                style={inputStyle}
                placeholder="Masalan: fotiha"
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

      <div style={{ display: "grid", gap: 24, marginBlock: 30 }}>
        {templates.map((template) => (
          <TemplateRow
            key={template.id}
            template={template}
            templates={templates}
            categories={categories}
            busy={unavailable}
            onUpdate={(id, body) =>
              mutate(
                `/api/admin/templates/${encodeURIComponent(id)}`,
                "PATCH",
                body,
                "Dizayn o‘zgarishlari saqlandi.",
              )
            }
          />
        ))}
      </div>
      {!loading && templates.length === 0 && !error && (
        <p className="inline-note">Hozircha dizaynlar yo‘q.</p>
      )}
    </main>
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
}: {
  template: TemplateDefinition;
  templates: TemplateDefinition[];
  categories: TemplateCategory[];
  busy: boolean;
  onUpdate: (id: string, body: Record<string, unknown>) => Promise<boolean>;
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
              min="0"
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
            minWidth: 230,
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
              if (
                template.published &&
                !window.confirm(
                  "Dizaynni yashirish va unga tegishli taklifnomalarni tanlangan dizaynga o‘tkazishni tasdiqlaysizmi?",
                )
              )
                return;
              void onUpdate(template.id, {
                published: !template.published,
                ...(replacement ? { replacementTemplateId: replacement } : {}),
              });
            }}
          >
            {template.published ? "Yashirish va almashtirish" : "Nashr qilish"}
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
