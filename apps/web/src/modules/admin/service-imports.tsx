"use client";
import { useEffect, useState, type FormEvent } from "react";
import { ExternalLink, RefreshCw, Upload } from "lucide-react";
import { serviceCategoryChoices } from "@/modules/services/service-editor-contract";
import { serviceExternalUrl } from "@/modules/services/services-utils";
import { servicesRequest } from "./service-admin-request";
import styles from "./admin-services.module.css";

type Job = {
  id: string;
  input: { query: string; urls: string[]; city: string };
  status: string;
  service_slug: string | null;
  error: string | null;
  created_at: string;
  result: { photos?: number; duplicates?: number } | null;
};
const labels: Record<string, string> = {
  queued: "Navbatda",
  running: "Yig‘ilmoqda",
  review: "Tekshirishga tayyor",
  failed: "Xatolik",
  cancelled: "Bekor qilingan",
};
export function ServiceImports({ onOpen }: { onOpen: (slug: string) => void }) {
  const [jobs, setJobs] = useState<Job[]>([]),
    [online, setOnline] = useState<boolean | null>(null);
  const [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  const [url, setUrl] = useState(""),
    [otherUrl, setOtherUrl] = useState(""),
    [query, setQuery] = useState(""),
    [city, setCity] = useState("Tashkent"),
    [region, setRegion] = useState("Toshkent shahri"),
    [categoryId, setCategoryId] = useState("restaurant"),
    [imageSource, setImageSource] = useState("single");
  async function load() {
    const data = await servicesRequest("/api/admin/services/imports");
    setJobs(data.jobs);
    setOnline(data.workerOnline);
  }
  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const data = await servicesRequest("/api/admin/services/imports");
        if (active) {
          setJobs(data.jobs);
          setOnline(data.workerOnline);
        }
      } catch (e) {
        if (active) setError((e as Error).message);
      }
    };
    void refresh();
    const timer = setInterval(() => void refresh(), 5000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await servicesRequest("/api/admin/services/imports", {
        urls: [url.trim(), otherUrl.trim()].filter(Boolean),
        query: query.trim(),
        city,
        region,
        categoryId,
        imageSource,
      });
      setNotice(
        "Import navbatga qo‘shildi. Tayyor bo‘lgach qoralamani ochib tekshiring.",
      );
      setUrl("");
      setOtherUrl("");
      setQuery("");
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function action(id: string, action: "retry" | "cancel") {
    setBusy(true);
    setError("");
    try {
      await servicesRequest(
        `/api/admin/services/imports/${id}`,
        { action },
        "PATCH",
      );
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={styles.sections}>
      <section className={styles.panel}>
        <div className={styles.sectionHeading}>
          <div>
            <h2>Maps’dan servis qo‘shish</h2>
            <p>
              Google va Yandex ma’lumotlari birlashtiriladi. Natija tekshirish
              uchun qoralama bo‘lib saqlanadi.
            </p>
          </div>
          <span
            className={styles.badge}
            data-status={online ? "published" : "draft"}
          >
            {online === null
              ? "Tekshirilmoqda…"
              : online
                ? "Import xizmati faol"
                : "Import xizmati ulanmagan"}
          </span>
        </div>
        {online === false && (
          <p className={styles.warning}>
            Import navbatda saqlanadi. Yig‘ishni boshlash uchun serverdagi
            Services import worker ishga tushirilishi kerak.
          </p>
        )}
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
        <form onSubmit={submit}>
          <fieldset disabled={busy} className={styles.editorFields}>
            <div className={styles.fieldGrid}>
              <label>
                Google yoki Yandex biznes havolasi
                <input
                  type="url"
                  placeholder="https://yandex.uz/maps/org/…"
                  maxLength={2000}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </label>
              <label>
                Ikkinchi manba havolasi (ixtiyoriy)
                <input
                  type="url"
                  placeholder="https://www.google.com/maps/place/…"
                  maxLength={2000}
                  value={otherUrl}
                  onChange={(e) => setOtherUrl(e.target.value)}
                />
              </label>
              <label>
                Tashkilot nomi (havola bo‘lmasa)
                <input
                  placeholder="Aniq to‘yxona nomi"
                  value={query}
                  maxLength={180}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <small>
                  Umumiy qidiruv o‘rniga bitta tashkilotning aniq nomini
                  kiriting.
                </small>
              </label>
              <label>
                Qidiruv shahri
                <input
                  required
                  value={city}
                  maxLength={120}
                  onChange={(e) => setCity(e.target.value)}
                />
              </label>
              <label>
                Kategoriya
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {serviceCategoryChoices.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Katalogdagi viloyat / shahar
                <input
                  value={region}
                  maxLength={120}
                  onChange={(e) => setRegion(e.target.value)}
                />
              </label>
              <label>
                Rasm manbasi
                <select
                  value={imageSource}
                  onChange={(e) => setImageSource(e.target.value)}
                >
                  <option value="single">
                    Bitta manbadan — tavsiya qilinadi
                  </option>
                  <option value="mixed">Ikki manbadan</option>
                </select>
              </label>
              <div className={styles.formAction}>
                <button
                  className={styles.primary}
                  disabled={
                    !url.trim() && !otherUrl.trim() && query.trim().length < 2
                  }
                >
                  <Upload size={16} />{" "}
                  {busy ? "Yuborilmoqda…" : "Ma’lumotlarni yig‘ish"}
                </button>
              </div>
            </div>
          </fieldset>
        </form>
        <p className={styles.hint}>
          Mavjud bo‘lmagan tavsif, email yoki narx o‘ylab topilmaydi. Noaniq
          filiallar birlashtirilmaydi. Rasmlar va kontaktlarni nashrdan oldin
          tekshiring.
        </p>
      </section>
      <section className={styles.panel}>
        <div className={styles.sectionHeading}>
          <h3>So‘nggi importlar</h3>
          <button
            className={styles.secondary}
            type="button"
            onClick={() => void load().catch((e) => setError(e.message))}
          >
            <RefreshCw size={15} /> Yangilash
          </button>
        </div>
        {!jobs.length ? (
          <p className={styles.hint}>Hali import boshlanmagan.</p>
        ) : (
          <div className={styles.jobs}>
            {jobs.map((job) => (
              <article key={job.id}>
                <div>
                  <strong>{job.input.query || job.input.urls[0]}</strong>
                  <small>
                    {job.input.city} ·{" "}
                    {new Date(job.created_at).toLocaleString("uz-UZ")}
                  </small>
                  {job.result && (
                    <small>
                      {job.result.photos ?? 0} rasm
                      {job.result.duplicates
                        ? ` · ${job.result.duplicates} mumkin bo‘lgan dublikat`
                        : ""}
                    </small>
                  )}
                  {job.error && <p className={styles.error}>{job.error}</p>}
                </div>
                <span className={styles.badge} data-status={job.status}>
                  {labels[job.status] ?? job.status}
                </span>
                <div className={styles.rowActions}>
                  {job.service_slug && (
                    <button
                      type="button"
                      className={styles.secondary}
                      onClick={() => onOpen(job.service_slug!)}
                    >
                      Qoralamani ochish
                    </button>
                  )}
                  {["failed", "cancelled"].includes(job.status) && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void action(job.id, "retry")}
                    >
                      Qayta urinish
                    </button>
                  )}
                  {["queued", "running"].includes(job.status) && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void action(job.id, "cancel")}
                    >
                      Bekor qilish
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function ServiceImportEvidence({
  evidence,
}: {
  evidence: Record<string, unknown>;
}) {
  const sources = (evidence.sources ?? []) as Array<{
    provider: string;
    url: string;
    name?: string;
  }>;
  const duplicates = (evidence.duplicates ?? []) as Array<{
    slug: string;
    name: string;
  }>;
  const missing = evidence.missing as string[] | undefined;
  const conflicts = (evidence.conflicts ?? []) as unknown[];
  const matches = (evidence.matches ?? []) as Array<{
    accepted?: boolean;
    status?: string;
  }>;
  const uncertain = matches.filter(
    (m) => !m.accepted && m.status !== "rejected",
  ).length;
  const failures =
    ((evidence.errors ?? []) as unknown[]).length +
    ((evidence.mediaErrors ?? []) as unknown[]).length;
  const products = (evidence.products ?? []) as Array<{
    name: string;
    amount: number | null;
    currency: string;
    unit?: string;
    category?: string;
    excludedFromPriceRange?: boolean;
  }>;
  const ranges = (evidence.priceRanges ?? []) as Array<{
    category?: string;
    currency: string;
    unit?: string;
    min: number;
    max: number;
  }>;
  const missingLabels: Record<string, string> = {
    description: "Tavsif",
    phones: "Telefon",
    links: "Havolalar",
    emails: "Email",
    images: "Rasmlar",
    products: "Mahsulotlar / narxlar",
  };
  return (
    <section className={styles.evidence}>
      <h3>Importni tekshirish</h3>
      <p>
        Bu ma’lumotlar faqat admin uchun. Nashr qilishdan oldin tashkilot,
        kontaktlar va har bir rasmni tekshiring.
      </p>
      <div className={styles.sources}>
        {sources.map((s, i) => {
          const url = serviceExternalUrl(s.url);
          return url ? (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer">
              {s.provider} · {s.name}
              <ExternalLink size={13} />
            </a>
          ) : null;
        })}
      </div>
      {!!missing?.length && (
        <p className={styles.hint}>
          Topilmagan: {missing.map((f) => missingLabels[f] || f).join(", ")}.
        </p>
      )}
      {(conflicts.length > 0 || uncertain > 0 || failures > 0) && (
        <p className={styles.warning}>
          Tekshirish kerak: {conflicts.length} maydon farqi, {uncertain} noaniq
          moslik, {failures} manba yoki rasm xatosi. Pastdagi manbalar tarixini
          ochib solishtiring.
        </p>
      )}
      {!!duplicates.length && (
        <p className={styles.warning}>
          Mumkin bo‘lgan dublikatlar:{" "}
          {duplicates.map((d) => `${d.name} (/${d.slug})`).join(", ")}. Mavjud
          servisni tekshiring; bu qoralamani kerak bo‘lmasa arxivlang.
        </p>
      )}
      {!!ranges.length && (
        <details>
          <summary>Kuzatilgan narx oraliqlari ({ranges.length})</summary>
          <p className={styles.hint}>
            Faqat topilgan mahsulotlar. Taom narxi, zal ijarasi va bir kishilik
            banket paketini bir-biriga aralashtirmang. Kerakli narxni “Narx”
            bo‘limida tasdiqlang.
          </p>
          {ranges.map((r, i) => (
            <p key={i}>
              {r.category || "Kategoriya ko‘rsatilmagan"} ·{" "}
              {r.min.toLocaleString("en-US")} – {r.max.toLocaleString("en-US")}{" "}
              {r.currency} {r.unit ? `/ ${r.unit}` : ""}
            </p>
          ))}
        </details>
      )}
      {!!products.length && (
        <details>
          <summary>Mahsulotlar va xizmat narxlari ({products.length})</summary>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Mahsulot / xizmat</th>
                  <th>Narx</th>
                  <th>Kategoriya / birlik</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={i}>
                    <td>
                      {p.name}
                      {p.excludedFromPriceRange && (
                        <small>Oraliqdan chiqarilgan — shubhali qiymat</small>
                      )}
                    </td>
                    <td>
                      {p.amount ?? "—"} {p.currency}
                    </td>
                    <td>
                      {p.category} {p.unit ? `/ ${p.unit}` : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
      <details>
        <summary>Manbalar farqi, mosliklar va maydonlar tarixi</summary>
        <pre>
          {JSON.stringify(
            {
              conflicts: evidence.conflicts,
              matches: evidence.matches,
              candidates: evidence.candidates,
              provenance: evidence.provenance,
              errors: evidence.errors,
              mediaErrors: evidence.mediaErrors,
              imageSelection: evidence.imageSelection,
              imageProvenance: evidence.imageProvenance,
            },
            null,
            2,
          )}
        </pre>
      </details>
    </section>
  );
}
