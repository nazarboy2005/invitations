"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUp,
  ArrowUpRight,
  Ban,
  CalendarDays,
  Check,
  CircleDashed,
  Clock3,
  Copy,
  Gift,
  Heart,
  Hourglass,
  Pencil,
  ReceiptText,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
  UsersRound,
  X,
} from "lucide-react";
import { getContent, type Invitation } from "@taklifnoma/contracts";
import { templateCapabilities } from "@taklifnoma/contracts/capabilities";
import styles from "./invitation-activity.module.css";
import { formatDate } from "@/templates/date-format";
import { SoftSelect } from "@/components/soft-select";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { publicAsset } from "@/lib/public-asset";
import { script } from "@/app/platform-fonts";
import { activityDisplay } from "./activity-fonts";
type Activity = {
  features: Record<"responses" | "wishes" | "receipts" | "intentions", boolean>;
  sectionHasMore: Record<
    "responses" | "wishes" | "receipts" | "intentions",
    boolean
  >;
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
    wishes: number;
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
  const isAdmin = Boolean(adminContext);
  const showResponseNotes = templateCapabilities(
    invitation.templateId,
  ).rsvpNotes;
  const dataIdentity = useRef(`${isAdmin}:${invitation.id}`);
  const [data, setData] = useState<Activity | null>(
    () => activitySnapshots.get(cacheKey) ?? null,
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [page, setPage] = useState(0);
  const [responseQuery, setResponseQuery] = useState("");
  const [responseFilterOpen, setResponseFilterOpen] = useState(false);
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
  const activeSection = data?.features[section]
    ? section
    : ((["responses", "wishes", "receipts", "intentions"] as const).find(
        (key) => data?.features[key],
      ) ?? null);
  function selectSection(value: typeof section) {
    setSection(value);
    setPage(0);
  }
  useEffect(() => {
    const controller = new AbortController();
    const query = responseQuery.trim();
    const key = `${adminContext ? "admin:" : ""}${invitation.id}:${page}:${responseStatus}:${query}`;
    const snapshot = activitySnapshots.get(key);
    const identity = `${isAdmin}:${invitation.id}`;
    if (dataIdentity.current !== identity) setData(snapshot ?? null);
    else if (snapshot) setData(snapshot);
    dataIdentity.current = identity;
    setLoading(true);
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
        if (controller.signal.aborted) return;
        if (!response.ok)
          throw new Error(body.error?.message || "Ma’lumotlar olinmadi.");
        activitySnapshots.set(key, body);
        setData(body);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [invitation.id, isAdmin, page, refresh, responseQuery, responseStatus]);
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
      data-activity-background={adminContext ? undefined : "roses"}
      className={`${styles.page} ${script.variable} ${activityDisplay.variable} ${adminContext ? "" : styles.ownerPage}`}
    >
      {!adminContext && (
        <style>{`
          html:has([data-activity-background="roses"]) {
            background: #efd1c8 url("${publicAsset("/images/activity/romantic-desktop.webp")}") center top / cover fixed no-repeat;
          }
          @media (max-width: 700px) {
            html:has([data-activity-background="roses"]) {
              background-image: url("${publicAsset("/images/activity/romantic-mobile.webp")}");
            }
          }
        `}</style>
      )}
      {!adminContext && (
        <picture className={styles.background} aria-hidden="true">
          <source
            media="(max-width: 700px)"
            srcSet={publicAsset("/images/activity/romantic-mobile.webp")}
          />
          <img
            src={publicAsset("/images/activity/romantic-desktop.webp")}
            alt=""
            fetchPriority="high"
          />
        </picture>
      )}
      <div className={styles.content}>
        {adminContext && (
          <section
            className="inline-note"
            style={{ padding: 18, marginBottom: 20 }}
          >
            <strong>
              Administrator: {adminContext.ownerName} taklifnomasi
            </strong>
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
              className={styles.backButton}
              aria-label="Taklifnomalarimga qaytish"
              title="Taklifnomalarimga qaytish"
            >
              <ArrowLeft size={19} />
              {!adminContext && <span>Barcha taklifnomalar</span>}
            </Link>
            <div className={styles.titleCopy}>
              <h1>Mehmonlar faolligi</h1>
              <p className={styles.description}>
                Sizning taklifnomangizga kimlar tashrif buyurganini bu yerda
                ko‘rishingiz mumkin.
              </p>
              <p className={styles.invitationNames}>
                {getContent(invitation).people.filter(Boolean).join(" & ") ||
                  "Taklifnoma"}
              </p>
              <div className={styles.flourish} aria-hidden="true">
                <span />
                <Heart size={15} />
                <span />
              </div>
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
              <span>Tahrirlash</span>
            </Link>
            <button
              className={styles.headerIconButton}
              type="button"
              onClick={() => setRefresh((value) => value + 1)}
              disabled={busy || loading}
              aria-label="Faollikni yangilash"
              title="Yangilash"
            >
              <RefreshCw
                size={18}
                className={loading ? styles.spinning : undefined}
              />
            </button>
          </div>
        </div>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        {!data && !error && (
          <p className={styles.emptyState} role="status">
            Yuklanmoqda…
          </p>
        )}
        <span className={styles.visuallyHidden} role="status">
          {copiedResponseId ? "Javob nusxalandi." : ""}
        </span>
        {data && (
          <>
            {activeSection && (
              <nav
                className={styles.sectionTabs}
                aria-label="Faollik bo‘limlari"
                role="tablist"
                onKeyDown={(event) => {
                  const tabs = Array.from(
                    event.currentTarget.querySelectorAll<HTMLButtonElement>(
                      '[role="tab"]',
                    ),
                  );
                  const index = tabs.indexOf(
                    document.activeElement as HTMLButtonElement,
                  );
                  const next =
                    event.key === "ArrowRight"
                      ? (index + 1) % tabs.length
                      : event.key === "ArrowLeft"
                        ? (index - 1 + tabs.length) % tabs.length
                        : event.key === "Home"
                          ? 0
                          : event.key === "End"
                            ? tabs.length - 1
                            : null;
                  if (next === null) return;
                  event.preventDefault();
                  tabs[next]?.focus();
                  tabs[next]?.click();
                }}
              >
                {data.features.responses && (
                  <button
                    role="tab"
                    id={`activity-tab-responses-${invitation.id}`}
                    aria-controls={`activity-panel-responses-${invitation.id}`}
                    tabIndex={activeSection === "responses" ? 0 : -1}
                    aria-selected={activeSection === "responses"}
                    onClick={() => selectSection("responses")}
                  >
                    <UsersRound size={16} /> Javoblar{" "}
                    <span>{data.totals.responses}</span>
                  </button>
                )}
                {data.features.wishes && (
                  <button
                    role="tab"
                    id={`activity-tab-wishes-${invitation.id}`}
                    aria-controls={`activity-panel-wishes-${invitation.id}`}
                    tabIndex={activeSection === "wishes" ? 0 : -1}
                    aria-selected={activeSection === "wishes"}
                    onClick={() => selectSection("wishes")}
                  >
                    <Heart size={16} /> Tilaklar
                    {data.totals.pending > 0 && (
                      <span
                        aria-label={`${data.totals.pending} ta tilak tasdiq kutmoqda`}
                        title="Tasdiq kutilmoqda"
                      >
                        {data.totals.pending}
                      </span>
                    )}
                  </button>
                )}
                {data.features.receipts && (
                  <button
                    role="tab"
                    id={`activity-tab-receipts-${invitation.id}`}
                    aria-controls={`activity-panel-receipts-${invitation.id}`}
                    tabIndex={activeSection === "receipts" ? 0 : -1}
                    aria-selected={activeSection === "receipts"}
                    onClick={() => selectSection("receipts")}
                  >
                    <ReceiptText size={16} /> To‘yona
                  </button>
                )}
                {data.features.intentions && (
                  <button
                    role="tab"
                    id={`activity-tab-intentions-${invitation.id}`}
                    aria-controls={`activity-panel-intentions-${invitation.id}`}
                    tabIndex={activeSection === "intentions" ? 0 : -1}
                    aria-selected={activeSection === "intentions"}
                    onClick={() => selectSection("intentions")}
                  >
                    <Gift size={16} /> Sovg‘a niyatlari
                  </button>
                )}
              </nav>
            )}
            {!activeSection && (
              <div className={styles.emptyState}>
                <UsersRound size={28} aria-hidden="true" />
                <p>Bu taklifnomada mehmonlardan ma’lumot qabul qilinmaydi.</p>
              </div>
            )}
            {activeSection === "responses" && (
              <section
                className={styles.responsesSection}
                role="tabpanel"
                id={`activity-panel-responses-${invitation.id}`}
                aria-labelledby={`activity-tab-responses-${invitation.id}`}
              >
                <div
                  className={styles.statGrid}
                  role="group"
                  aria-label="Javob holati bo‘yicha filtrlash"
                >
                  {(
                    [
                      {
                        value: "all",
                        label: "Barcha javoblar",
                        count: data.totals.responses,
                        Icon: UsersRound,
                      },
                      {
                        value: "yes",
                        label: "Kelaman",
                        count: data.totals.attending,
                        Icon: Check,
                      },
                      {
                        value: "maybe",
                        label: "Aniq emas",
                        count: data.totals.maybe,
                        Icon: Clock3,
                      },
                      {
                        value: "no",
                        label: "Kela olmayman",
                        count: data.totals.notAttending,
                        Icon: X,
                      },
                    ] as const
                  ).map(({ value, label, count, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      className={`${styles.statCard} ${styles[`stat_${value}`]}`}
                      aria-pressed={responseStatus === value}
                      onClick={() => {
                        setResponseStatus(value);
                        setPage(0);
                      }}
                    >
                      <span className={styles.statLabel}>
                        <span className={styles.statIcon}>
                          <Icon size={30} aria-hidden="true" />
                        </span>
                        {label}
                      </span>
                      <strong>{count}</strong>
                      <span
                        className={styles.statPercentage}
                        aria-label={`${data.totals.responses ? Math.round((count / data.totals.responses) * 100) : 0}% javob`}
                      >
                        <ArrowUp size={13} aria-hidden="true" />
                        {data.totals.responses
                          ? Math.round((count / data.totals.responses) * 100)
                          : 0}
                        %
                      </span>
                      <span className={styles.statArtwork} aria-hidden="true">
                        {value === "maybe" ? (
                          <Hourglass />
                        ) : value === "no" ? (
                          <Ban />
                        ) : (
                          <Icon />
                        )}
                      </span>
                    </button>
                  ))}
                </div>
                <div className={styles.sectionPanel}>
                  <div className={styles.responseToolbar}>
                    <div className={styles.panelHeading}>
                      <div>
                        <h2>
                          <UsersRound aria-hidden="true" />
                          Mehmonlar ro‘yxati
                        </h2>
                      </div>
                    </div>
                    <div className={styles.responseControls}>
                      <label className={styles.responseSearch}>
                        <Search size={17} aria-hidden="true" />
                        <input
                          type="search"
                          maxLength={100}
                          aria-label={
                            showResponseNotes
                              ? "Mehmon nomi yoki izohi bo‘yicha qidirish"
                              : "Mehmon nomi bo‘yicha qidirish"
                          }
                          value={responseQuery}
                          placeholder={
                            showResponseNotes
                              ? "Ism yoki izoh bo‘yicha qidirish"
                              : "Mehmon ismi bo‘yicha qidirish"
                          }
                          onChange={(event) => {
                            setResponseQuery(event.target.value);
                            setPage(0);
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        className={styles.filterToggle}
                        aria-label="Javob filtrlari"
                        aria-expanded={responseFilterOpen}
                        aria-controls={`response-filters-${invitation.id}`}
                        onClick={() => setResponseFilterOpen((value) => !value)}
                      >
                        <SlidersHorizontal size={20} />
                      </button>
                    </div>
                  </div>
                  {responseFilterOpen && (
                    <div
                      className={styles.responseFilters}
                      id={`response-filters-${invitation.id}`}
                    >
                      <span>Javob holati</span>
                      <SoftSelect
                        label="Javob holati"
                        value={responseStatus}
                        options={[
                          { value: "all", label: "Barcha javoblar" },
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
                  )}
                  {!data.responses.length && (
                    <p className={styles.emptyState} role="status">
                      {responseQuery.trim() || responseStatus !== "all"
                        ? "Bu qidiruv yoki holat bo‘yicha javob topilmadi."
                        : "Hozircha javob yo‘q."}
                    </p>
                  )}
                  {data.responses.length > 0 && (
                    <div
                      className={`${styles.responseTable} ${showResponseNotes ? "" : styles.withoutResponseNotes}`}
                      role="table"
                      aria-label="Qatnashish javoblari"
                      aria-busy={loading}
                    >
                      <div className={styles.responseTableHead} role="row">
                        <span role="columnheader">Mehmon</span>
                        <span role="columnheader">Javob</span>
                        {showResponseNotes && (
                          <span role="columnheader">Qo‘shimcha izoh</span>
                        )}
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
                            <span
                              className={styles.guestAvatar}
                              aria-hidden="true"
                            >
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
                          <div className={styles.statusCell} role="cell">
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
                                  : "Aniq emas"}
                            </span>
                          </div>
                          {showResponseNotes && (
                            <div className={styles.responseNote} role="cell">
                              {item.note || (
                                <span className={styles.noNote}>—</span>
                              )}
                            </div>
                          )}
                          <time
                            role="cell"
                            className={styles.responseTime}
                            dateTime={item.createdAt}
                          >
                            <CalendarDays size={16} aria-hidden="true" />
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
                          <div className={styles.responseCopy} role="cell">
                            <button
                              type="button"
                              aria-label={`${item.name}: javobni nusxalash`}
                              title={
                                copiedResponseId === item.id
                                  ? "Nusxalandi"
                                  : "Javobni nusxalash"
                              }
                              onClick={() => void copyResponse(item)}
                            >
                              {copiedResponseId === item.id ? (
                                <Check size={16} />
                              ) : (
                                <Copy size={16} />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}
            {activeSection === "wishes" && (
              <section
                className={`${styles.sectionPanel} ${styles.wishesPanel}`}
                role="tabpanel"
                id={`activity-panel-wishes-${invitation.id}`}
                aria-labelledby={`activity-tab-wishes-${invitation.id}`}
              >
                <div className={styles.wishesHero}>
                  <img
                    className={styles.wishesFlowers}
                    src={publicAsset("/images/activity/romantic-desktop.webp")}
                    alt=""
                    aria-hidden="true"
                  />
                  <div className={styles.wishesSummary}>
                    <img
                      src={publicAsset("/images/activity/sealed-envelope.webp")}
                      alt=""
                      aria-hidden="true"
                    />
                    <div>
                      <strong>
                        {data.totals.wishes ?? data.wishes.length}
                      </strong>
                      <span>Jami tilaklar</span>
                    </div>
                  </div>
                  <div className={styles.wishesGreeting}>
                    <div className={styles.wishFlourish} aria-hidden="true">
                      <span />
                      <Heart />
                      <span />
                    </div>
                    <p>
                      “Baxtingiz doim
                      <br />
                      bardavom bo‘lsin!”
                    </p>
                    <div className={styles.wishFlourish} aria-hidden="true">
                      <span />
                      <Heart />
                      <span />
                    </div>
                  </div>
                </div>
                <div className={styles.sectionHeading}>
                  <div className={styles.panelHeading}>
                    <div>
                      <h2>
                        <Heart aria-hidden="true" />
                        Mehmonlar tilaklari
                      </h2>
                      <p>Tasdiqlangan tilaklar taklifnomada ko‘rinadi.</p>
                    </div>
                  </div>
                  <div className={styles.filter}>
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
                  <p className={styles.emptyState}>
                    Hozircha mehmonlardan tilak kelmadi. Yangi tilaklar shu
                    yerda ko‘rinadi.
                  </p>
                )}
                {data.wishes.filter(
                  (item) => wishFilter === "all" || item.status === wishFilter,
                ).length === 0 &&
                  data.wishes.length > 0 && (
                    <p className={styles.emptyState}>
                      Bu holatda tilaklar yo‘q.
                    </p>
                  )}
                {data.wishes
                  .filter(
                    (item) =>
                      wishFilter === "all" || item.status === wishFilter,
                  )
                  .map((item) => (
                    <article className={styles.wishCard} key={item.id}>
                      <span className={styles.wishAvatar} aria-hidden="true">
                        {item.name
                          .trim()
                          .split(/\s+/)
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((part) => Array.from(part)[0])
                          .join("")
                          .toLocaleUpperCase("uz-Latn")}
                      </span>
                      <div className={styles.wishMessage}>
                        <div className={styles.wishMessageHeading}>
                          <span className={styles.wishAuthor}>{item.name}</span>
                        </div>
                        <p className={styles.message}>{item.message}</p>
                      </div>
                      <time
                        className={styles.wishTime}
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
                      <div className={styles.wishActions}>
                        {item.status === "pending" && (
                          <button
                            className={styles.approveIcon}
                            disabled={busy || loading}
                            onClick={() => void moderate(item.id, "approved")}
                            aria-label="Tilakni tasdiqlash"
                            title="Tasdiqlash"
                          >
                            <Check size={18} />
                            Tasdiqlash
                          </button>
                        )}
                        {item.status !== "deleted" && (
                          <button
                            className={styles.deleteWishIcon}
                            disabled={busy || loading}
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
              <section
                className={styles.sectionPanel}
                role="tabpanel"
                id={`activity-panel-receipts-${invitation.id}`}
                aria-labelledby={`activity-tab-receipts-${invitation.id}`}
              >
                <div className={styles.panelHeading}>
                  <div>
                    <h2>
                      <ReceiptText aria-hidden="true" />
                      To‘yona cheklari <small>· faqat sizga</small>
                    </h2>
                  </div>
                </div>
                <p className={styles.sectionNote}>
                  Chek pul tushganini tasdiqlamaydi. Hisobingizni tekshirib,
                  holatini belgilang.
                </p>
                {!data.receipts.length && (
                  <p className={styles.emptyState}>Hozircha chek yo‘q.</p>
                )}
                <div className={styles.receiptGrid}>
                  {data.receipts.map((item) => (
                    <article className={styles.receiptCard} key={item.id}>
                      <ReceiptText
                        className={styles.cardEmblem}
                        size={30}
                        aria-hidden="true"
                      />
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
                      <div className={styles.receiptActions}>
                        <button
                          disabled={
                            busy || loading || item.status === "received"
                          }
                          onClick={() => void moderate(item.id, "received")}
                        >
                          Pul tushdi
                        </button>
                        <button
                          disabled={busy || loading || item.status === "issue"}
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
              <section
                className={styles.sectionPanel}
                role="tabpanel"
                id={`activity-panel-intentions-${invitation.id}`}
                aria-labelledby={`activity-tab-intentions-${invitation.id}`}
              >
                <div className={styles.panelHeading}>
                  <div>
                    <h2>
                      <Gift aria-hidden="true" />
                      Sovg‘a niyatlari <small>· pul o‘tkazilmagan</small>
                    </h2>
                  </div>
                </div>
                <p className={styles.sectionNote}>
                  Bu mehmonlarning sovg‘a berish niyati. Pul o‘tkazilmagan.
                </p>
                {!data.giftIntentions?.length && (
                  <p className={styles.emptyState}>
                    Hozircha sovg‘a niyati yo‘q.
                  </p>
                )}
                {data.giftIntentions?.map((item) => (
                  <article className={styles.intentionCard} key={item.id}>
                    <Gift
                      className={styles.cardEmblem}
                      size={30}
                      aria-hidden="true"
                    />
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
                        {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </small>
                  </article>
                ))}
              </section>
            )}
            {activeSection &&
              (page > 0 || data.sectionHasMore[activeSection]) && (
                <nav
                  aria-label="Faollik sahifalari"
                  className={styles.pagination}
                >
                  <button
                    disabled={page === 0 || busy || loading}
                    onClick={() => setPage((value) => value - 1)}
                  >
                    Oldingi
                  </button>
                  <span className={styles.pageIndicator}>
                    {page + 1}-sahifa
                  </span>
                  <button
                    disabled={
                      !data.sectionHasMore[activeSection] || busy || loading
                    }
                    onClick={() => setPage((value) => value + 1)}
                  >
                    Keyingi
                  </button>
                </nav>
              )}
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
        <footer
          className={`${styles.footer} ${activeSection === "wishes" ? styles.wishesFooter : ""}`}
        >
          <span>
            {activeSection === "wishes"
              ? "Har bir tilak — biz uchun muhim"
              : "Baxt ulashish — eng go‘zal an’ana"}
          </span>
          <Heart size={25} strokeWidth={1.2} aria-hidden="true" />
        </footer>
      </div>
    </main>
  );
}
