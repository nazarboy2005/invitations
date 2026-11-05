"use client";
import { StaticImagePreview } from "@/modules/static-images/static-image-preview";
import { downloadInvitationImage } from "@/modules/static-images/download";
import { publicAsset } from "@/lib/public-asset";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  X,
  Trash2,
  FileHeart,
  MoreHorizontal,
  Pencil,
  LoaderCircle,
  Check,
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  Search,
  SlidersHorizontal,
  Sparkles,
  Eye,
  Plus,
  Send,
  ShieldCheck,
} from "lucide-react";
import {
  getContent,
  invitationSchema,
  LANGUAGE_NAMES,
  templateById,
  type Invitation,
  type SessionResponse,
} from "@taklifnoma/contracts";
import styles from "./dashboard.module.css";
import {
  deleteBrowserDraft,
  listBrowserDrafts,
  type BrowserDraft,
} from "@/modules/studio/draft-storage";
import { formatDate } from "@/templates/date-format";
import { InvitationThumbnail } from "./invitation-thumbnail";
import { useGridMotion } from "./use-grid-motion";
import { useRouter } from "next/navigation";
import {
  loadClientSession,
  currentTelegramLaunchData,
} from "@/modules/session/client-session";
type DashboardInvitation = Invitation & {
  createdAt?: string;
  viewCount?: number;
};
let dashboardSnapshot: {
  session: SessionResponse;
  invitations: DashboardInvitation[];
} | null = null;

function positionPopover(
  menu: HTMLDivElement,
  trigger: HTMLButtonElement | null,
  phoneSheet = false,
) {
  if (!menu.matches(":popover-open") || !trigger) return;
  if (phoneSheet && window.matchMedia("(max-width: 600px)").matches) {
    menu.style.left = "12px";
    menu.style.top = "auto";
    menu.style.bottom = "calc(84px + env(safe-area-inset-bottom))";
    menu.style.maxHeight = "calc(100dvh - 160px - env(safe-area-inset-bottom))";
    menu.dataset.placement = "sheet";
    return;
  }
  menu.style.bottom = "";
  const button = trigger.getBoundingClientRect();
  const gap = 6;
  const edge = 12;
  menu.style.maxHeight = "";
  const height = menu.offsetHeight;
  const below = window.innerHeight - button.bottom - gap - edge;
  const above = button.top - gap - edge;
  const opensAbove = below < height && above > below;
  const available = Math.max(0, opensAbove ? above : below);
  menu.style.maxHeight = `${available}px`;
  menu.style.left = `${Math.max(edge, Math.min(button.right - menu.offsetWidth, window.innerWidth - menu.offsetWidth - edge))}px`;
  menu.style.top = `${opensAbove ? Math.max(edge, button.top - gap - Math.min(height, available)) : button.bottom + gap}px`;
  menu.dataset.placement = opensAbove ? "above" : "below";
}

