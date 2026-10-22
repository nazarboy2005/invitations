"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleHelp,
  FileHeart,
  Heart,
  LoaderCircle,
  Clock3,
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
import styles from "./dashboard.module.css";
import {
  listBrowserDrafts,
  type BrowserDraft,
} from "@/modules/studio/draft-storage";
import { formatDate } from "@/templates/date-format";
import { InvitationThumbnail } from "./invitation-thumbnail";
import { useRouter } from "next/navigation";
import { PublishedLink } from "@/components/published-link";

type DeviceSession = {
  id: string;
  userAgent: string;
  createdAt: string;
  lastSeenAt: string;
  expiresAt: string;
  current: boolean;
};
function deviceName(userAgent: string) {
  const browser = /Edg\//.test(userAgent)
    ? "Edge"
    : /Firefox\//.test(userAgent)
      ? "Firefox"
      : /Chrome\//.test(userAgent)
        ? "Chrome"
        : /Safari\//.test(userAgent)
          ? "Safari"
          : "Brauzer";
  const device = /iPhone|iPad/.test(userAgent)
    ? "iOS"
    : /Android/.test(userAgent)
      ? "Android"
      : /Windows/.test(userAgent)
        ? "Windows"
        : /Macintosh/.test(userAgent)
          ? "Mac"
          : "Qurilma";
  return `${browser} / ${device}`;
}

