"use client";

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
  Clock3,
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
import { useRouter } from "next/navigation";
import { PublishedLink } from "@/components/published-link";
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
        <Link
          href={onOpenActivity ? activityUrl : editUrl}
          className={styles.cardArt}
          aria-label={
            onOpenActivity
              ? `${names}: javoblar, tilaklar va cheklar`
              : `${names}: taklifnomani tahrirlash`
          }
        >
          {template ? (
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
        </Link>
        <span
          className={styles.cardStatus}
          data-published={invitation.status === "published"}
        >
          {local
            ? accountSaved
              ? "Saqlanmagan o‘zgarishlar"
              : "Qoralama"
            : invitation.status === "published"
              ? "Nashr qilingan"
              : "Qoralama"}
        </span>
      </div>
      <div className={styles.cardBody}>
        <h2 className={styles.invitationName}>{names}</h2>
        <div className={styles.cardName}>
          <strong>{template?.name ?? "Dizayn tanlanmagan"}</strong>
          <span>
            {invitation.enabledLocales.length > 1
              ? `${invitation.enabledLocales.length} til`
              : LANGUAGE_NAMES[invitation.defaultLocale]}
          </span>
        </div>
        <div className={styles.cardMeta}>
          <p className={styles.cardDate}>
            <CalendarDays size={14} />
            {date}
          </p>
          {invitation.status === "published" && viewCount !== undefined && (
            <p
              className={styles.cardViews}
              aria-label={`Ko‘rishlar: ${viewCount}`}
            >
              <Eye size={14} />
              {new Intl.NumberFormat("uz-UZ").format(viewCount)} ko‘rish
            </p>
          )}
        </div>
        {invitation.status === "published" && invitation.slug && (
          <div
            className={styles.shareRow}
            onClick={(event) => event.stopPropagation()}
          >
            <PublishedLink slug={invitation.slug} inline />
          </div>
        )}
        <div className={styles.cardActions}>
          {invitation.status === "published" && invitation.slug ? (
            <Link
              className={styles.viewAction}
              href={
                accountSaved
                  ? activityUrl
                  : `/i/${encodeURIComponent(invitation.slug)}`
              }
              aria-label={
                accountSaved
                  ? `${names}: javoblar, tilaklar va cheklar`
                  : `${names}: taklifnomani ko‘rish`
              }
            >
              {accountSaved ? "Javoblar" : "Ko‘rish"} <ArrowRight size={14} />
            </Link>
          ) : (
            <Link className={styles.continueAction} href={editUrl}>
              Davom etish <ArrowRight size={16} />
            </Link>
          )}
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
              const menu = event.currentTarget;
              if (!menu.matches(":popover-open") || !menuButton.current) return;
              const button = menuButton.current.getBoundingClientRect();
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
            }}
            className={styles.cardMenu}
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("a,button"))
                event.currentTarget.hidePopover();
            }}
          >
            <p className={styles.menuHeading}>{names}</p>
            <Link href={editUrl}>
              <Pencil size={15} /> Tahrirlash
            </Link>
            {accountSaved && invitation.status === "draft" && (
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
      </div>
    </article>
  );
}

export function Dashboard() {
  const router = useRouter();
  const [session, setSession] = useState<SessionResponse | null>(
    dashboardSnapshot?.session ?? null,
  );
  const [invitations, setInvitations] = useState<DashboardInvitation[]>(
    dashboardSnapshot?.invitations ?? [],
  );
  const [browserDrafts, setBrowserDrafts] = useState<BrowserDraft[]>([]);
  const [loading, setLoading] = useState(!dashboardSnapshot);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"all" | "draft" | "published">("all");
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
  ].sort(
    (a, b) =>
      b.createdAt.localeCompare(a.createdAt) ||
      b.invitation.id.localeCompare(a.invitation.id),
  );
  const matchesTab = (invitation: Invitation) =>
    tab === "all" || invitation.status === tab;
  const hasVisibleEntries = entries.some(({ invitation }) =>
    matchesTab(invitation),
  );
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
      <main id="main" className={styles.main}>
        <div className={styles.pageHeading}>
          <div>
            <p>
              {session?.user
                ? `Xush kelibsiz, ${session.user.displayName}`
                : "Quvonchli kuningiz shu yerdan boshlanadi"}
            </p>
            <h1>Taklifnomalarim</h1>
            <span>Har bir muhim kun uchun o‘zgacha taklif.</span>
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
            <Link className={styles.primaryButton} href="/studio?new=1">
              <Plus size={18} />
              Yangi taklifnoma
            </Link>
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
            <div className={styles.listToolbar}>
              <div role="group" aria-label="Taklifnomalarni saralash">
                <button
                  className={tab === "all" ? styles.activeTab : ""}
                  aria-pressed={tab === "all"}
                  onClick={() => setTab("all")}
                >
                  Barchasi{!loading && <span>{count}</span>}
                </button>
                <button
                  className={tab === "draft" ? styles.activeTab : ""}
                  aria-pressed={tab === "draft"}
                  onClick={() => setTab("draft")}
                >
                  Qoralamalar{!loading && <span>{draftCount}</span>}
                </button>
                <button
                  className={tab === "published" ? styles.activeTab : ""}
                  aria-pressed={tab === "published"}
                  onClick={() => setTab("published")}
                >
                  Nashr qilingan{!loading && <span>{publishedCount}</span>}
                </button>
              </div>
              <span className={styles.privateLabel}>
                <Clock3 size={12} />
                Eng yangilari avval
              </span>
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
              <div className={styles.cardGrid}>
                {entries.map(({ invitation, local, viewCount }) => (
                  <InvitationCard
                    invitation={invitation}
                    hidden={!matchesTab(invitation)}
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
                      {tab === "published"
                        ? "Hali nashr qilingan taklifnoma yo‘q"
                        : tab === "draft"
                          ? "Hali qoralamalar yo‘q"
                          : "Birinchi taklifingizni yarating"}
                    </h2>
                    <p>
                      {tab === "published"
                        ? "Tayyor taklifnomalar nashr qilingach shu yerda ko‘rinadi."
                        : tab === "draft"
                          ? "Yangi taklifnoma yarating. Tugallanmagan taklifnomalaringiz shu yerda saqlanadi."
                          : "Dizaynni tanlang, ma’lumotlaringizni kiriting va tayyor taklifnomani mehmonlaringizga ulashing."}
                    </p>
                    <Link href="/studio?new=1" className={styles.primaryButton}>
                      <Plus size={16} />
                      Taklifnoma yaratish
                    </Link>
                    <small>
                      Avval tayyorlashingiz mumkin. Kirish — saqlash paytida.
                    </small>
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
