"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  CalendarDays,
  CheckCircle2,
  PencilLine,
  RefreshCw,
  ShieldCheck,
  X,
} from "lucide-react";
import { LANGUAGE_NAMES, type Invitation } from "@taklifnoma/contracts";
import {
  identityValues,
  type ChangeInput,
  type ChangeRequestView,
} from "@taklifnoma/contracts/changes";
import { secondaryCeremony } from "@taklifnoma/contracts/policies";
import { templateCapabilities } from "@taklifnoma/contracts/capabilities";
import styles from "./invitation-corrections.module.css";

export const requestTypeLabel = (type: string) =>
  type === "identity"
    ? "Ism va asosiy ma’lumotlar tuzatishi"
    : "Tadbir sanasini ko‘chirish";
const statusLabel: Record<string, string> = {
  pending: "Ko‘rib chiqilmoqda",
  approved: "Tasdiqlangan",
  rejected: "Rad etilgan",
};
function flatten(value: unknown, prefix = ""): Record<string, string> {
  if (Array.isArray(value)) return { [prefix]: value.join(" · ") || "—" };
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).flatMap(([key, v]) =>
        Object.entries(flatten(v, prefix ? `${prefix}.${key}` : key)),
      ),
    );
  return {
    [prefix]:
      value === null || value === undefined || value === ""
        ? "—"
        : String(value),
  };
}
function fieldName(key: string) {
  const names: Record<string, string> = {
    people: "Ismlar",
    hosts: "Oila / mezbon",
    celebrantAge: "Yosh",
    anniversaryYears: "Yubiley yili",
    startsAt: "Sana va vaqt",
    secondaryDate: "Ikkinchi marosim sanasi",
    brideFamily: "Kelin oilasi",
    groomFamily: "Kuyov oilasi",
    coInviters: "Birga taklif etuvchilar",
  };
  return key
    .split(".")
    .filter((k) => !["locales", "familyLines"].includes(k))
    .map(
      (k) => LANGUAGE_NAMES[k as keyof typeof LANGUAGE_NAMES] ?? names[k] ?? k,
    )
    .join(" · ");
}
export function RequestValues({ item }: { item: ChangeRequestView }) {
  const before = item.before as Record<string, unknown>;
  const old = flatten(
    item.type === "postponement"
      ? {
          startsAt: before.startsAt,
          secondaryDate: (before.secondary as { date?: string })?.date,
        }
      : before,
  );
  const next = flatten(item.values);
  return (
    <div className={styles.values}>
      {Object.entries(next)
        .filter(([key, value]) => old[key] !== value)
        .map(([key, value]) => (
          <div key={key}>
            <strong>{fieldName(key)}</strong>
            <span>
              <del>
                {key === "startsAt"
                  ? (old[key]?.replace("T", " · ") ?? "—")
                  : (old[key] ?? "—")}
              </del>
              <span aria-hidden="true"> → </span>
              <ins>
                {key === "startsAt" ? value.replace("T", " · ") : value}
              </ins>
            </span>
          </div>
        ))}
    </div>
  );
}
export function InvitationCorrections({
  invitationId,
  onRefresh,
}: {
  invitationId: string;
  onRefresh: () => void;
}) {
  const [items, setItems] = useState<ChangeRequestView[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ChangeInput["type"]>("identity");
  const [canonical, setCanonical] = useState<Invitation | null>(null);
  const [identity, setIdentity] = useState<ReturnType<
    typeof identityValues
  > | null>(null);
  const [startsAt, setStartsAt] = useState("");
  const [secondaryDate, setSecondaryDate] = useState("");
  const [reason, setReason] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (open && element && !element.open) element.showModal();
    else if (!open && element?.open) element.close();
  }, [open]);
  async function refresh() {
    const response = await fetch(`/api/invitations/${invitationId}/changes`, {
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.error?.message || "So‘rovlar yuklanmadi.");
    setItems(data.requests);
  }
  useEffect(() => {
    let active = true;
    fetch(`/api/invitations/${invitationId}/changes`, { cache: "no-store" })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok)
          throw new Error(data.error?.message || "So‘rovlar yuklanmadi.");
        if (active) setItems(data.requests);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [invitationId]);
  async function start() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/invitations/${invitationId}`, {
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error?.message || "Taklifnoma yuklanmadi.");
      setCanonical(data.invitation);
      setIdentity(identityValues(data.invitation));
      setStartsAt(data.invitation.startsAt);
      setSecondaryDate(secondaryCeremony(data.invitation).date);
      setReason("");
      setOpen(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Qayta urinib ko‘ring.");
    } finally {
      setBusy(false);
    }
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!identity) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/invitations/${invitationId}/changes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          values:
            type === "identity"
              ? identity
              : {
                  startsAt,
                  ...(canonical && secondaryCeremony(canonical).enabled
                    ? { secondaryDate }
                    : {}),
                },
          reason,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error?.message || "So‘rov yuborilmadi.");
      setOpen(false);
      setMessage(
        "So‘rov yuborildi. Administrator ko‘rib chiqquncha amaldagi ma’lumotlar saqlanadi.",
      );
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Qayta urinib ko‘ring.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className={styles.toolbarRequest} aria-label="Tuzatish so‘rovlari">
      <button
        type="button"
        className={styles.toolbarButton}
        aria-label="Tuzatish so‘rovi"
        disabled={busy}
        onClick={() => void start()}
      >
        <PencilLine size={15} aria-hidden="true" /> So‘rov
      </button>
      {!open && error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      {!open && message && (
        <p role="status" className={styles.success}>
          <CheckCircle2 size={16} />
          {message}
        </p>
      )}
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby="correction-dialog-title"
        onClose={() => setOpen(false)}
      >
        <div className={styles.dialogHead}>
          <div className={styles.dialogIcon}>
            <PencilLine size={19} aria-hidden="true" />
          </div>
          <div>
            <span className={styles.eyebrow}>TAKLIFNOMA TAHRIRI</span>
            <h2 id="correction-dialog-title">Tuzatish so‘rovi</h2>
            <p>Ma’lumotlarni tekshirib, kerakli o‘zgarishni yuboring.</p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Yopish"
            onClick={() => setOpen(false)}
          >
            <X size={19} />
          </button>
        </div>
        <div className={styles.dialogBody}>
          <div className={styles.notice}>
            <ShieldCheck size={17} />
            <span>
              Ismlar va tadbir sanasi administrator ko‘rib chiqqanidan keyin
              yangilanadi.
            </span>
          </div>
          {open && error && <p role="alert" className={styles.dialogError}>{error}</p>}
          <form onSubmit={submit} className={styles.form}>
          <p>
            Ism xatosi yoki sana ko‘chishi uchun so‘rov yuboring. Yangi tadbir
            yoki boshqa odamlar uchun yangi taklifnoma kerak.
          </p>
          <label>
            So‘rov turi
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ChangeInput["type"])}
              disabled={busy}
            >
              <option value="identity">Ism / asosiy ma’lumot xatosi</option>
              <option value="postponement">Tadbir sanasini ko‘chirish</option>
            </select>
          </label>
          {type === "identity" && identity && (
            <>
              {Object.entries(identity.locales).map(
                ([locale, content]) =>
                  content && (
                    <fieldset key={locale} disabled={busy}>
                      <legend>
                        {LANGUAGE_NAMES[locale as keyof typeof LANGUAGE_NAMES]}
                      </legend>
                      {content.people.map((person, index) => (
                        <label key={index}>
                          {index + 1}-ism
                          <input
                            value={person}
                            required
                            maxLength={300}
                            onChange={(e) =>
                              setIdentity({
                                ...identity,
                                locales: {
                                  ...identity.locales,
                                  [locale]: {
                                    ...content,
                                    people: content.people.map((v, i) =>
                                      i === index ? e.target.value : v,
                                    ),
                                  },
                                },
                              })
                            }
                          />
                        </label>
                      ))}
                      {(!canonical ||
                        !templateCapabilities(canonical.templateId)
                          .imageFields ||
                        templateCapabilities(
                          canonical.templateId,
                        ).imageFields?.includes("hosts")) && (
                        <label>
                          Oila / mezbon
                          <input
                            value={content.hosts}
                            maxLength={300}
                            onChange={(e) =>
                              setIdentity({
                                ...identity,
                                locales: {
                                  ...identity.locales,
                                  [locale]: {
                                    ...content,
                                    hosts: e.target.value,
                                  },
                                },
                              })
                            }
                          />
                        </label>
                      )}
                    </fieldset>
                  ),
              )}
              {canonical && templateCapabilities(canonical.templateId).age && (
                <label>
                  To‘g‘ri yosh
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={identity.celebrantAge ?? ""}
                    onChange={(e) =>
                      setIdentity({
                        ...identity,
                        celebrantAge: e.target.value
                          ? Number(e.target.value)
                          : null,
                      })
                    }
                  />
                </label>
              )}
              {canonical?.templateId === "taklifla-yubiley-sahifasi" && (
                <label>
                  Yubiley yili
                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={identity.anniversaryYears ?? ""}
                    onChange={(e) =>
                      setIdentity({
                        ...identity,
                        anniversaryYears: e.target.value
                          ? Number(e.target.value)
                          : null,
                      })
                    }
                  />
                </label>
              )}
              {Object.entries(identity.familyLines).map(([key, lines]) =>
                Object.entries(lines ?? {}).map(([locale, value]) => (
                  <label key={`${key}.${locale}`}>
                    {fieldName(`familyLines.${key}.${locale}`)}
                    <input
                      maxLength={300}
                      value={value ?? ""}
                      onChange={(e) =>
                        setIdentity({
                          ...identity,
                          familyLines: {
                            ...identity.familyLines,
                            [key]: { ...lines, [locale]: e.target.value },
                          },
                        })
                      }
                    />
                  </label>
                )),
              )}
              {identity.coInviters !== undefined && (
                <label>
                  Birga taklif etuvchilar
                  <textarea
                    maxLength={1000}
                    value={identity.coInviters}
                    onChange={(e) =>
                      setIdentity({ ...identity, coInviters: e.target.value })
                    }
                  />
                </label>
              )}
            </>
          )}
          {type === "postponement" && (
            <>
              <label>
                Taklif etilayotgan sana va vaqt
                <input
                  type="datetime-local"
                  value={startsAt}
                  required
                  onChange={(e) => setStartsAt(e.target.value)}
                />
              </label>
              {canonical && secondaryCeremony(canonical).enabled && (
                <label>
                  Ikkinchi marosim sanasi
                  <input
                    type="date"
                    value={secondaryDate}
                    required
                    onChange={(e) => setSecondaryDate(e.target.value)}
                  />
                </label>
              )}
              <p>
                Vaqt mintaqasi: {canonical?.timezone}. Tasdiqlansa, tahrirlash
                muddati oxirgi marosim kuni tugaguncha belgilanadi. Havola va
                mehmonlar javoblari saqlanadi.
              </p>
            </>
          )}
          <label>
            Sababi
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              minLength={5}
              maxLength={1000}
              rows={3}
              placeholder="Nimani va nima uchun tuzatish kerak?"
            />
          </label>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.outline}
              disabled={busy}
              onClick={() => setOpen(false)}
            >
              Bekor qilish
            </button>
            <button
              className={styles.primary}
              disabled={
                busy ||
                items.some(
                  (item) => item.status === "pending" && item.type === type,
                )
              }
            >
              {busy ? "Yuborilmoqda…" : "So‘rov yuborish"}
            </button>
          </div>
          {items.some(
            (item) => item.status === "pending" && item.type === type,
          ) && <p>Shu turdagi so‘rovingiz ko‘rib chiqilmoqda.</p>}
          </form>
          {items.length > 0 && (
            <details className={styles.history}>
              <summary>So‘rovlar tarixi · {items.length}</summary>
              <button
                type="button"
                className={styles.refreshButton}
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  setError("");
                  try {
                    await refresh();
                  } catch (e) {
                    setError(e instanceof Error ? e.message : "Yuklanmadi.");
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <RefreshCw size={14} /> Yangilash
              </button>
              {items.map((item) => (
                <article key={item.id}>
                  <div className={styles.heading}>
                    <strong>{requestTypeLabel(item.type)}</strong>
                    <span className={styles.badge} data-status={item.status}>
                      {statusLabel[item.status] ?? item.status}
                    </span>
                  </div>
                  <RequestValues item={item} />
                  <p>{item.reason}</p>
                  {item.reviewNote && (
                    <p>
                      <strong>Administrator:</strong> {item.reviewNote}
                    </p>
                  )}
                  {item.status === "approved" && (
                    <button
                      type="button"
                      className={styles.outline}
                      onClick={onRefresh}
                    >
                      Tasdiqlangan nusxani ochish
                    </button>
                  )}
                </article>
              ))}
            </details>
          )}
        </div>
        <div className={styles.dialogFooter}>
          <span>
            <CalendarDays size={15} /> So‘rov yuborilgach, holatini shu oynada
            kuzatishingiz mumkin.
          </span>
          <button
            type="button"
            className={styles.footerClose}
            onClick={() => setOpen(false)}
          >
            Yopish
          </button>
        </div>
      </dialog>
      {items.length > 0 && (
        <span
          className={styles.pendingBadge}
          aria-label={`${items.filter((item) => item.status === "pending").length} ta ko‘rib chiqilayotgan so‘rov`}
          hidden={!items.some((item) => item.status === "pending")}
        >
          So‘rov ko‘rib chiqilmoqda
        </span>
      )}
    </section>
  );
}
