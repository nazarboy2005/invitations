"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { eventTimestamp } from "@/lib/event-date";
import type { ChangeRequestView } from "@taklifnoma/contracts/changes";
import {
  RequestValues,
  requestTypeLabel,
} from "../studio/invitation-corrections";
import styles from "../studio/invitation-corrections.module.css";
export function AdminChangeRequests({ items }: { items: ChangeRequestView[] }) {
  const router = useRouter();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  async function decide(
    item: ChangeRequestView,
    decision: "approve" | "reject",
  ) {
    setBusy(item.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/invitation-changes/${item.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, note: notes[item.id] ?? "" }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error?.message || "Amal bajarilmadi.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Qayta urinib ko‘ring.");
    } finally {
      setBusy("");
    }
  }
  return (
    <div>
      <p>
        Faqat shu odam va shu tadbirga tegishli tuzatishlarni tasdiqlang. Ism
        o‘xshashligi o‘zi yetarli emas. Boshqa tadbirga almashtirishni rad
        eting.
      </p>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      {!items.length && <p>Hozircha tuzatish so‘rovlari yo‘q.</p>}
      {items.map((item) => (
        <article key={item.id} className={styles.panel}>
          <div className={styles.heading}>
            <h3>{requestTypeLabel(item.type)}</h3>
            <span className={styles.badge} data-status={item.status}>
              {{
                pending: "Kutilmoqda",
                approved: "Tasdiqlangan",
                rejected: "Rad etilgan",
              }[item.status] ?? item.status}
            </span>
          </div>
          <p>
            <strong>{item.people}</strong> · {item.ownerName}
            <br />
            <time dateTime={item.createdAt}>
              {eventTimestamp(item.createdAt, "Asia/Tashkent")}
            </time>
          </p>
          <Link href={`/admin/invitations/${item.invitationId}/edit`}>
            Taklifnomani tekshirish
          </Link>
          <RequestValues item={item} />
          <p>
            <strong>Sababi:</strong> {item.reason}
          </p>
          {item.type === "postponement" && (
            <p>
              Tasdiqlash yangi sana bilan birga tahrirlash muddatini ham oxirgi
              marosim kuni tugaguncha belgilaydi ({item.timezone}). Avvalgi sana
              tarixda qoladi.
            </p>
          )}
          {item.status === "pending" ? (
            <div className={styles.form}>
              <label>
                Ko‘rib chiqish izohi
                <textarea
                  rows={2}
                  minLength={5}
                  maxLength={1000}
                  value={notes[item.id] ?? ""}
                  onChange={(e) =>
                    setNotes({ ...notes, [item.id]: e.target.value })
                  }
                  placeholder="Tuzatish tekshiruvi va qaror sababi"
                />
              </label>
              <div className={styles.actions}>
                <button
                  className={styles.outline}
                  disabled={!!busy || (notes[item.id]?.trim().length ?? 0) < 5}
                  onClick={() => void decide(item, "reject")}
                >
                  Rad etish
                </button>
                <button
                  className={styles.primary}
                  disabled={!!busy || (notes[item.id]?.trim().length ?? 0) < 5}
                  onClick={() => void decide(item, "approve")}
                >
                  {busy === item.id ? "Saqlanmoqda…" : "Tuzatishni tasdiqlash"}
                </button>
              </div>
            </div>
          ) : (
            <p>
              <strong>Qaror izohi:</strong> {item.reviewNote}
            </p>
          )}
        </article>
      ))}
      {items.length === 100 && (
        <p>
          Eng so‘nggi 100 ta so‘rov ko‘rsatilgan; kutilayotgan so‘rovlar
          birinchi.
        </p>
      )}
    </div>
  );
}