function InvitationCard({
  invitation,
  cacheScope,
  hidden = false,
  local = false,
  accountSaved = !local,
  onDelete,
  busy = false,
  onOpenActivity,
  viewCount,
}: {
  invitation: Invitation;
  cacheScope: string;
  hidden?: boolean;
  local?: boolean;
  accountSaved?: boolean;
  onDelete?: () => void;
  busy?: boolean;
  onOpenActivity?: () => void;
  viewCount?: number;
}) {
  const menuId = useId();
  const menuButton = useRef<HTMLButtonElement>(null);
  const content = getContent(invitation);
  const template = templateById(invitation.templateId);
  const isImage = template?.format === "image";
  const [imageBusy, setImageBusy] = useState(false);
  const [imageError, setImageError] = useState("");
  const [imageExported, setImageExported] = useState(
    !!invitation.imageExportedAt,
  );
  const [shareMessage, setShareMessage] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);
  async function shareInvitation(share = false) {
    if (!invitation.slug) return;
    const url = new URL(
      `/i/${encodeURIComponent(invitation.slug)}`,
      window.location.origin,
    ).href;
    try {
      if (share && navigator.share) {
        await navigator.share({ title: names, url });
        setShareMessage("");
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setShareMessage("");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setCopied(false);
      setShareMessage("Havolani menyudan ochib nusxalashingiz mumkin.");
    }
  }
  async function downloadImage() {
    setImageBusy(true);
    setImageError("");
    try {
      await downloadInvitationImage(invitation, invitation.defaultLocale);
      setImageExported(true);
    } catch (e) {
      setImageError(e instanceof Error ? e.message : "Rasm yuklab olinmadi.");
    } finally {
      setImageBusy(false);
    }
  }
  const names =
    content.people.filter(Boolean).join(" & ") || "Yangi taklifnoma";
  const date =
    formatDate(invitation.startsAt, "uz-Latn", invitation.timezone, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }) || "Sana kiritilmagan";
  const editUrl = local
    ? `/studio?draft=${encodeURIComponent(invitation.id)}`
    : `/studio/${encodeURIComponent(invitation.id)}`;
  const activityUrl = `/dashboard/${encodeURIComponent(invitation.id)}/activity`;
  return (
    <article
      hidden={hidden}
      className={styles.invitationCard}
      data-clickable={!!onOpenActivity}
      role={onOpenActivity ? "link" : undefined}
      tabIndex={onOpenActivity ? 0 : undefined}
      aria-label={
        onOpenActivity ? `${names}: javoblar, tilaklar va cheklar` : undefined
      }
      onClick={(event) => {
        if (!onOpenActivity) return;
        if (
          (event.target as HTMLElement).closest(
            "a,button,input,select,textarea,[popover]",
          )
        )
          return;
        onOpenActivity();
      }}
      onKeyDown={(event) => {
        if (
          onOpenActivity &&
          event.currentTarget === event.target &&
          event.key === "Enter"
        ) {
          event.preventDefault();
          onOpenActivity();
        }
      }}
    >
      <div className={styles.cardCover}>
        <div className={styles.cardArt} data-format={template?.format}>
          <Link
            href={onOpenActivity ? activityUrl : editUrl}
            className={styles.coverLink}
            aria-label={
              onOpenActivity
                ? `${names}: javoblar, tilaklar va cheklar`
                : `${names}: taklifnomani tahrirlash`
            }
          />
          {isImage ? (
            <StaticImagePreview invitation={invitation} compact />
          ) : template ? (
            <InvitationThumbnail
              invitation={invitation}
              cacheScope={cacheScope}
            />
          ) : (
            <span className={styles.noTemplateLabel}>
              <FileHeart size={26} />
              Dizayn tanlanmagan
            </span>
          )}
        </div>
        <span
          className={styles.cardStatus}
          data-published={invitation.status === "published"}
        >
          {isImage && (imageExported || invitation.imageExportedAt)
            ? "Rasm tayyor"
            : local
              ? accountSaved
                ? "Saqlanmagan o‘zgarishlar"
                : "Qoralama"
              : invitation.status === "published"
                ? "Nashr qilingan"
                : "Qoralama"}
        </span>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardSummary}>
          <div className={styles.cardDetails}>
            <h2 className={styles.invitationName} title={names}>
              {names}
            </h2>
            {invitation.status === "published" && viewCount !== undefined && (
              <p
                className={styles.cardViews}
                aria-label={`Ko‘rishlar: ${viewCount}`}
              >
                <Eye size={14} />
                {new Intl.NumberFormat("uz-UZ").format(viewCount)} ko‘rish
              </p>
            )}
            {invitation.status !== "published" && (
              <p className={styles.cardViews}>
                {isImage ? "Rasm taklifnoma" : "Veb taklifnoma"}
              </p>
            )}
          </div>
          <button
            className={styles.moreButton}
            ref={menuButton}
            popoverTarget={menuId}
            aria-label={`${names}: qo‘shimcha amallar`}
          >
            <MoreHorizontal size={20} />
          </button>
          <div
            id={menuId}
            popover="auto"
            onToggle={(event) => {
              positionPopover(event.currentTarget, menuButton.current, true);
            }}
            className={styles.cardMenu}
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("a,button"))
                event.currentTarget.hidePopover();
            }}
          >
            <p className={styles.menuHeading}>{names}</p>
            <button
              type="button"
              className={styles.menuClose}
              aria-label="Menyuni yopish"
              onClick={(event) =>
                event.currentTarget
                  .closest<HTMLElement>("[popover]")
                  ?.hidePopover()
              }
            >
              <X size={18} />
            </button>
            <div className={styles.menuDetails}>
              <span>
                {template?.name ?? "Dizayn tanlanmagan"} ·{" "}
                {isImage ? "Rasm" : "Veb"}
              </span>
              <span>
                <CalendarDays size={13} /> {date}
              </span>
              <span>
                {invitation.enabledLocales
                  .map((locale) => LANGUAGE_NAMES[locale])
                  .join(", ")}
              </span>
            </div>
            <Link href={editUrl}>
              <Pencil size={15} /> Tahrirlash
            </Link>
            {onOpenActivity && (
              <Link href={activityUrl}>
                <Eye size={15} /> Javoblar, tilaklar va cheklar
              </Link>
            )}
            {invitation.status === "published" && invitation.slug && (
              <a
                href={`/i/${encodeURIComponent(invitation.slug)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={15} /> Taklifnomani ochish
              </a>
            )}
            {accountSaved && invitation.status === "draft" && !isImage && (
              <Link href="/payment/return">To‘lov holati</Link>
            )}
            {onDelete && (
              <button
                className={styles.dangerAction}
                onClick={onDelete}
                disabled={busy}
              >
                <Trash2 size={15} /> O‘chirish
              </button>
            )}
          </div>
        </div>
        <div className={styles.cardActions}>
          {isImage && accountSaved && !local ? (
            <button
              type="button"
              className={styles.mainAction}
              onClick={() => void downloadImage()}
              disabled={imageBusy}
            >
              <Download size={14} />
              {imageBusy ? "Tayyorlanmoqda…" : "PNG yuklab olish"}
            </button>
          ) : invitation.status === "published" && invitation.slug ? (
            <>
              <button
                type="button"
                onClick={() => void shareInvitation()}
                aria-live="polite"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Nusxalandi" : "Nusxa olish"}
              </button>
              <button
                type="button"
                className={styles.mainAction}
                onClick={() => void shareInvitation(true)}
              >
                <Send size={13} />
                Chaqirish
              </button>
            </>
          ) : (
            <Link href={editUrl}>
              <Pencil size={14} /> Tahrirlash
            </Link>
          )}
        </div>
        {shareMessage && (
          <p className={styles.actionMessage} role="status">
            {shareMessage}
          </p>
        )}
        {imageError && (
          <p role="alert" className={styles.imageDownloadError}>
            {imageError} <Link href={editUrl}>Studioda tekshirish</Link>
          </p>
        )}
      </div>
    </article>
  );
}

export function Dashboard() {
  const router = useRouter();
  const { gridRef, updateGrid } = useGridMotion();
  const [session, setSession] = useState<SessionResponse | null>(
    dashboardSnapshot?.session ?? null,
  );
  const [invitations, setInvitations] = useState<DashboardInvitation[]>(
    dashboardSnapshot?.invitations ?? [],
  );
  const [browserDrafts, setBrowserDrafts] = useState<BrowserDraft[]>([]);
  const [loading, setLoading] = useState(!dashboardSnapshot);
  const [error, setError] = useState("");
  const [statuses, setStatuses] = useState({ draft: true, published: true });
  const [formats, setFormats] = useState({ web: true, image: true });
  const [query, setQuery] = useState("");
  const filterId = useId();
  const filterButton = useRef<HTMLButtonElement>(null);
  const [retry, setRetry] = useState(0);
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [actionBusy, setActionBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{
    invitation: Invitation;
    local: boolean;
    accountSaved: boolean;
  } | null>(null);
  async function removeInvitation(
    invitation: Invitation,
    local: boolean,
    accountSaved: boolean,
  ) {
    setActionBusy(invitation.id);
    setActionError("");
    try {
      if (accountSaved) {
        const response = await fetch(
          `/api/invitations/${encodeURIComponent(invitation.id)}`,
          { method: "DELETE" },
        );
        if (!response.ok)
          throw new Error(
            "Taklifnomani o‘chirib bo‘lmadi. Qayta urinib ko‘ring.",
          );
        setInvitations((items) => {
          const next = items.filter((item) => item.id !== invitation.id);
          if (dashboardSnapshot)
            dashboardSnapshot = { ...dashboardSnapshot, invitations: next };
          return next;
        });
      }
      if (local || accountSaved) {
        try {
          deleteBrowserDraft(invitation.id);
        } catch {
          /* Storage may be unavailable. */
        }
        setBrowserDrafts((items) =>
          items.filter((item) => item.invitation.id !== invitation.id),
        );
      }
    } catch (cause) {
      setActionError(
        cause instanceof Error ? cause.message : "Amal bajarilmadi.",
      );
    } finally {
      setActionBusy(null);
    }
  }

  async function startLogin() {
    setLoginBusy(true);
    setLoginError("");
    try {
      const response = await fetch("/api/auth/telegram/start", {
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok || !result.loginUrl || !result.requestId)
        throw new Error();
      const telegramWindow = window.open(
        result.loginUrl,
        "_blank",
        "noopener,noreferrer",
      );
      if (!telegramWindow) window.location.assign(result.loginUrl);
      const deadline = Date.now() + 5 * 60_000;
      while (Date.now() < deadline) {
        await new Promise((resolve) => window.setTimeout(resolve, 2000));
        const status = await fetch(
          `/api/auth/telegram/status?requestId=${encodeURIComponent(result.requestId)}`,
          { cache: "no-store" },
        );
        if (!status.ok) throw new Error();
        const state = await status.json();
        if (state.state === "confirmed") {
          const complete = await fetch("/api/auth/telegram/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requestId: result.requestId }),
          });
          if (!complete.ok) throw new Error();
          window.location.reload();
          return;
        }
        if (state.state === "expired") throw new Error();
      }
      throw new Error();
    } catch {
      setLoginError(
        "Telegram orqali kirish boshlanmadi yoki vaqt tugadi. Qayta urinib ko‘ring.",
      );
      setLoginBusy(false);
    }
  }

  useEffect(() => {
    const refreshSession = () => setRetry((value) => value + 1);
    window.addEventListener("taklifnoma:session-changed", refreshSession);
    return () =>
      window.removeEventListener("taklifnoma:session-changed", refreshSession);
  }, []);

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!dashboardSnapshot) setLoading(true);
      setError("");
      try {
        const initData = currentTelegramLaunchData();
        if (initData) {
          window.Telegram?.WebApp?.ready?.();
          window.Telegram?.WebApp?.expand?.();
        }
        const result = await loadClientSession(initData);
        if (!alive) return;
        setSession(result);
        try {
          setBrowserDrafts(listBrowserDrafts(result.user?.id ?? null));
        } catch {
          /* Storage may be unavailable. */
        }
        if (result.user) {
          const list = await fetch("/api/invitations", { cache: "no-store" });
          if (!list.ok)
            throw new Error(
              "Taklifnomalaringiz yuklanmadi. Qayta urinib ko‘ring.",
            );
          const data = await list.json();
          if (alive) {
            // A browser copy must not revive an invitation deleted on another device.
            const deletedIds = new Set<string>(data.deletedIds ?? []);
            try {
              for (const id of deletedIds) deleteBrowserDraft(id);
            } catch {
              /* Storage may be unavailable. */
            }
            setBrowserDrafts((items) =>
              items.filter((item) => !deletedIds.has(item.invitation.id)),
            );
            const nextInvitations = (data.invitations ?? []).filter(
              (item: unknown) => invitationSchema.safeParse(item).success,
            ) as DashboardInvitation[];
            dashboardSnapshot = {
              session: result,
              invitations: nextInvitations,
            };
            setInvitations(nextInvitations);
          }
        } else {
          dashboardSnapshot = { session: result, invitations: [] };
          setInvitations([]);
        }
      } catch (cause) {
        if (alive)
          setError(
            cause instanceof Error
              ? cause.message
              : "Yuklash vaqtincha ishlamadi.",
          );
      } finally {
        if (alive) setLoading(false);
      }
    }
    void load();
    return () => {
      alive = false;
    };
  }, [retry]);

  const cloudIds = new Set(invitations.map((item) => item.id));
  const localDrafts = browserDrafts.filter(
    (draft) => !cloudIds.has(draft.invitation.id) || draft.dirty,
  );
  const localById = new Map(
    localDrafts.map((draft) => [draft.invitation.id, draft]),
  );
  const entries = [
    ...invitations.map((invitation) => ({
      invitation: {
        ...(localById.get(invitation.id)?.invitation ?? invitation),
        status: invitation.status,
        slug: invitation.slug,
      },
      local: localById.has(invitation.id),
      viewCount: invitation.viewCount,
      createdAt:
        invitation.createdAt ?? localById.get(invitation.id)?.createdAt ?? "",
    })),
    ...localDrafts
      .filter((draft) => !cloudIds.has(draft.invitation.id))
      .map((draft) => ({
        invitation: draft.invitation,
        local: true,
        viewCount: undefined,
        createdAt: draft.createdAt || draft.savedAt,
      })),
  ].sort((a, b) => {
    const comparison =
      a.createdAt.localeCompare(b.createdAt) ||
      a.invitation.id.localeCompare(b.invitation.id);
    return -comparison;
  });
  const matchesFilters = (invitation: Invitation) => {
    const template = templateById(invitation.templateId);
    const format = template?.format === "image" ? "image" : "web";
    const searchText = [
      getContent(invitation).people.join(" "),
      template?.name ?? "",
    ]
      .join(" ")
      .toLocaleLowerCase("uz");
    return (
      statuses[invitation.status] &&
      formats[format] &&
      searchText.includes(query.trim().toLocaleLowerCase("uz"))
    );
  };
  const visibleCount = entries.filter(({ invitation }) =>
    matchesFilters(invitation),
  ).length;
  const hasVisibleEntries = visibleCount > 0;
  const filterCount =
    Number(!statuses.draft || !statuses.published) +
    Number(!formats.web || !formats.image);
  const filtersChanged = !!query.trim() || filterCount > 0;
  const allInvitations = [
    ...invitations,
    ...localDrafts
      .filter((draft) => !cloudIds.has(draft.invitation.id))
      .map((draft) => draft.invitation),
  ];
  const count = allInvitations.length;
  const draftCount = allInvitations.filter(
    (item) => item.status === "draft",
  ).length;
  const publishedCount = allInvitations.filter(
    (item) => item.status === "published",
  ).length;

  return (
    <div className={styles.dashboard}>
      <picture className={styles.background} aria-hidden="true">
        <source
          media="(max-width: 600px)"
          srcSet={publicAsset("/images/dashboard/ivory-silk-mobile.webp")}
        />
        <img
          src={publicAsset("/images/dashboard/ivory-silk-desktop.webp")}
          alt=""
          fetchPriority="high"
        />
      </picture>
      <main id="main" className={styles.main}>
        <div className={styles.pageHeading}>
          <div>
            <p className={styles.eyebrow}>Sizning taklifnomalaringiz</p>
            <h1>Taklifnomalarim</h1>
            <span>Yaratgan taklifnomalaringiz shu yerda saqlanadi.</span>
          </div>
          <div className={styles.headingActions}>
            {session?.user?.isAdmin && (
              <a
                href="/admin"
                className={`${styles.primaryButton} ${styles.adminButton}`}
              >
                <ShieldCheck size={18} aria-hidden="true" />
                Boshqaruv
              </a>
            )}
            <div className={styles.createPanel}>
              <div>
                <strong>
                  <Sparkles size={17} /> Yangi taklifnoma yaratish
                </strong>
                <p>Chiroyli taklifnoma bilan yaqinlaringizni xursand qiling.</p>
              </div>
              <Link className={styles.primaryButton} href="/studio?new=1">
                <Plus size={17} />
                Yangi taklifnoma
              </Link>
            </div>
          </div>
        </div>
        {!session?.user && !loading && !error && (
          <div className={styles.accountNotice}>
            <span className={styles.noticeIcon}>
              <Send size={22} />
            </span>
            <div>
              <strong>Takliflaringiz doim yoningizda bo‘lsin</strong>
              <p>
                Taklifnomani tayyorlang, so‘ng Telegram orqali hisobingizga
                saqlang. Keyingi safar shu yerdan davom etasiz.
              </p>
            </div>
            <button onClick={startLogin} disabled={loginBusy}>
              {loginBusy ? "Telegramni kutyapmiz…" : "Telegram orqali kirish"}
              {loginBusy ? (
                <LoaderCircle size={16} />
              ) : (
                <ArrowRight size={16} />
              )}
            </button>
            {loginError && <p role="alert">{loginError}</p>}
          </div>
        )}
        <div className={styles.contentLayout}>
          <section
            className={styles.invitationList}
            aria-label="Taklifnomalar ro‘yxati"
          >
            <div className={styles.listToolbar} data-catalog-pin-boundary>
              <div className={styles.resultsCount} aria-live="polite">
                <span className={styles.resultsLabel}>Taklifnomalar</span>
                <span>
                  {loading
                    ? "…"
                    : filtersChanged
                      ? `${visibleCount} / ${count}`
                      : count}
                </span>
              </div>
              <div
                className={styles.desktopSummary}
                aria-label="Taklifnoma holatlari bo‘yicha jami"
              >
                <span>
                  <i data-status="draft" />
                  {draftCount} qoralama
                </span>
                <span>
                  <i data-status="published" />
                  {publishedCount} nashr qilingan
                </span>
              </div>
              <div className={styles.toolbarControls}>
                <label className={styles.searchField}>
                  <Search size={17} />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) =>
                      updateGrid(() => setQuery(event.target.value))
                    }
                    placeholder="Taklifnomalarni qidirish…"
                    aria-label="Taklifnomalarni qidirish"
                  />
                </label>
                <button
                  ref={filterButton}
                  type="button"
                  popoverTarget={filterId}
                  className={styles.filterButton}
                  aria-label="Taklifnoma filtrlari"
                >
                  <SlidersHorizontal size={16} />
                  <span>Filtrlar</span>
                  {filterCount > 0 && (
                    <span className={styles.filterCount}>{filterCount}</span>
                  )}
                  <ChevronDown size={14} />
                </button>
                <div
                  id={filterId}
                  popover="auto"
                  className={styles.filterMenu}
                  onToggle={(event) =>
                    positionPopover(event.currentTarget, filterButton.current)
                  }
                >
                  <fieldset>
                    <legend>Taklifnoma holati</legend>
                    {(
                      [
                        ["draft", "Qoralamalar", draftCount],
                        ["published", "Nashr qilingan", publishedCount],
                      ] as const
                    ).map(([value, label, amount]) => (
                      <label key={value}>
                        <input
                          type="checkbox"
                          checked={statuses[value]}
                          onChange={(event) =>
                            updateGrid(() =>
                              setStatuses((current) => ({
                                ...current,
                                [value]: event.target.checked,
                              })),
                            )
                          }
                        />
                        <span className={styles.selectionMark}>
                          <Check size={16} />
                        </span>
                        {label}
                        <span className={styles.optionCount}>{amount}</span>
                      </label>
                    ))}
                  </fieldset>
                  <fieldset>
                    <legend>Taklifnoma turi</legend>
                    {(
                      [
                        ["web", "Veb taklifnomalar"],
                        ["image", "Rasm taklifnomalar"],
                      ] as const
                    ).map(([value, label]) => (
                      <label key={value}>
                        <input
                          type="checkbox"
                          checked={formats[value]}
                          onChange={(event) =>
                            updateGrid(() =>
                              setFormats((current) => ({
                                ...current,
                                [value]: event.target.checked,
                              })),
                            )
                          }
                        />
                        <span className={styles.selectionMark}>
                          <Check size={16} />
                        </span>
                        {label}
                      </label>
                    ))}
                  </fieldset>
                </div>
              </div>
            </div>
            {error && (
              <div className={styles.error} role="alert">
                <p>{error}</p>
                <button onClick={() => setRetry((value) => value + 1)}>
                  Qayta urinish
                </button>
              </div>
            )}
            {actionError && (
              <div className={styles.error} role="alert">
                <p>{actionError}</p>
              </div>
            )}
            {loading ? (
              <div className={styles.loading} role="status">
                <LoaderCircle size={23} />
                <span>Taklifnomalar yuklanmoqda…</span>
              </div>
            ) : (
              <div className={styles.cardGrid} ref={gridRef}>
                {entries.map(({ invitation, local, viewCount }) => (
                  <InvitationCard
                    invitation={invitation}
                    hidden={!matchesFilters(invitation)}
                    cacheScope={session?.user?.id ?? "browser-drafts"}
                    local={local}
                    viewCount={viewCount}
                    accountSaved={cloudIds.has(invitation.id)}
                    busy={actionBusy === invitation.id}
                    onDelete={() =>
                      setDeleteTarget({
                        invitation,
                        local,
                        accountSaved: cloudIds.has(invitation.id),
                      })
                    }
                    onOpenActivity={
                      invitation.status === "published" &&
                      cloudIds.has(invitation.id)
                        ? () =>
                            router.push(
                              `/dashboard/${encodeURIComponent(invitation.id)}/activity`,
                            )
                        : undefined
                    }
                    key={invitation.id}
                  />
                ))}
                {!hasVisibleEntries && !error && (
                  <div className={styles.empty}>
                    <div className={styles.emptyArt}>
                      <FileHeart size={54} strokeWidth={1} />
                      <span>
                        <Plus size={15} />
                      </span>
                    </div>
                    <h2>
                      {filtersChanged
                        ? "Mos taklifnoma topilmadi"
                        : "Birinchi taklifingizni yarating"}
                    </h2>
                    <p>
                      {filtersChanged
                        ? "Qidiruv yoki filtrlarni o‘zgartirib ko‘ring."
                        : "Dizaynni tanlang, ma’lumotlaringizni kiriting va tayyor taklifnomani mehmonlaringizga ulashing."}
                    </p>
                    {filtersChanged ? (
                      <button
                        type="button"
                        className={styles.primaryButton}
                        onClick={() => {
                          updateGrid(() => {
                            setQuery("");
                            setFormats({ web: true, image: true });
                            setStatuses({ draft: true, published: true });
                          });
                        }}
                      >
                        Filtrlarni tozalash
                      </button>
                    ) : (
                      <Link
                        href="/studio?new=1"
                        className={styles.primaryButton}
                      >
                        <Plus size={16} />
                        Taklifnoma yaratish
                      </Link>
                    )}
                    {!filtersChanged && (
                      <small>
                        Avval tayyorlashingiz mumkin. Kirish — saqlash paytida.
                      </small>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
        <div className={styles.bottomNote}>
          <CheckCircle2 size={15} />
          <p>
            {session?.user
              ? "Qoralamalar faqat sizga ko‘rinadi. Nashr qilingan taklifnomani havolasi orqali mehmonlaringiz ochishi mumkin."
              : "Brauzer qoralamasi faqat shu qurilmada mavjud. Uni boshqa qurilmadan ochish uchun hisobingizga saqlang."}
          </p>
        </div>
      </main>
      {deleteTarget && (
        <div
          className={styles.dialogBackdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !actionBusy)
              setDeleteTarget(null);
          }}
        >
          <section
            className={styles.deleteDialog}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-draft-title"
            aria-describedby="delete-draft-description"
          >
            <button
              className={styles.dialogClose}
              aria-label="Yopish"
              onClick={() => setDeleteTarget(null)}
              disabled={!!actionBusy}
            >
              <X size={18} />
            </button>
            <span className={styles.dialogIcon}>
              <AlertTriangle size={23} />
            </span>
            <h2 id="delete-draft-title">Taklifnomani o‘chirasizmi?</h2>
            <p id="delete-draft-description">
              “
              {getContent(deleteTarget.invitation)
                .people.filter(Boolean)
                .join(" & ") || "Yangi taklifnoma"}
              ” taklifnomasi o‘chiriladi. Uning havolasi ishlamaydi. Bu amalni
              qaytarib bo‘lmaydi.
            </p>
            <div className={styles.dialogActions}>
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={!!actionBusy}
              >
                Bekor qilish
              </button>
              <button
                className={styles.confirmDelete}
                disabled={!!actionBusy}
                onClick={() => {
                  const target = deleteTarget;
                  if (!target) return;
                  setDeleteTarget(null);
                  void removeInvitation(
                    target.invitation,
                    target.local,
                    target.accountSaved,
                  );
                }}
              >
                {actionBusy === deleteTarget.invitation.id ? (
                  "O‘chirilmoqda…"
                ) : (
                  <>
                    <Trash2 size={16} /> O‘chirish
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
