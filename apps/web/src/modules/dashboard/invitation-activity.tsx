"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Clock3, MessageCircle, Pencil, RefreshCw, Trash2, UserRound } from "lucide-react";
import { getContent, type Invitation } from "@taklifnoma/contracts";
import styles from "./invitation-activity.module.css";
import { formatDate } from "@/templates/date-format";
import { SoftSelect } from "@/components/soft-select";
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
const activitySnapshots = new Map<string, Activity>();
export function InvitationActivity({ invitation }: { invitation: Invitation }) {
  const cacheKey = `${invitation.id}:0`;
  const [data, setData] = useState<Activity | null>(() => activitySnapshots.get(cacheKey) ?? null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [page, setPage] = useState(0);
  const [section, setSection] = useState<"responses" | "wishes" | "receipts">("responses");
  const [wishFilter, setWishFilter] = useState<"all" | "pending" | "approved">("all");
  useEffect(() => {
    const controller = new AbortController();
    const key = `${invitation.id}:${page}`;
    setData(activitySnapshots.get(key) ?? null);
    setError("");
    fetch(`/api/invitations/${invitation.id}/activity?page=${page}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok)
          throw new Error(body.error?.message || "Ma’lumotlar olinmadi.");
        activitySnapshots.set(key, body);
        setData(body);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setError(error.message);
      });
    return () => controller.abort();
  }, [invitation.id, page, refresh]);
  async function moderate(
    id: string,
    status: "approved" | "deleted" | "received" | "issue",
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
            status === "approved" || status === "deleted"
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
      <div className={styles.toolbar}>
        <div className={styles.titleRow}>
          <Link href="/dashboard" className={styles.headerIconButton} aria-label="Taklifnomalarimga qaytish" title="Taklifnomalarimga qaytish">
            <ArrowLeft size={19} />
          </Link>
          <h1>
            {getContent(invitation).people.filter(Boolean).join(" & ") ||
              "Taklifnoma"}
          </h1>
          <Link href={`/studio/${encodeURIComponent(invitation.id)}`} className={styles.headerEditButton} aria-label="Taklifnomani tahrirlash" title="Tahrirlash">
            <Pencil size={17} />
          </Link>
          <button
            className={styles.headerIconButton}
            type="button"
            onClick={() => setRefresh((value) => value + 1)}
            disabled={busy}
            aria-label="Faollikni yangilash"
            title="Yangilash"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>
      <p className={styles.description}>Mehmonlar faolligi va shaxsiy to‘yona cheklari. Tasdiqlangan tilaklar taklifnomada ko‘rinadi.</p>
      {error && <p role="alert">{error}</p>}
      {!data && !error && <p role="status">Yuklanmoqda…</p>}
      {data && (
        <>
          <nav className={styles.sectionTabs} aria-label="Faollik bo‘limlari" role="tablist">
            <button role="tab" aria-selected={section === "responses"} onClick={() => setSection("responses")}>
              Javoblar <span>{data.totals.responses}</span>
            </button>
            <button role="tab" aria-selected={section === "wishes"} onClick={() => setSection("wishes")}>
              Tilaklar <span>{data.wishes.length}</span>
            </button>
            <button role="tab" aria-selected={section === "receipts"} onClick={() => setSection("receipts")}>
              To‘yona <span>{data.receipts.length}</span>
            </button>
          </nav>
          {section === "responses" && <section className={styles.sectionPanel} role="tabpanel">
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
          </section>}
          {section === "wishes" && <section className={styles.sectionPanel} role="tabpanel">
              <div className={styles.sectionHeading}>
                <h2>Mehmonlar tilaklari <small>({data.wishes.length})</small></h2>
                <div className={styles.filter}>
                  <span>Ko‘rsatish</span>
                  <div className={styles.filterSelect}>
                    <SoftSelect
                      value={wishFilter}
                      label="Tilaklarni ko‘rsatish"
                      squareOptions
                      options={[
                        { value: "all", label: "Barchasi" },
                        { value: "pending", label: "Kutilmoqda" },
                        { value: "approved", label: "Tasdiqlangan" },
                      ]}
                      onChange={(value) => { setWishFilter(value as typeof wishFilter); setPage(0); }}
                    />
                  </div>
                </div>
              </div>
              {!data.wishes.length && <p>Hozircha mehmonlardan tilak kelmadi. Yangi tilaklar shu yerda ko‘rinadi.</p>}
              {data.wishes.filter((item) => wishFilter === "all" || item.status === wishFilter).length === 0 && data.wishes.length > 0 && <p>Bu holatda tilaklar yo‘q.</p>}
              {data.wishes.filter((item) => wishFilter === "all" || item.status === wishFilter).map((item) => (
                <article className={styles.wishCard} key={item.id}>
                  <header className={styles.wishHeader}>
                  </header>
                  <div className={styles.wishMessage}>
                    <div className={styles.wishMessageHeading}>
                      <span><UserRound size={15} /> {item.name}</span>
                      <time dateTime={item.createdAt}><Clock3 size={14} />{formatDate(item.createdAt, "uz-Latn", invitation.timezone, { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</time>
                    </div>
                    <p className={styles.message}>{item.message}</p>
                  </div>
                  <div className={`${styles.wishActions} ${item.status === "pending" ? "" : styles.singleWishAction}`}>
                    {item.status === "pending" && (
                      <button
                        className={styles.approveIcon}
                        disabled={busy}
                        onClick={() => void moderate(item.id, "approved")}
                        aria-label="Tilakni tasdiqlash"
                        title="Tasdiqlash"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    {item.status !== "deleted" && (
                      <button
                        className={styles.deleteWishIcon}
                        disabled={busy}
                        onClick={() => {
                          if (window.confirm("Ushbu mehmon tilagini butunlay o‘chirasizmi?"))
                            void moderate(item.id, "deleted");
                        }}
                        aria-label="Tilakni o‘chirish"
                        title="O‘chirish"
                      >
                        <Trash2 size={17} />
                      </button>
                    )}
                  </div>
                </article>
              ))}
          </section>}
          {section === "receipts" && <section className={styles.sectionPanel} role="tabpanel">
            <h2>To‘yona cheklari · faqat sizga ko‘rinadi</h2>
            <p>
              AI va bank tekshiruvi yo‘q. Pul hisobingizga tushganini o‘zingiz
              tekshirib, belgi qo‘ying.
            </p>
            {!data.receipts.length && <p>Hozircha chek yo‘q.</p>}
            <div className={styles.receiptGrid}>
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
          </section>}
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

