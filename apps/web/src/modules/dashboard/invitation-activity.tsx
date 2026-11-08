"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  CircleDashed,
  Clock3,
  Copy,
  Gift,
  Heart,
  MoreHorizontal,
  Pencil,
  ReceiptText,
  RefreshCw,
  Search,
  Trash2,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { getContent, type Invitation } from "@taklifnoma/contracts";
import styles from "./invitation-activity.module.css";
import { formatDate } from "@/templates/date-format";
import { SoftSelect } from "@/components/soft-select";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { publicAsset } from "@/lib/public-asset";
type Activity = {
  features: Record<"responses" | "wishes" | "receipts" | "intentions", boolean>;
  sectionHasMore: Record<"responses" | "wishes" | "receipts" | "intentions", boolean>;
  responses: Array<{
    id: string;
    name: string;
    status: "yes" | "no" | "maybe";
    partySize: number;
    note: string;
    createdAt: string;
  }>;
  wishes: Array<{
    id: string;
    name: string;
    message: string;
    status: string;
    createdAt: string;
  }>;
  receipts: Array<{
    id: string;
    giverNames: string;
    status: string;
    url: string;
    filename: string;
    cardHolder: string;
    cardLast4: string;
  }>;
  giftIntentions: Array<{
    id: string;
    senderName: string;
    amount: string;
    currencyLabel: string;
    message: string;
    createdAt: string;
  }>;
  totals: {
    responses: number;
    guests: number;
    pending: number;
    attending: number;
    maybe: number;
    notAttending: number;
  };
  responseHasMore: boolean;
  hasMore: boolean;
};
const activitySnapshots = new Map<string, Activity>();
export function InvitationActivity({
  invitation,
  adminContext,
}: {
  invitation: Invitation;
  adminContext?: { ownerName: string };
}) {
  const [adminReason, setAdminReason] = useState(
    "Administrator tomonidan moderatsiya",
  );
  const cacheKey = `${adminContext ? "admin:" : ""}${invitation.id}:0:all:`;
  const [data, setData] = useState<Activity | null>(
    () => activitySnapshots.get(cacheKey) ?? null,
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [page, setPage] = useState(0);
  const [responseQuery, setResponseQuery] = useState("");
  const [responseStatus, setResponseStatus] = useState<
    "all" | "yes" | "maybe" | "no"
  >("all");
  const [copiedResponseId, setCopiedResponseId] = useState<string | null>(null);
  const [section, setSection] = useState<
    "responses" | "wishes" | "receipts" | "intentions"
  >("responses");
  const [wishFilter, setWishFilter] = useState<"all" | "pending" | "approved">(
    "all",
  );
  const [deleteWishId, setDeleteWishId] = useState<string | null>(null);
  const activeSection = data?.features[section] ? section :
    (["responses", "wishes", "receipts", "intentions"] as const).find((key) => data?.features[key]) ?? null;
  function selectSection(value: typeof section) {
    setSection(value);
    setPage(0);
  }
  useEffect(() => {
    const controller = new AbortController();
    const query = responseQuery.trim();
    const key = `${adminContext ? "admin:" : ""}${invitation.id}:${page}:${responseStatus}:${query}`;
    setData(activitySnapshots.get(key) ?? null);
    setError("");
    const params = new URLSearchParams({
      page: String(page),
      status: responseStatus,
    });
    if (query) params.set("q", query);
    fetch(`/api/invitations/${invitation.id}/activity?${params}`, {
      cache: "no-store",
      signal: controller.signal,
      headers: adminContext
        ? { "X-Admin-Invitation": invitation.id }
        : undefined,
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
  }, [invitation.id, page, refresh, responseQuery, responseStatus]);
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
          headers: {
            "Content-Type": "application/json",
            ...(adminContext
              ? {
                  "X-Admin-Invitation": invitation.id,
                  "X-Admin-Reason": encodeURIComponent(adminReason),
                }
              : {}),
          },
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
  async function copyResponse(item: Activity["responses"][number]) {
    const statusLabel = {
      yes: "Kelaman",
      maybe: "Aniq emasman",
      no: "Kela olmayman",
    }[item.status];
    const lines = [item.name, statusLabel, item.note].filter(Boolean);
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopiedResponseId(item.id);
      window.setTimeout(() => setCopiedResponseId(null), 1800);
    } catch {
      setError("Javob ma’lumotini nusxalab bo‘lmadi.");
    }
  }
  return (
    <main
      id="main"
      className={`${styles.page} ${adminContext ? "" : styles.ownerPage}`}
    >
      {!adminContext && (
        <picture className={styles.background} aria-hidden="true">
          <source
            media="(max-width: 600px)"
            srcSet={publicAsset("/images/dashboard/ivory-silk-mobile.webp")}
          />
          <img
            src={publicAsset("/images/catalog/floral-header.webp")}
            alt=""
            fetchPriority="high"
          />
        </picture>
      )}
      {adminContext && (
        <section
          className="inline-note"
          style={{ padding: 18, marginBottom: 20 }}
        >
          <strong>Administrator: {adminContext.ownerName} taklifnomasi</strong>
          <label style={{ display: "grid", gap: 8, marginTop: 12 }}>
            Moderatsiya sababi
            <input
              name="adminReason"
              minLength={5}
              maxLength={500}
              value={adminReason}
              onChange={(event) => setAdminReason(event.target.value)}
            />
          </label>
          <a
            href="/admin?view=invitations"
            className="button secondary"
            style={{ marginTop: 12 }}
          >
            Boshqaruvga qaytish
          </a>
        </section>
      )}
      <div className={styles.toolbar}>
        <div className={styles.titleRow}>
          <Link
            href={adminContext ? "/admin?view=invitations" : "/dashboard"}
            className={`${styles.headerIconButton} ${styles.backButton}`}
            aria-label="Taklifnomalarimga qaytish"
            title="Taklifnomalarimga qaytish"
          >
            <ArrowLeft size={19} />
            {!adminContext && <span>Barcha taklifnomalar</span>}
          </Link>
          <div className={styles.titleCopy}>
            <h1>
              {getContent(invitation).people.filter(Boolean).join(" & ") ||
                "Taklifnoma"}
            </h1>
          </div>
          <Link
            href={
              adminContext
                ? `/admin/invitations/${invitation.id}/edit`
                : `/studio/${encodeURIComponent(invitation.id)}`
            }
            className={styles.headerEditButton}
            aria-label="Taklifnomani tahrirlash"
            title="Tahrirlash"
          >
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
      <div className={styles.introRow}>
        <p className={styles.description}>
          Mehmonlardan kelgan ma’lumotlar.
        </p>
      </div>
      {error && <p role="alert">{error}</p>}
      {!data && !error && <p role="status">Yuklanmoqda…</p>}
      {data && (
        <>
          {activeSection && <nav
            className={styles.sectionTabs}
            aria-label="Faollik bo‘limlari"
            role="tablist"
          >
            {data.features.responses && <button
              role="tab"
              aria-selected={activeSection === "responses"}
              onClick={() => selectSection("responses")}
            >
              <UsersRound size={16} /> Javoblar{" "}
              <span>{data.totals.responses}</span>
            </button>}
            {data.features.wishes && <button
              role="tab"
              aria-selected={activeSection === "wishes"}
              onClick={() => selectSection("wishes")}
            >
              <Heart size={16} /> Tilaklar <span>{data.wishes.length}</span>
            </button>}
            {data.features.receipts && <button
              role="tab"
              aria-selected={activeSection === "receipts"}
              onClick={() => selectSection("receipts")}
            >
              <ReceiptText size={16} /> To‘yona{" "}
              <span>{data.receipts.length}</span>
            </button>}
            {data.features.intentions && <button
              role="tab"
              aria-selected={activeSection === "intentions"}
              onClick={() => selectSection("intentions")}
            >
              <Gift size={16} /> Sovg‘a niyatlari{" "}
              <span>{data.giftIntentions?.length ?? 0}</span>
            </button>}
          </nav>}
          {!activeSection && <p>Bu taklifnomada mehmonlardan ma’lumot qabul qilinmaydi.</p>}
          {!adminContext && data.features.responses && (
            <section className={styles.overview} aria-label="Faollik xulosasi">
              <div className={styles.statGrid}>
                <div className={styles.statCard}>
                  <span className={styles.statIcon}>
                    <UsersRound size={18} />
                  </span>
                  <span className={styles.statLabel}>Javoblar</span>
                  <strong>{data.totals.responses}</strong>
                  <small>Mehmonlardan kelgan javob</small>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statIcon}>
                    <Check size={19} />
                  </span>
                  <span className={styles.statLabel}>Kelaman</span>
                  <strong>{data.totals.attending}</strong>
                  <small>Qatnashishini tasdiqladi</small>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statIcon}>
                    <CircleDashed size={18} />
                  </span>
                  <span className={styles.statLabel}>Aniq emas</span>
                  <strong>{data.totals.maybe}</strong>
                  <small>Hali qaror qilmagan</small>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statIcon}>
                    <X size={19} />
                  </span>
                  <span className={styles.statLabel}>Kela olmayman</span>
                  <strong>{data.totals.notAttending}</strong>
                  <small>Qatnasha olmaydi</small>
                </div>
              </div>
            </section>
          )}
          {activeSection === "responses" && (
            <section className={styles.sectionPanel} role="tabpanel">
              <div className={styles.responseToolbar}>
                <div className={styles.panelHeading}>
                  <div className={styles.panelHeadingIcon}>
                    <UsersRound size={19} />
                  </div>
                  <div>
                    <h2>
                      Qatnashish javoblari{" "}
                      <small>({data.totals.responses})</small>
                    </h2>
                    <p>Mehmonlarning kelishi haqidagi javoblari.</p>
                  </div>
                </div>
                <div className={styles.responseControls}>
                  <label className={styles.responseSearch}>
                    <Search size={17} aria-hidden="true" />
                    <input
                      type="search"
                      aria-label="Mehmon nomi yoki izohi bo‘yicha qidirish"
                      value={responseQuery}
                      placeholder="Mehmon nomi yoki izohi bo‘yicha qidiring…"
                      onChange={(event) => {
                        setResponseQuery(event.target.value);
                        setPage(0);
                      }}
                    />
                  </label>
                  <div className={styles.responseFilter}>
                    <SoftSelect
                      value={responseStatus}
                      label="Javob holati"
                      squareOptions
                      options={[
                        { value: "all", label: "Barchasi" },
                        { value: "yes", label: "Kelaman" },
                        { value: "maybe", label: "Aniq emas" },
                        { value: "no", label: "Kela olmayman" },
                      ]}
                      onChange={(value) => {
                        setResponseStatus(value as typeof responseStatus);
                        setPage(0);
                      }}
                    />
                  </div>
                </div>
              </div>
              {!data.responses.length && (
                <p>
                  {responseQuery.trim() || responseStatus !== "all"
                    ? "Bu qidiruv yoki holat bo‘yicha javob topilmadi."
                    : "Hozircha javob yo‘q."}
                </p>
              )}
              {data.responses.length > 0 && (
                <div
                  className={styles.responseTable}
                  role="table"
                  aria-label="Qatnashish javoblari"
                >
                  <div className={styles.responseTableHead} role="row">
                    <span role="columnheader">Mehmon</span>
                    <span role="columnheader">Javob</span>
                    <span role="columnheader">Qo‘shimcha izoh</span>
                    <span role="columnheader">Vaqt</span>
                    <span aria-hidden="true" />
                  </div>
                  {data.responses.map((item) => (
                    <div
                      className={styles.responseRow}
                      role="row"
                      key={item.id}
                    >
                      <div className={styles.guestCell} role="cell">
                        <span className={styles.guestAvatar} aria-hidden="true">
                          {item.name
                            .trim()
                            .split(/\s+/)
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </span>
                        <strong>{item.name}</strong>
                      </div>
                      <div role="cell">
                        <span
                          className={`${styles.responseStatus} ${styles[`status_${item.status}`]}`}
                        >
                          {item.status === "yes" ? (
                            <Check size={15} />
                          ) : item.status === "no" ? (
                            <span className={styles.statusCross}>×</span>
                          ) : (
                            <span className={styles.statusQuestion}>?</span>
                          )}
                          {item.status === "yes"
                            ? "Kelaman"
                            : item.status === "no"
                              ? "Kela olmayman"
                              : "Aniq emasman"}
                        </span>
                      </div>
                      <div className={styles.responseNote} role="cell">
                        {item.note || <span className={styles.noNote}>—</span>}
                      </div>
                      <time
                        role="cell"
                        className={styles.responseTime}
                        dateTime={item.createdAt}
                      >
                        {formatDate(
                          item.createdAt,
                          "uz-Latn",
                          invitation.timezone,
                          {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </time>
                      <details className={styles.responseMenu} role="cell">
                        <summary aria-label={`${item.name} javobi amallari`}>
                          <MoreHorizontal size={18} />
                        </summary>
                        <div>
                          <button
                            type="button"
                            onClick={() => void copyResponse(item)}
                          >
                            <Copy size={15} />
                            {copiedResponseId === item.id
                              ? "Nusxalandi"
                              : "Javobni nusxalash"}
                          </button>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
          {activeSection === "wishes" && (
            <section className={styles.sectionPanel} role="tabpanel">
              <div className={styles.sectionHeading}>
                <div className={styles.panelHeading}>
                  <div className={styles.panelHeadingIcon}>
                    <Heart size={19} />
                  </div>
                  <div>
                    <span className={styles.panelEyebrow}>SAMIMIY SO‘ZLAR</span>
                    <h2>
                      Mehmonlar tilaklari <small>({data.wishes.length})</small>
                    </h2>
                  </div>
                </div>
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
                      onChange={(value) => {
                        setWishFilter(value as typeof wishFilter);
                        setPage(0);
                      }}
                    />
                  </div>
                </div>
              </div>
              {!data.wishes.length && (
                <p>
                  Hozircha mehmonlardan tilak kelmadi. Yangi tilaklar shu yerda
                  ko‘rinadi.
                </p>
              )}
              {data.wishes.filter(
                (item) => wishFilter === "all" || item.status === wishFilter,
              ).length === 0 &&
                data.wishes.length > 0 && <p>Bu holatda tilaklar yo‘q.</p>}
              {data.wishes
                .filter(
                  (item) => wishFilter === "all" || item.status === wishFilter,
                )
                .map((item) => (
                  <article className={styles.wishCard} key={item.id}>
                    <div className={styles.wishMessage}>
                      <div className={styles.wishMessageHeading}>
                        <span className={styles.wishAuthor}>
                          <UserRound size={15} /> {item.name}
                        </span>
                        <time dateTime={item.createdAt}>
                          <Clock3 size={14} />
                          {formatDate(
                            item.createdAt,
                            "uz-Latn",
                            invitation.timezone,
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </time>
                      </div>
                      <p className={styles.message}>{item.message}</p>
                    </div>
                    <span
                      className={`${styles.wishStatus} ${item.status === "pending" ? styles.pending : styles.approved}`}
                    >
                      {item.status === "pending" ? (
                        <>
                          <CircleDashed size={14} /> Kutilmoqda
                        </>
                      ) : (
                        <>
                          <Check size={14} /> Tasdiqlangan
                        </>
                      )}
                    </span>
                    <div
                      className={`${styles.wishActions} ${item.status === "pending" ? "" : styles.singleWishAction}`}
                    >
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
                          onClick={() => setDeleteWishId(item.id)}
                          aria-label="Tilakni o‘chirish"
                          title="O‘chirish"
                        >
                          <Trash2 size={17} />
                        </button>
                      )}
                    </div>
                  </article>
                ))}
            </section>
          )}
          {activeSection === "receipts" && (
            <section className={styles.sectionPanel} role="tabpanel">
              <div className={styles.panelHeading}>
                <div className={styles.panelHeadingIcon}>
                  <ReceiptText size={19} />
                </div>
                <div>
                  <span className={styles.panelEyebrow}>
                    SHAXSIY VA XAVFSIZ
                  </span>
                  <h2>
                    To‘yona cheklari <small>· faqat sizga</small>
                  </h2>
                </div>
              </div>
              <p>
                AI va bank tekshiruvi yo‘q. Pul hisobingizga tushganini o‘zingiz
                tekshirib, belgi qo‘ying.
              </p>
              {!data.receipts.length && <p>Hozircha chek yo‘q.</p>}
              <div className={styles.receiptGrid}>
                {data.receipts.map((item) => (
                  <article className={styles.receiptCard} key={item.id}>
                    <strong>{item.giverNames}</strong>
                    <p>
                      {item.cardHolder} · •••• {item.cardLast4}
                    </p>
                    <p>
                      <a
                        className={styles.receiptLink}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ReceiptText size={16} />{" "}
                        {item.filename || "Chekni ochish"}{" "}
                        <ArrowUpRight size={15} />
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
          )}
          {activeSection === "intentions" && (
            <section className={styles.sectionPanel} role="tabpanel">
              <div className={styles.panelHeading}>
                <div className={styles.panelHeadingIcon}>
                  <Gift size={19} />
                </div>
                <div>
                  <span className={styles.panelEyebrow}>
                    MEHMONLAR E’TIBORI
                  </span>
                  <h2>
                    Sovg‘a niyatlari <small>· pul o‘tkazilmagan</small>
                  </h2>
                </div>
              </div>
              <p>
                Bu yozuvlar mehmonlarning niyatidir. Platforma pul qabul
                qilmaydi yoki o‘tkazmaydi.
              </p>
              {!data.giftIntentions?.length && (
                <p>Hozircha sovg‘a niyati yo‘q.</p>
              )}
              {data.giftIntentions?.map((item) => (
                <article className={styles.intentionCard} key={item.id}>
                  <strong>{item.senderName}</strong>
                  <p>
                    {Number(item.amount).toLocaleString("uz-UZ")}{" "}
                    {item.currencyLabel}
                  </p>
                  {item.message && <p>{item.message}</p>}
                  <small>
                    {formatDate(
                      item.createdAt,
                      invitation.defaultLocale,
                      invitation.timezone,
                      { dateStyle: "medium", timeStyle: "short" },
                    )}
                  </small>
                </article>
              ))}
            </section>
          )}
          {activeSection && <nav aria-label="Faollik sahifalari" className={styles.actions}>
            <button
              disabled={page === 0 || busy}
              onClick={() => setPage((value) => value - 1)}
            >
              Oldingi
            </button>
            <span className={styles.pageIndicator}>{page + 1}-sahifa</span>
            <button
              disabled={
                !data.sectionHasMore[activeSection] || busy
              }
              onClick={() => setPage((value) => value + 1)}
            >
              Keyingi
            </button>
          </nav>}
        </>
      )}
      {deleteWishId && (
        <ConfirmationDialog
          title="Mehmon tilagini o‘chirasizmi?"
          description="Bu tilak butunlay o‘chiriladi va taklifnomada ko‘rinmaydi."
          confirmLabel="O‘chirish"
          onCancel={() => setDeleteWishId(null)}
          onConfirm={() => {
            const id = deleteWishId;
            setDeleteWishId(null);
            void moderate(id, "deleted");
          }}
          busy={busy}
        />
      )}
    </main>
  );
}
