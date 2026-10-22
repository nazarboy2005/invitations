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
  wishes: Array<{ id: string; name: string; message: string; status: string; createdAt: string }>;
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
  const [wishFilter, setWishFilter] = useState<"all" | "pending" | "approved" | "hidden">("all");
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
      <div className={styles.toolbar}>
        <p>Mehmonlar faolligi va shaxsiy to‘yona cheklari. Tasdiqlangan tilaklar taklifnomada ko‘rinadi.</p>
        <button type="button" onClick={() => setRefresh((value) => value + 1)} disabled={busy}>
          Yangilash
        </button>
      </div>
      <TelegramHint />
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
              <span className={data.totals.pending ? styles.pendingTotal : ""}>
              Kutilayotgan tilaklar: <strong>{data.totals.pending}</strong>
            </span>
          </div>
          <div className={styles.columns}>
            <section>
              <h2>Qatnashish javoblari <small>({data.totals.responses})</small></h2>
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
              <div className={styles.sectionHeading}>
                <h2>Mehmonlar tilaklari <small>({data.wishes.length})</small></h2>
                <label className={styles.filter}>Ko‘rsatish
                  <select value={wishFilter} onChange={(event) => { setWishFilter(event.target.value as typeof wishFilter); setPage(0); }}>
                    <option value="all">Barchasi</option>
                    <option value="pending">Kutilmoqda</option>
                    <option value="approved">Tasdiqlangan</option>
                    <option value="hidden">Yashirilgan</option>
                  </select>
                </label>
              </div>
              {!data.wishes.length && <p>Hozircha mehmonlardan tilak kelmadi. Yangi tilaklar shu yerda ko‘rinadi.</p>}
              {data.wishes.filter((item) => wishFilter === "all" || item.status === wishFilter).length === 0 && data.wishes.length > 0 && <p>Bu holatda tilaklar yo‘q.</p>}
              {data.wishes.filter((item) => wishFilter === "all" || item.status === wishFilter).map((item) => (
                <article key={item.id}>
                  <div className={styles.wishMeta}><strong>{item.name}</strong><time dateTime={item.createdAt}>{new Intl.DateTimeFormat("uz-UZ", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.createdAt))}</time></div>
                  <p className={styles.message}>{item.message}</p>
                  <small>
                    {{
                      pending: "Tasdiqlash kutilmoqda",
                      approved: "Taklifnomada ko‘rinadi",
                      hidden: "Yashirilgan",
                    }[item.status as "pending"] || item.status}
                  </small>
                  <div className={styles.actions}>
                    {item.status === "pending" && (
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

function TelegramHint() {
  const [url, setUrl] = useState("");
  useEffect(() => {
    fetch("/api/telegram/info", { cache: "force-cache" })
      .then((response) => response.ok ? response.json() : null)
      .then((result) => { if (result?.botUrl) setUrl(result.botUrl); })
      .catch(() => {});
  }, []);
  if (!url) return null;
  return <p className={styles.telegramHint}>Yangi tilaklarni Telegram orqali ham olish uchun botni bir marta oching va “Start” tugmasini bosing. <a href={url} target="_blank" rel="noreferrer">Telegram botni ochish ↗</a></p>;
}
