"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getContent, type Invitation } from "@taklifnoma/contracts";
import styles from "./invitation-activity.module.css";
type Activity = {
  responses: Array<{
    id: string;
    name: string;
    status: "yes" | "no" | "maybe";
    partySize: number;
  }>;
  wishes: Array<{ id: string; name: string; message: string; status: string }>;
  receipts: Array<{
    id: string;
    giverNames: string;
    status: string;
    url: string;
    filename: string;
    cardHolder: string;
    cardLast4: string;
  }>;
  totals: { responses: number; guests: number; pending: number };
  hasMore: boolean;
};
export function InvitationActivity({ invitation }: { invitation: Invitation }) {
  const [data, setData] = useState<Activity | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [page, setPage] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setData(null);
    setError("");
    fetch(`/api/invitations/${invitation.id}/activity?page=${page}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok)
          throw new Error(body.error?.message || "Ma’lumotlar olinmadi.");
        setData(body);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setError(error.message);
      });
    return () => controller.abort();
  }, [invitation.id, page, refresh]);
  async function moderate(
    id: string,
    status: "approved" | "hidden" | "received" | "issue",
  ) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(
        `/api/invitations/${invitation.id}/activity`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            status === "approved" || status === "hidden"
              ? { wishId: id, status }
              : { receiptId: id, status },
          ),
        },
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error?.message || "Tilak yangilanmadi.");
      setRefresh((value) => value + 1);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Qayta urining.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className={styles.page}>
      <Link href="/dashboard">← Taklifnomalarim</Link>
      <h1>
        {getContent(invitation).people.filter(Boolean).join(" & ") ||
          "Taklifnoma"}
      </h1>
      <p>
        Mehmonlar javoblari, tilaklar va shaxsiy cheklar. Tasdiqlangan tilaklar
        taklifnomada ko‘rinadi.
      </p>
      <button
        type="button"
        onClick={() => setRefresh((value) => value + 1)}
        disabled={busy}
      >
        Yangilash
      </button>
      {error && <p role="alert">{error}</p>}
      {!data && !error && <p role="status">Yuklanmoqda…</p>}
      {data && (
        <>
          <div className={styles.totals}>
            <span>
              Javoblar: <strong>{data.totals.responses}</strong>
            </span>
            <span>
              Keladigan mehmonlar: <strong>{data.totals.guests}</strong>
            </span>
            <span>
              Kutilayotgan tilaklar: <strong>{data.totals.pending}</strong>
            </span>
          </div>
          <div className={styles.columns}>
            <section>
              <h2>Qatnashish javoblari</h2>
              {!data.responses.length && <p>Hozircha javob yo‘q.</p>}
              {data.responses.map((item) => (
                <article key={item.id}>
                  <strong>{item.name}</strong>
                  <p>
                    {
                      {
                        yes: "Kelaman",
                        no: "Kelmayman",
                        maybe: "Hali bilmayman",
                      }[item.status]
                    }
                    {item.status === "yes" ? ` · ${item.partySize} kishi` : ""}
                  </p>
                </article>
              ))}
            </section>
            <section>
              <h2>Mehmonlar tilaklari</h2>
              {!data.wishes.length && <p>Hozircha tilak yo‘q.</p>}
              {data.wishes.map((item) => (
                <article key={item.id}>
                  <strong>{item.name}</strong>
                  <p className={styles.message}>{item.message}</p>
                  <small>
                    {{
                      pending: "Tasdiqlash kutilmoqda",
                      approved: "Taklifnomada ko‘rinadi",
                      hidden: "Yashirilgan",
                    }[item.status as "pending"] || item.status}
                  </small>
                  <div className={styles.actions}>
                    {item.status !== "approved" && (
                      <button
                        disabled={busy}
                        onClick={() => void moderate(item.id, "approved")}
                      >
                        Tasdiqlash
                      </button>
                    )}
                    {item.status !== "hidden" && (
                      <button
                        disabled={busy}
                        onClick={() => void moderate(item.id, "hidden")}
                      >
                        Yashirish
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </section>
          </div>
          <section>
            <h2>To‘yona cheklari · faqat sizga ko‘rinadi</h2>
            <p>
              AI va bank tekshiruvi yo‘q. Pul hisobingizga tushganini o‘zingiz
              tekshirib, belgi qo‘ying.
            </p>
            {!data.receipts.length && <p>Hozircha chek yo‘q.</p>}
            <div className={styles.columns}>
              {data.receipts.map((item) => (
                <article key={item.id}>
                  <strong>{item.giverNames}</strong>
                  <p>
                    {item.cardHolder} · •••• {item.cardLast4}
                  </p>
                  <p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.filename || "Chekni ochish"} ↗
                    </a>
                  </p>
                  <small>
                    {
                      {
                        unreviewed: "Ko‘rib chiqilmagan",
                        received: "Siz pul tushganini belgilagansiz",
                        issue: "Muammo bor deb belgilangan",
                      }[item.status as "unreviewed"]
                    }
                  </small>
                  <div className={styles.actions}>
                    <button
                      disabled={busy || item.status === "received"}
                      onClick={() => void moderate(item.id, "received")}
                    >
                      Pul tushdi
                    </button>
                    <button
                      disabled={busy || item.status === "issue"}
                      onClick={() => void moderate(item.id, "issue")}
                    >
                      Muammo bor
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <nav aria-label="Javoblar sahifalari" className={styles.actions}>
            <button
              disabled={page === 0 || busy}
              onClick={() => setPage((value) => value - 1)}
            >
              Oldingi
            </button>
            <span>{page + 1}-sahifa</span>
            <button
              disabled={!data.hasMore || busy}
              onClick={() => setPage((value) => value + 1)}
            >
              Keyingi
            </button>
          </nav>
        </>
      )}
    </main>
  );
}
