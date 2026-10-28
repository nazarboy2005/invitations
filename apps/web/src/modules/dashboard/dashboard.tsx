"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleHelp,
  EyeOff,
  AlertTriangle,
  X,
  Trash2,
  FileHeart,
  Heart,
  LoaderCircle,
  Clock3,
  Eye,
  Plus,
  Send,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import {
  getContent,
  invitationSchema,
  LANGUAGE_NAMES,
  templateById,
  type Invitation,
  type SessionResponse,
} from "@taklifnoma/contracts";
import {
  paymentStateLabels,
  type InvitationPaymentSummary,
} from "@taklifnoma/contracts/payment";
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
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import {
  loadClientSession,
  currentTelegramLaunchData,
} from "@/modules/session/client-session";
type DashboardInvitation = Invitation & {
  createdAt?: string;
  viewCount?: number;
  payment?: InvitationPaymentSummary | null;
};
let dashboardSnapshot: {
  session: SessionResponse;
  invitations: DashboardInvitation[];
  publishingMode: "free" | "paid";
} | null = null;
function InvitationCard({
  invitation,
  local = false,
  accountSaved = !local,
  onDelete,
  onUnpublish,
  onRepublish,
  busy = false,
  onOpenActivity,
  viewCount,
  payment,
  publishingMode,
}: {
  invitation: Invitation;
  local?: boolean;
  accountSaved?: boolean;
  onDelete?: () => void;
  onUnpublish?: () => void;
  onRepublish?: () => void;
  busy?: boolean;
  onOpenActivity?: () => void;
  viewCount?: number;
  payment?: InvitationPaymentSummary | null;
  publishingMode: "free" | "paid";
}) {
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
  const paid = payment?.status === "SUCCEEDED";
  const retryable =
    !payment || ["FAILED", "CANCELLED", "EXPIRED"].includes(payment.status);
  const pending =
    payment &&
    ["CREATED", "PENDING", "PROCESSING", "REJECTED"].includes(payment.status);
  const paymentAction =
    accountSaved &&
    !local &&
    invitation.status === "draft" &&
    !!invitation.templateId &&
    !paid &&
    (publishingMode === "paid" || !!payment);
  const paymentUrl =
    payment && !retryable
      ? `/payment/return?order=${encodeURIComponent(payment.id)}`
      : `/payment/return?invitation=${encodeURIComponent(invitation.id)}`;
  return (
    <article
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
            "a,button,input,select,textarea",
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
          <InvitationThumbnail invitation={invitation} />
        ) : (
          <span className={styles.noTemplateLabel}>
            <FileHeart size={26} />
            Dizayn tanlanmagan
          </span>
        )}
      </Link>
      <div className={styles.cardBody}>
        {invitation.status === "draft" && onDelete && (
          <button
            className={styles.draftDeleteIcon}
            onClick={onDelete}
            disabled={busy}
            aria-label="Qoralamani o‘chirish"
            title="Qoralamani o‘chirish"
          >
            <Trash2 size={16} />
          </button>
        )}
        <span
          className={styles.cardStatus}
          data-published={invitation.status === "published"}
        >
          {local
            ? accountSaved
              ? "Saqlanmagan o‘zgarishlar"
              : "Brauzerdagi qoralama"
            : invitation.status === "published"
              ? "Nashr qilingan"
              : invitation.status === "archived"
                ? "Arxivlangan"
                : "Qoralama"}
        </span>
        <h2 className={styles.invitationName}>{names}</h2>
        <div className={styles.cardName}>
          <strong>{template?.name ?? "Dizayn tanlanmagan"}</strong>
          <span>
            {invitation.enabledLocales.length > 1
              ? `${invitation.enabledLocales.length} til`
              : LANGUAGE_NAMES[invitation.defaultLocale]}
          </span>
        </div>
        <p className={styles.cardDate}>
          <CalendarDays size={14} />
          {date}
        </p>
        {accountSaved && payment && (
          <p className={styles.cardPayment} data-paid={paid}>
            {paid ? (
              <CheckCircle2 size={13} aria-hidden="true" />
            ) : (
              <Clock3 size={13} aria-hidden="true" />
            )}
            {paid ? "To‘langan" : paymentStateLabels[payment.status]}
          </p>
        )}
        {invitation.status === "published" && viewCount !== undefined && (
          <p
            className={styles.cardViews}
            aria-label={`Ko‘rishlar: ${viewCount}`}
          >
            <Eye size={14} />
            {new Intl.NumberFormat("uz-UZ").format(viewCount)} ko‘rish
          </p>
        )}
        {invitation.status === "published" && invitation.slug && (
          <div onClick={(event) => event.stopPropagation()}>
            <PublishedLink slug={invitation.slug} compact />
          </div>
        )}
        {accountSaved && invitation.status === "published" && (
          <Link className={styles.activityLink} href={activityUrl}>
            Javoblar, tilaklar va cheklar →
          </Link>
        )}
        <div className={styles.cardActions}>
          {invitation.status === "published" && onUnpublish && (
            <button
              className={styles.secondaryAction}
              onClick={onUnpublish}
              disabled={busy}
            >
              <EyeOff size={14} /> Nashrdan olish
            </button>
          )}
          {invitation.status === "archived" && onRepublish && (
            <button
              className={styles.secondaryAction}
              onClick={onRepublish}
              disabled={busy}
            >
              {busy ? <LoaderCircle size={14} /> : <Send size={14} />}
              {busy ? "Nashr qilinmoqda…" : "Qayta nashr qilish"}
            </button>
          )}
          {paymentAction && (
            <Link href={editUrl} className={styles.secondaryAction}>
              Tahrirlash
            </Link>
          )}
          <Link
            href={paymentAction ? paymentUrl : editUrl}
            className={paymentAction ? styles.paymentAction : undefined}
          >
            {paymentAction
              ? pending
                ? "To‘lovni yakunlash"
                : retryable
                  ? "To‘lov qilish"
                  : "To‘lov tafsilotlari"
              : invitation.status === "published"
                ? "Tahrirlash"
                : paid && invitation.status === "draft"
                  ? "Nashrni yakunlash"
                  : "Davom etish"}
            {!paymentAction && <ArrowRight size={15} aria-hidden="true" />}
          </Link>
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
  const [publishingMode, setPublishingMode] = useState<"free" | "paid">(
    dashboardSnapshot?.publishingMode ?? "free",
  );
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
  const [unpublishTarget, setUnpublishTarget] = useState<Invitation | null>(
    null,
  );

  async function removeDraft(
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
            "Qoralamani o‘chirib bo‘lmadi. Qayta urinib ko‘ring.",
          );
        setInvitations((items) => {
          const next = items.filter((item) => item.id !== invitation.id);
          if (dashboardSnapshot)
            dashboardSnapshot = { ...dashboardSnapshot, invitations: next };
          return next;
        });
      }
      if (local) {
        deleteBrowserDraft(invitation.id);
        setBrowserDrafts(listBrowserDrafts(session?.user?.id ?? null));
      }
    } catch (cause) {
      setActionError(
        cause instanceof Error ? cause.message : "Amal bajarilmadi.",
      );
    } finally {
      setActionBusy(null);
    }
  }

  async function unpublishInvitation(invitation: Invitation) {
    setActionBusy(invitation.id);
    setActionError("");
    try {
      const response = await fetch(
        `/api/invitations/${encodeURIComponent(invitation.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "unpublish" }),
        },
      );
      if (!response.ok)
        throw new Error(
          "Taklifnomani nashrdan olib bo‘lmadi. Qayta urinib ko‘ring.",
        );
      setInvitations((items) => {
        const next = items.map((item) =>
          item.id === invitation.id
            ? { ...item, status: "archived" as const }
            : item,
        );
        if (dashboardSnapshot)
          dashboardSnapshot = { ...dashboardSnapshot, invitations: next };
        return next;
      });
      setBrowserDrafts((items) =>
        items.filter((item) => item.invitation.id !== invitation.id),
      );
    } catch (cause) {
      setActionError(
        cause instanceof Error ? cause.message : "Amal bajarilmadi.",
      );
    } finally {
      setActionBusy(null);
    }
  }

  async function republishInvitation(invitation: Invitation) {
    setActionBusy(invitation.id);
    setActionError("");
    try {
      const response = await fetch(
        `/api/invitations/${encodeURIComponent(invitation.id)}/publish`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: invitation.revision }),
        },
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error?.message ??
            "Taklifnomani qayta nashr qilib bo‘lmadi. Qayta urinib ko‘ring.",
        );
      const published = invitationSchema.parse(result.invitation);
      setInvitations((items) => {
        const next = items.map((item) =>
          item.id === invitation.id ? { ...item, ...published } : item,
        );
        if (dashboardSnapshot)
          dashboardSnapshot = { ...dashboardSnapshot, invitations: next };
        return next;
      });
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
            const nextInvitations = (data.invitations ?? []).filter(
              (item: unknown) => invitationSchema.safeParse(item).success,
            ) as DashboardInvitation[];
            dashboardSnapshot = {
              session: result,
              invitations: nextInvitations,
              publishingMode: data.publishingMode === "paid" ? "paid" : "free",
            };
            setPublishingMode(dashboardSnapshot.publishingMode);
            setInvitations(nextInvitations);
          }
        } else {
          dashboardSnapshot = {
            session: result,
            invitations: [],
            publishingMode: "free",
          };
          setPublishingMode("free");
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
      payment: invitation.payment,
      createdAt:
        invitation.createdAt ?? localById.get(invitation.id)?.createdAt ?? "",
    })),
    ...localDrafts
      .filter((draft) => !cloudIds.has(draft.invitation.id))
      .map((draft) => ({
        invitation: draft.invitation,
        local: true,
        viewCount: undefined,
        payment: undefined,
        createdAt: draft.createdAt || draft.savedAt,
      })),
  ]
    .filter(
      ({ invitation }) =>
        tab === "all" ||
        (tab === "draft"
          ? invitation.status === "draft"
          : invitation.status === "published"),
    )
    .sort(
      (a, b) =>
        b.createdAt.localeCompare(a.createdAt) ||
        b.invitation.id.localeCompare(a.invitation.id),
    );
  const count =
    invitations.length +
    browserDrafts.filter((draft) => !cloudIds.has(draft.invitation.id)).length;
  function createNew() {
    window.location.assign("/#templates");
  }

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
            <button className={styles.primaryButton} onClick={createNew}>
              <Plus size={18} />
              Yangi taklifnoma
            </button>
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
                  Qoralamalar
                </button>
                <button
                  className={tab === "published" ? styles.activeTab : ""}
                  aria-pressed={tab === "published"}
                  onClick={() => setTab("published")}
                >
                  Nashr qilingan
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
                {entries.map(({ invitation, local, viewCount, payment }) => (
                  <InvitationCard
                    invitation={invitation}
                    local={local}
                    viewCount={viewCount}
                    payment={payment}
                    publishingMode={publishingMode}
                    accountSaved={cloudIds.has(invitation.id)}
                    busy={actionBusy === invitation.id}
                    onDelete={
                      invitation.status === "draft"
                        ? () =>
                            setDeleteTarget({
                              invitation,
                              local,
                              accountSaved: cloudIds.has(invitation.id),
                            })
                        : undefined
                    }
                    onUnpublish={
                      invitation.status === "published" &&
                      cloudIds.has(invitation.id)
                        ? () => setUnpublishTarget(invitation)
                        : undefined
                    }
                    onRepublish={
                      invitation.status === "archived" &&
                      cloudIds.has(invitation.id)
                        ? () => {
                            const saved = invitations.find(
                              (item) => item.id === invitation.id,
                            );
                            if (saved) void republishInvitation(saved);
                          }
                        : undefined
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
                {entries.length === 0 && !error && (
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
                        : "Birinchi taklifingizni yarating"}
                    </h2>
                    <p>
                      {tab === "published"
                        ? "Tayyor taklifnomalar nashr qilingach shu yerda ko‘rinadi."
                        : "Dizaynni tanlang, ma’lumotlaringizni kiriting va tayyor taklifnomani mehmonlaringizga ulashing."}
                    </p>
                    <Link href="/studio" className={styles.primaryButton}>
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
          <aside className={styles.helpSidebar}>
            {session?.user?.isAdmin && (
              <a href="/admin" className={styles.tip}>
                <ShieldCheck size={19} aria-hidden="true" />
                <div>
                  <strong>Sayt boshqaruvi</strong>
                  <p>Dizaynlar, kategoriyalar va musiqa kutubxonasi.</p>
                </div>
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            )}
            <div className={styles.guide}>
              <span className={styles.guideIcon}>
                <Heart size={21} />
              </span>
              <h2>
                Bir taklif.
                <br />
                Mingta samimiy lahza.
              </h2>
              <p>
                Dizaynni tanlang, taklifnomangizni tayyorlang va yaqinlaringiz
                bilan ulashing.
              </p>
              <Link href="/#templates">
                Dizaynlarni ko‘rish
                <ArrowRight size={15} />
              </Link>
            </div>
            <div className={styles.tip}>
              <ShieldCheck size={19} />
              <div>
                <strong>Tilaklar sizning nazoratingizda</strong>
                <p>
                  Mehmonlarning tilaklari faqat tasdiqlashingizdan keyin
                  taklifnomada ko‘rinadi.
                </p>
              </div>
            </div>
            <div className={styles.tip}>
              <Smartphone size={19} />
              <div>
                <strong>Telefon uchun ham qulay</strong>
                <p>
                  Yaratish paytida taklifnomangizni jonli ko‘rinishda
                  tekshiring.
                </p>
              </div>
            </div>
            <div className={styles.helpFooter}>
              <CircleHelp size={16} />
              <span>
                Qoralamalar va nashr qilingan takliflar shu yerda saqlanadi.
              </span>
            </div>
          </aside>
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
            <h2 id="delete-draft-title">Qoralamani o‘chirasizmi?</h2>
            <p id="delete-draft-description">
              “
              {getContent(deleteTarget.invitation)
                .people.filter(Boolean)
                .join(" & ") || "Yangi taklifnoma"}
              ” qoralamasi butunlay o‘chiriladi. Bu amalni qaytarib bo‘lmaydi.
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
                  void removeDraft(
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
      {unpublishTarget && (
        <ConfirmationDialog
          title="Taklifnomani nashrdan olasizmi?"
          description="Uning havolasi saqlanadi, ammo mehmonlar sahifani ko‘ra olmaydi."
          confirmLabel="Nashrdan olish"
          onCancel={() => setUnpublishTarget(null)}
          onConfirm={() => {
            const target = unpublishTarget;
            setUnpublishTarget(null);
            void unpublishInvitation(target);
          }}
          busy={actionBusy === unpublishTarget.id}
        />
      )}
    </div>
  );
}
