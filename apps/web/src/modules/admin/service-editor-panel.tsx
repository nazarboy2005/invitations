"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Eye,
  Plus,
  Save,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { publicAsset } from "@/lib/public-asset";
import { ServiceDetail } from "@/modules/services/service-detail";
import {
  serviceCategoryChoices,
  serviceEditorSchema,
  serviceSlug,
  type ServiceEditor,
  type ServiceRecord,
} from "@/modules/services/service-editor-contract";
import { useAdminDirty } from "./admin-navigation-guard";
import { servicesRequest } from "./service-admin-request";
import { ServiceImportEvidence } from "./service-imports";
import { uploadServiceImage } from "./service-image-upload";
import styles from "./admin-services.module.css";

export function ServiceEditorPanel({
  initial,
  onSaved,
  onDeleted,
  onClose,
}: {
  initial: ServiceRecord;
  onSaved: (item: ServiceRecord, previousSlug: string) => void;
  onDeleted: (slug: string, cleanupPending: boolean) => void;
  onClose: () => void;
}) {
  const [record, setRecord] = useState(initial);
  const [draft, setDraft] = useState<ServiceEditor>(initial.draft);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const [reviewed, setReviewed] = useState(false),
    [preview, setPreview] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [visibility, setVisibility] = useState<ServiceRecord["status"]>(
    initial.status,
  );
  const [slugRetry, setSlugRetry] = useState(0);
  const [slugCheck, setSlugCheck] = useState<{
    slug: string;
    state: "available" | "taken" | "error";
  } | null>(null);
  const slugValid = serviceSlug.safeParse(draft.slug).success;
  const unchangedSlug = record.revision > 0 && draft.slug === record.slug;
  const slugState = !slugValid
    ? "invalid"
    : unchangedSlug
      ? "available"
      : slugCheck?.slug === draft.slug
        ? slugCheck.state
        : "checking";
  useEffect(() => {
    if (!slugValid || unchangedSlug) return;
    setSlugCheck(null);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const query = new URLSearchParams({
          slug: draft.slug,
          current: record.slug,
        });
        const response = await fetch(
          `/api/admin/services/slug-availability?${query}`,
          {
            cache: "no-store",
            signal: controller.signal,
          },
        );
        if (!response.ok) throw new Error("Availability check failed");
        const result = await response.json();
        if (!controller.signal.aborted)
          setSlugCheck({
            slug: draft.slug,
            state: result.available ? "available" : "taken",
          });
      } catch {
        if (!controller.signal.aborted)
          setSlugCheck({ slug: draft.slug, state: "error" });
      }
    }, 500);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [draft.slug, record.slug, slugValid, unchangedSlug, slugRetry]);
  const dirty =
    JSON.stringify(draft) !== JSON.stringify(record.draft) ||
    visibility !== record.status;
  const leave = useAdminDirty(dirty);
  useEffect(() => {
    if (!dirty) return;
    const unload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", unload);
    return () => window.removeEventListener("beforeunload", unload);
  }, [dirty]);
  function patch<K extends keyof ServiceEditor>(
    key: K,
    value: ServiceEditor[K],
  ) {
    setDraft((d) => ({ ...d, [key]: value }));
  }
  async function save() {
    if (slugState !== "available") return;
    setError("");
    setNotice("");
    const parsed = serviceEditorSchema.safeParse(draft);
    if (!parsed.success) {
      setError(
        parsed.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join(" "),
      );
      return;
    }
    setBusy(true);
    try {
      const { item } = await servicesRequest(
        record.revision
          ? `/api/admin/services/${record.slug}`
          : "/api/admin/services",
        {
          revision: record.revision,
          intent: visibility,
          listing: parsed.data,
          reviewed,
        },
        record.revision ? "PATCH" : "POST",
      );
      setRecord(item);
      setDraft(item.draft);
      setReviewed(false);
      setVisibility(item.status);
      onSaved(item, record.slug);
      setNotice(
        item.status === "active"
          ? "Saqlandi. Servis saytda ko‘rinadi."
          : "Saqlandi. Servis saytda yashirilgan.",
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void save();
  }
  async function deleteService() {
    setBusy(true);
    setError("");
    try {
      const result = await servicesRequest(
        `/api/admin/services/${record.slug}`,
        { revision: record.revision },
        "DELETE",
      );
      onDeleted(record.slug, result.cleanupPending === true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      setConfirmDelete(false);
    }
  }
  async function upload(files: FileList | null) {
    if (!files?.length) return;
    if (files.length + draft.images.length > 20) {
      setError("Ko‘pi bilan 20 rasm tanlang.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const image = await uploadServiceImage(file);
        setDraft((d) => ({
          ...d,
          images: [...d.images, { ...image, alt: d.name }],
        }));
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function moveImage(index: number, step: number) {
    const images = [...draft.images],
      other = index + step;
    [images[index], images[other]] = [images[other], images[index]];
    patch("images", images);
  }
  return (
    <div className={styles.root}>
      <div className={styles.editorHeading}>
        <button
          type="button"
          className={styles.back}
          disabled={busy}
          onClick={() => leave(onClose)}
        >
          <ArrowLeft size={17} /> Servislarga qaytish
        </button>
        <span className={styles.badge} data-status={record.status}>
          {record.status === "active" ? "Faol" : "Yashirin"}
          {dirty ? " · saqlanmagan" : ""}
        </span>
      </div>
      <form onSubmit={submit}>
        <div className={styles.editorTitle}>
          <div>
            <h2>{record.revision ? record.draft.name : "Yangi servis"}</h2>
            <p>
              Faol servis saytda ko‘rinadi. Yashirin servis faqat adminda
              qoladi.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPreview(true)}
            className={styles.secondary}
          >
            <Eye size={16} /> Ko‘rib chiqish
          </button>
        </div>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className={styles.success} role="status">
            {notice}
          </p>
        )}
        {record.evidence && (
          <ServiceImportEvidence evidence={record.evidence} />
        )}
        <fieldset disabled={busy} className={styles.editorFields}>
          <div className={styles.editorColumns}>
            <div className={styles.sections}>
              <section className={styles.panel}>
                <h3>Asosiy ma’lumotlar</h3>
                <div className={styles.fieldGrid}>
                  <label className={styles.wide}>
                    Servis nomi
                    <input
                      required
                      maxLength={180}
                      value={draft.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setDraft((d) => ({
                          ...d,
                          name,
                          ...(!record.revision &&
                          (!d.slug ||
                            d.slug ===
                              d.name
                                .normalize("NFKD")
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/^-|-$/g, "")
                                .slice(0, 100))
                            ? {
                                slug: name
                                  .normalize("NFKD")
                                  .toLowerCase()
                                  .replace(/[^a-z0-9]+/g, "-")
                                  .replace(/^-|-$/g, "")
                                  .slice(0, 100),
                              }
                            : {}),
                        }));
                      }}
                    />
                  </label>
                  <label className={styles.wide}>
                    Havola nomi
                    <input
                      required
                      pattern="[a-z0-9]+(-[a-z0-9]+)*"
                      maxLength={100}
                      aria-describedby="service-slug-status"
                      aria-invalid={
                        slugState === "taken" || slugState === "invalid"
                      }
                      value={draft.slug}
                      onChange={(e) => patch("slug", e.target.value)}
                    />
                    <small>/services/b/{draft.slug || "servis-nomi"}</small>
                    <small
                      id="service-slug-status"
                      role="status"
                      aria-live="polite"
                    >
                      {slugState === "available"
                        ? "Havola bo‘sh — foydalanish mumkin."
                        : slugState === "checking"
                          ? "Havola tekshirilmoqda…"
                          : slugState === "taken"
                            ? "Bu havola band. Boshqa nom tanlang."
                            : slugState === "error"
                              ? "Havolani tekshirib bo‘lmadi. Qayta tekshiring."
                              : "Faqat kichik lotin harflari, raqam va chiziqcha kiriting."}
                    </small>
                    {slugState === "error" && (
                      <button
                        type="button"
                        className={styles.secondary}
                        onClick={() => setSlugRetry((value) => value + 1)}
                      >
                        Qayta tekshirish
                      </button>
                    )}
                    {record.revision > 0 && draft.slug !== record.slug && (
                      <small>Saqlangandan so‘ng eski havola ishlamaydi.</small>
                    )}
                  </label>
                  <div className={styles.wide}>
                    <span className={styles.fieldLabel}>Kategoriyalar</span>
                    <div className={styles.categoryChecks}>
                      {serviceCategoryChoices.map((c) => (
                        <label key={c.id}>
                          <input
                            type="checkbox"
                            checked={draft.categoryIds.includes(c.id)}
                            onChange={(e) => {
                              const ids = e.target.checked
                                ? [...draft.categoryIds, c.id]
                                : draft.categoryIds.filter((id) => id !== c.id);
                              patch("categoryIds", ids);
                              patch(
                                "categoryLabel",
                                serviceCategoryChoices
                                  .filter((c) => ids.includes(c.id))
                                  .map((c) => c.name)
                                  .join(", "),
                              );
                            }}
                          />
                          {c.name}
                        </label>
                      ))}
                    </div>
                  </div>
                  <label className={styles.wide}>
                    Kategoriya tavsifi
                    <input
                      value={draft.categoryLabel}
                      maxLength={180}
                      onChange={(e) => patch("categoryLabel", e.target.value)}
                    />
                  </label>
                  <label className={styles.wide}>
                    Tavsif
                    <textarea
                      rows={7}
                      maxLength={12000}
                      value={draft.description}
                      onChange={(e) => patch("description", e.target.value)}
                      placeholder="Tashkilot haqida tekshirilgan ma’lumotlar…"
                    />
                  </label>
                </div>
              </section>
              <section className={styles.panel}>
                <h3>Manzil va joylashuv</h3>
                <div className={styles.fieldGrid}>
                  <label>
                    Viloyat / shahar
                    <input
                      value={draft.region}
                      maxLength={120}
                      onChange={(e) => patch("region", e.target.value)}
                      placeholder="Toshkent shahri"
                    />
                  </label>
                  <label>
                    Tuman
                    <input
                      value={draft.district}
                      maxLength={120}
                      onChange={(e) => patch("district", e.target.value)}
                    />
                  </label>
                  <label className={styles.wide}>
                    To‘liq manzil
                    <textarea
                      rows={2}
                      value={draft.address}
                      maxLength={600}
                      onChange={(e) => patch("address", e.target.value)}
                    />
                  </label>
                  <label>
                    Kenglik (latitude)
                    <input
                      type="number"
                      min={-90}
                      max={90}
                      step="any"
                      value={draft.latitude ?? ""}
                      onChange={(e) =>
                        patch(
                          "latitude",
                          e.target.value === "" ? null : Number(e.target.value),
                        )
                      }
                    />
                  </label>
                  <label>
                    Uzunlik (longitude)
                    <input
                      type="number"
                      min={-180}
                      max={180}
                      step="any"
                      value={draft.longitude ?? ""}
                      onChange={(e) =>
                        patch(
                          "longitude",
                          e.target.value === "" ? null : Number(e.target.value),
                        )
                      }
                    />
                  </label>
                </div>
              </section>
              <section className={styles.panel}>
                <h3>Aloqa ma’lumotlari</h3>
                <div className={styles.dynamicFields}>
                  <span className={styles.fieldLabel}>Telefonlar</span>
                  {draft.phones.map((phone, index) => (
                    <div className={styles.contactRow} key={index}>
                      <input
                        aria-label={`Telefon ${index + 1} nomi`}
                        value={phone.label}
                        placeholder="Nomi"
                        maxLength={80}
                        onChange={(e) =>
                          patch(
                            "phones",
                            draft.phones.map((p, i) =>
                              i === index ? { ...p, label: e.target.value } : p,
                            ),
                          )
                        }
                      />
                      <input
                        type="tel"
                        aria-label={`Telefon ${index + 1}`}
                        value={phone.value}
                        placeholder="+998…"
                        maxLength={50}
                        onChange={(e) =>
                          patch(
                            "phones",
                            draft.phones.map((p, i) =>
                              i === index ? { ...p, value: e.target.value } : p,
                            ),
                          )
                        }
                      />
                      <button
                        type="button"
                        aria-label={`Telefon ${index + 1} ni olib tashlash`}
                        onClick={() =>
                          patch(
                            "phones",
                            draft.phones.filter((_, i) => i !== index),
                          )
                        }
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={styles.add}
                    disabled={draft.phones.length >= 10}
                    onClick={() =>
                      patch("phones", [
                        ...draft.phones,
                        { label: "Telefon", value: "" },
                      ])
                    }
                  >
                    <Plus size={15} /> Telefon qo‘shish
                  </button>
                  <label>
                    Email
                    <input
                      type="email"
                      value={draft.email ?? ""}
                      maxLength={254}
                      onChange={(e) => patch("email", e.target.value || null)}
                    />
                  </label>
                  <span className={styles.fieldLabel}>
                    Sayt va ijtimoiy tarmoqlar
                  </span>
                  {draft.links.map((link, index) => (
                    <div className={styles.contactRow} key={index}>
                      <input
                        aria-label={`Havola ${index + 1} nomi`}
                        value={link.label}
                        placeholder="Instagram"
                        maxLength={80}
                        onChange={(e) =>
                          patch(
                            "links",
                            draft.links.map((p, i) =>
                              i === index ? { ...p, label: e.target.value } : p,
                            ),
                          )
                        }
                      />
                      <input
                        type="url"
                        aria-label={`Havola ${index + 1}`}
                        value={link.url}
                        placeholder="https://…"
                        maxLength={2000}
                        onChange={(e) =>
                          patch(
                            "links",
                            draft.links.map((p, i) =>
                              i === index ? { ...p, url: e.target.value } : p,
                            ),
                          )
                        }
                      />
                      <button
                        type="button"
                        aria-label={`Havola ${index + 1} ni olib tashlash`}
                        onClick={() =>
                          patch(
                            "links",
                            draft.links.filter((_, i) => i !== index),
                          )
                        }
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={styles.add}
                    disabled={draft.links.length >= 15}
                    onClick={() =>
                      patch("links", [...draft.links, { label: "", url: "" }])
                    }
                  >
                    <Plus size={15} /> Havola qo‘shish
                  </button>
                </div>
              </section>
              <section className={styles.panel}>
                <div className={styles.sectionHeading}>
                  <div>
                    <h3>Rasmlar</h3>
                    <p>
                      Birinchi rasm muqova bo‘ladi. {draft.images.length} / 20
                    </p>
                  </div>
                  <label className={styles.upload}>
                    <Upload size={16} /> Rasm yuklash
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      multiple
                      onChange={(e) => {
                        void upload(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
                <div className={styles.gallery}>
                  {draft.images.map((image, index) => (
                    <div className={styles.galleryItem} key={image.src + index}>
                      <div className={styles.galleryPhoto}>
                        <img
                          src={publicAsset(image.src)}
                          alt={image.alt || draft.name}
                          width={image.width}
                          height={image.height}
                        />
                        {index === 0 && <span>Muqova</span>}
                      </div>
                      <input
                        aria-label={`Rasm ${index + 1} tavsifi`}
                        value={image.alt}
                        maxLength={300}
                        placeholder="Rasm tavsifi"
                        onChange={(e) =>
                          patch(
                            "images",
                            draft.images.map((p, i) =>
                              i === index ? { ...p, alt: e.target.value } : p,
                            ),
                          )
                        }
                      />
                      <div className={styles.imageActions}>
                        <button
                          type="button"
                          aria-label={`Rasm ${index + 1} oldinga`}
                          disabled={index === 0}
                          onClick={() => moveImage(index, -1)}
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Rasm ${index + 1} orqaga`}
                          disabled={index === draft.images.length - 1}
                          onClick={() => moveImage(index, 1)}
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Rasm ${index + 1} ni olib tashlash`}
                          onClick={() =>
                            patch(
                              "images",
                              draft.images.filter((_, i) => i !== index),
                            )
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {!draft.images.length && (
                  <p className={styles.hint}>
                    Nashr qilish uchun kamida bitta rasm yuklang.
                  </p>
                )}
              </section>
            </div>
            <aside className={styles.sections}>
              <section className={styles.panel}>
                <h3>
                  <Star size={17} /> Katalogdagi joylashuv
                </h3>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={draft.featured}
                    onChange={(e) => patch("featured", e.target.checked)}
                  />{" "}
                  Hamkor sifatida ajratish
                </label>
                <p className={styles.hint}>
                  Faqat hamkorlik kelishuvi bor servisni belgilang. Hamkorlar
                  birinchi chiqadi va “Hamkor” belgisi ko‘rinadi.
                </p>
                {draft.featured && (
                  <label>
                    Hamkorlar orasidagi ustuvorlik
                    <input
                      type="number"
                      min={0}
                      max={100000}
                      value={draft.featuredOrder ?? 0}
                      onChange={(e) =>
                        patch("featuredOrder", Number(e.target.value))
                      }
                    />
                    <small>
                      Kichik son oldin chiqadi. Teng bo‘lsa katalog tartibi
                      saqlanadi.
                    </small>
                  </label>
                )}
                <p className={styles.hint}>
                  Oddiy yangi servis o‘z kategoriyasi oxiriga qo‘shiladi.
                </p>
              </section>
              <section className={styles.panel}>
                <h3>Narx</h3>
                <div className={styles.dynamicFields}>
                  <label>
                    Narx turi
                    <select
                      value={draft.price.kind}
                      onChange={(e) =>
                        patch("price", {
                          ...draft.price,
                          kind: e.target
                            .value as ServiceEditor["price"]["kind"],
                        })
                      }
                    >
                      <option value="negotiable">Kelishuv asosida</option>
                      <option value="fixed">Aniq narx</option>
                      <option value="from">Boshlang‘ich narx</option>
                      <option value="range">Narx oralig‘i</option>
                    </select>
                  </label>
                  {draft.price.kind !== "negotiable" && (
                    <>
                      <label>
                        {draft.price.kind === "range"
                          ? "Eng past narx"
                          : "Narx"}
                        <input
                          type="number"
                          min={1}
                          max={1e12}
                          step="any"
                          value={draft.price.min ?? ""}
                          onChange={(e) =>
                            patch("price", {
                              ...draft.price,
                              min:
                                e.target.value === ""
                                  ? null
                                  : Number(e.target.value),
                            })
                          }
                        />
                      </label>
                      {draft.price.kind === "range" && (
                        <label>
                          Eng yuqori narx
                          <input
                            type="number"
                            min={1}
                            max={1e12}
                            step="any"
                            value={draft.price.max ?? ""}
                            onChange={(e) =>
                              patch("price", {
                                ...draft.price,
                                max:
                                  e.target.value === ""
                                    ? null
                                    : Number(e.target.value),
                              })
                            }
                          />
                        </label>
                      )}
                      <label>
                        Valyuta
                        <select
                          value={draft.price.currency}
                          onChange={(e) =>
                            patch("price", {
                              ...draft.price,
                              currency: e.target.value as "UZS" | "USD",
                            })
                          }
                        >
                          <option value="UZS">UZS — so‘m</option>
                          <option value="USD">USD — dollardan hisoblash</option>
                        </select>
                      </label>
                      <label className={styles.checkbox}>
                        <input
                          type="checkbox"
                          checked={draft.price.unit === "person"}
                          onChange={(e) => {
                            const { unit: _, ...price } = draft.price;
                            patch(
                              "price",
                              e.target.checked
                                ? { ...price, unit: "person" }
                                : price,
                            );
                          }}
                        />{" "}
                        Bir kishi uchun
                      </label>
                    </>
                  )}
                  <label>
                    Narx manbasi / shartlari
                    <textarea
                      rows={3}
                      value={draft.price.sourceText}
                      maxLength={2000}
                      onChange={(e) =>
                        patch("price", {
                          ...draft.price,
                          sourceText: e.target.value,
                        })
                      }
                    />
                  </label>
                  <p className={styles.hint}>
                    Saytda UZS va yaxlitlangan qiymat ko‘rinadi. Taomlar
                    menyusidan to‘y narxini hisoblamang.
                  </p>
                </div>
              </section>
              <section className={styles.panel}>
                <h3>Ko‘rinish</h3>
                <label>
                  Holat
                  <select
                    aria-label="Servis holati"
                    value={visibility}
                    onChange={(e) =>
                      setVisibility(e.target.value as ServiceRecord["status"])
                    }
                  >
                    <option value="active">Faol</option>
                    <option value="hidden">Yashirin</option>
                  </select>
                </label>
                {record.revision > 0 && (
                  <>
                    <p className={styles.hint}>
                      Yangilangan:{" "}
                      {new Date(record.updatedAt).toLocaleString("uz-UZ")}
                    </p>
                    <button
                      type="button"
                      className={styles.danger}
                      onClick={() => setConfirmDelete(true)}
                    >
                      <Trash2 size={16} /> Servisni o‘chirish
                    </button>
                  </>
                )}
              </section>
            </aside>
          </div>
          <div className={styles.savebar}>
            <div>
              {record.reviewRequired && (
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={reviewed}
                    onChange={(e) => setReviewed(e.target.checked)}
                  />{" "}
                  Manbalar, kontaktlar, narx va rasmlarni tekshirdim
                </label>
              )}
              {busy && <span role="status">Saqlanmoqda…</span>}
            </div>
            <div>
              <button
                type="submit"
                className={styles.primary}
                disabled={
                  slugState !== "available" ||
                  (visibility === "active" &&
                    record.reviewRequired &&
                    !reviewed)
                }
              >
                <Save size={16} /> Saqlash
              </button>
            </div>
          </div>
        </fieldset>
      </form>
      {preview && (
        <ServicePreview listing={draft} onClose={() => setPreview(false)} />
      )}
      {confirmDelete && (
        <ConfirmationDialog
          title="Servisni butunlay o‘chirish"
          description={`“${record.draft.name}” va uning ma’lumotlari butunlay o‘chiriladi. Bu amalni qaytarib bo‘lmaydi.`}
          confirmLabel="Butunlay o‘chirish"
          busy={busy}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => void deleteService()}
        />
      )}
    </div>
  );
}
function ServicePreview({
  listing,
  onClose,
}: {
  listing: ServiceEditor;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = dialog.current!;
    el.showModal();
    return () => el.close();
  }, []);
  return (
    <dialog
      className={styles.preview}
      ref={dialog}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      aria-label="Servis ko‘rinishi"
    >
      <div className={styles.previewBar}>
        <span>Servis ko‘rinishi</span>
        <button
          autoFocus
          onClick={onClose}
          aria-label="Ko‘rib chiqishni yopish"
        >
          <X size={20} />
        </button>
      </div>
      <ServiceDetail listing={listing} />
    </dialog>
  );
}