function InvitationCard({
  invitation,
  local = false,
  accountSaved = !local,
}: {
  invitation: Invitation;
  local?: boolean;
  accountSaved?: boolean;
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
  return (
    <article className={styles.invitationCard}>
      <Link
        href={editUrl}
        className={styles.cardArt}
        aria-label={`${names}: taklifnomani tahrirlash`}
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
        {invitation.status === "published" && invitation.slug && (
          <PublishedLink slug={invitation.slug} compact />
        )}
        {accountSaved && invitation.status === "published" && (
          <Link
            className={styles.activityLink}
            href={`/dashboard/${encodeURIComponent(invitation.id)}/activity`}
          >
            Javoblar, tilaklar va cheklar →
          </Link>
        )}
        <div className={styles.cardActions}>
          <span>
            {local
              ? accountSaved
                ? "Brauzerdagi o‘zgarishlar"
                : "Hisobga saqlanmagan"
              : "Hisobingizda saqlangan"}
          </span>
          <Link href={editUrl}>
            {invitation.status === "published" ? "Tahrirlash" : "Davom etish"}
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function Dashboard() {
  const router = useRouter();
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [invitations, setInvitations] = useState<
    Array<Invitation & { createdAt?: string }>
  >([]);
  const [browserDrafts, setBrowserDrafts] = useState<BrowserDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"all" | "draft" | "published">("all");
  const [retry, setRetry] = useState(0);
  const [devices, setDevices] = useState<DeviceSession[]>([]);
  const [deviceError, setDeviceError] = useState("");
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [sessionRefresh, setSessionRefresh] = useState(0);
  const [revoking, setRevoking] = useState(false);
  const [logoutConfirmation, setLogoutConfirmation] = useState(false);
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState("");

  async function startLogin() {
    setLoginBusy(true);
    setLoginError("");
    try {
      const response = await fetch("/api/auth/telegram/start", { method: "POST" });
      const result = await response.json();
      if (!response.ok || !result.loginUrl || !result.requestId) throw new Error();
      const telegramWindow = window.open(result.loginUrl, "_blank", "noopener,noreferrer");
      if (!telegramWindow) window.location.assign(result.loginUrl);
      const deadline = Date.now() + 5 * 60_000;
      while (Date.now() < deadline) {
        await new Promise((resolve) => window.setTimeout(resolve, 2000));
        const status = await fetch(`/api/auth/telegram/status?requestId=${encodeURIComponent(result.requestId)}`, { cache: "no-store" });
        if (!status.ok) throw new Error();
        const state = await status.json();
        if (state.state === "confirmed") {
          const complete = await fetch("/api/auth/telegram/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ requestId: result.requestId }) });
          if (!complete.ok) throw new Error();
          window.location.reload();
          return;
        }
        if (state.state === "expired") throw new Error();
      }
      throw new Error();
    } catch {
      setLoginError("Telegram orqali kirish boshlanmadi yoki vaqt tugadi. Qayta urinib ko‘ring.");
      setLoginBusy(false);
    }
  }

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
        });
        if (!response.ok)
          throw new Error(
            "Hisobingizni tekshirib bo‘lmadi. Ulanishni tekshirib, qayta urinib ko‘ring.",
          );
        const result: SessionResponse = await response.json();
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
          if (alive)
            setInvitations(
              (data.invitations ?? []).filter(
                (item: unknown) => invitationSchema.safeParse(item).success,
              ),
            );
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

  useEffect(() => {
    if (!session?.user) return;
    let alive = true;
    setDevicesLoading(true);
    setDeviceError("");
    fetch("/api/auth/sessions", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then((result) => {
        if (alive) setDevices(result.sessions ?? []);
      })
      .catch(() => {
        if (alive) setDeviceError("Faol qurilmalarni yuklab bo‘lmadi.");
      })
      .finally(() => {
        if (alive) setDevicesLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [session?.user?.id, sessionRefresh]);

  async function revokeSession(id?: string) {
    setRevoking(true);
    setDeviceError("");
    try {
      const response = await fetch("/api/auth/sessions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(id ? { sessionId: id } : {}),
      });
      if (!response.ok) throw new Error();
      if (!id || devices.some((device) => device.id === id && device.current)) {
        setSession((current) =>
          current ? { ...current, user: null } : current,
        );
        setInvitations([]);
        setDevices([]);
        try {
          setBrowserDrafts(listBrowserDrafts());
        } catch {
          setBrowserDrafts([]);
        }
      } else setSessionRefresh((value) => value + 1);
      setLogoutConfirmation(false);
      router.refresh();
    } catch {
      setDeviceError(
        "Qurilmadan chiqish amalga oshmadi. Qayta urinib ko‘ring.",
      );
    } finally {
      setRevoking(false);
    }
  }

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
      createdAt:
        invitation.createdAt ?? localById.get(invitation.id)?.createdAt ?? "",
    })),
    ...localDrafts
      .filter((draft) => !cloudIds.has(draft.invitation.id))
      .map((draft) => ({
        invitation: draft.invitation,
        local: true,
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
          <button className={styles.primaryButton} onClick={createNew}>
            <Plus size={18} />
            Yangi taklifnoma
          </button>
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
              {loginBusy ? <LoaderCircle size={16} /> : <ArrowRight size={16} />}
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
            {loading ? (
              <div className={styles.loading} role="status">
                <LoaderCircle size={23} />
                <span>Taklifnomalar yuklanmoqda…</span>
              </div>
            ) : (
              <div className={styles.cardGrid}>
                {entries.map(({ invitation, local }) => (
                  <InvitationCard
                    invitation={invitation}
                    local={local}
                    accountSaved={cloudIds.has(invitation.id)}
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
                Dizaynni tanlang va o‘z taklifnomangizni yarating. Hozir nashr
                qilish bepul.
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
        {session?.user && (
          <section className={styles.sessions} aria-label="Faol qurilmalar">
            <div className={styles.sessionsHeading}>
              <div>
                <h2>
                  <ShieldCheck size={18} />
                  Faol qurilmalar
                </h2>
                <p>Hisobingizga kirilgan qurilmalarni boshqaring.</p>
              </div>
              <button
                onClick={() => setLogoutConfirmation((value) => !value)}
                disabled={revoking}
              >
                Barcha qurilmalardan chiqish
              </button>
            </div>
            {devicesLoading ? (
              <p className={styles.sessionHint}>Qurilmalar yuklanmoqda…</p>
            ) : (
              devices.map((device) => (
                <div className={styles.device} key={device.id}>
                  <Smartphone size={18} />
                  <div>
                    <strong>
                      {deviceName(device.userAgent)}
                      {device.current && <span>Shu qurilma</span>}
                    </strong>
                    <small>
                      Oxirgi faollik:{" "}
                      {new Date(device.lastSeenAt).toLocaleString("uz-UZ")}
                    </small>
                  </div>
                  <button
                    disabled={revoking}
                    onClick={() => revokeSession(device.id)}
                  >
                    Chiqish
                  </button>
                </div>
              ))
            )}
            {deviceError && (
              <div className={styles.deviceError} role="alert">
                <span>{deviceError}</span>
                <button onClick={() => setSessionRefresh((value) => value + 1)}>
                  Qayta urinish
                </button>
              </div>
            )}
            {logoutConfirmation && (
              <div className={styles.logoutConfirm}>
                <p>
                  Barcha qurilmalarda, shu jumladan shu brauzerda ham hisobdan
                  chiqasiz. Qoralamangiz shu brauzerda qoladi.
                </p>
                <button disabled={revoking} onClick={() => revokeSession()}>
                  {revoking
                    ? "Chiqilmoqda…"
                    : "Ha, barcha qurilmalardan chiqish"}
                </button>
                <button onClick={() => setLogoutConfirmation(false)}>
                  Bekor qilish
                </button>
              </div>
            )}
          </section>
        )}
        <div className={styles.bottomNote}>
          <CheckCircle2 size={15} />
          <p>
            {session?.user
              ? "Qoralamalar faqat sizga ko‘rinadi. Nashr qilingan taklifnomani havolasi orqali mehmonlaringiz ochishi mumkin."
              : "Brauzer qoralamasi faqat shu qurilmada mavjud. Uni boshqa qurilmadan ochish uchun hisobingizga saqlang."}
          </p>
        </div>
      </main>
    </div>
  );
}
