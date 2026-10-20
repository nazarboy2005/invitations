"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  CheckCircle2,
  ChevronRight,
  Eye,
  Globe2,
  Heart,
  ImagePlus,
  LayoutTemplate,
  LoaderCircle,
  MapPin,
  Music2,
  Plus,
  Save,
  Send,
  Settings2,
  ShieldCheck,
  Smartphone,
  Trash2,
  Users,
  X,
} from "lucide-react";
import {
  addLanguage,
  createInvitation,
  formatPrice,
  getContent,
  invitationSchema,
  LANGUAGE_NAMES,
  LOCALES,
  switchTemplate,
  TEMPLATE_CATEGORIES,
  templateIdSchema,
  type Invitation,
  type InvitationContent,
  type Locale,
  type SessionResponse,
  type TemplateDefinition,
  type TemplateCategory,
} from "@taklifnoma/contracts";
import styles from "./studio.module.css";
import { readBrowserDraft, saveBrowserDraft } from "./draft-storage";
import { AnorInvitation } from "@/templates/anor";
import {
  createTemplatePreviewSample,
  hasAuthoredInvitationContent,
} from "@/modules/catalog/preview-sample";

const sections = [
  {
    icon: Users,
    title: "Asosiy ma’lumotlar",
    short: "Ma’lumotlar",
    note: "Ismlar va taklif matni",
  },
  {
    icon: MapPin,
    title: "Dastur va manzil",
    short: "Manzil",
    note: "Qachon va qayerda",
  },
  {
    icon: LayoutTemplate,
    title: "Dizayn tanlash",
    short: "Dizayn",
    note: "O‘zingizga mos uslub",
  },
  {
    icon: Settings2,
    title: "Rasmlar va imkoniyatlar",
    short: "Imkoniyatlar",
    note: "Taklifingizga shaxsiylik qo‘shing",
  },
];

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
function Toggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className={styles.toggle}>
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className={styles.switch} aria-hidden="true" />
    </label>
  );
}

export function Studio({
  initialInvitation,
}: {
  initialInvitation?: Invitation;
}) {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [locale, setLocale] = useState<Locale>(
    initialInvitation?.defaultLocale ?? "uz-Latn",
  );
  const [section, setSection] = useState(0);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [saved, setSaved] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [auth, setAuth] = useState<{
    loginUrl: string;
    requestId: string;
    code: string;
  } | null>(null);
  const [authIdentity, setAuthIdentity] = useState<{
    displayName: string;
  } | null>(null);
  const [authStatus, setAuthStatus] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [audioPreview, setAudioPreview] = useState("");
  const [audioName, setAudioName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [templates, setTemplates] = useState<TemplateDefinition[]>([]);
  const [categories, setCategories] =
    useState<TemplateCategory[]>(TEMPLATE_CATEGORIES);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [catalogNote, setCatalogNote] = useState("");
  const invitationRef = useRef(invitation);
  const lastCloudSnapshot = useRef(
    initialInvitation ? JSON.stringify(initialInvitation) : "",
  );
  const ownerId = useRef<string | null>(
    initialInvitation ? "unavailable-private-owner" : null,
  );
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  invitationRef.current = invitation;

  useEffect(() => {
    let alive = true;
    async function recover() {
      function bindDraftUrl(id: string) {
        if (initialInvitation) return;
        const url = new URL(window.location.href);
        url.searchParams.delete("new");
        url.searchParams.delete("useTemplate");
        url.searchParams.set("draft", id);
        window.history.replaceState(
          window.history.state,
          "",
          `${url.pathname}${url.search}${url.hash}`,
        );
      }
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
        });
        if (response.ok) {
          const session: SessionResponse = await response.json();
          ownerId.current =
            session.user?.id ??
            (initialInvitation ? "unavailable-private-owner" : null);
        }
      } catch {
        /* Private stored drafts stay hidden if account identity cannot be checked. */
      }
      if (!alive) return;
      try {
        const fresh =
          new URLSearchParams(window.location.search).get("new") === "1";
        const requestedId =
          new URLSearchParams(window.location.search).get("draft") ?? undefined;
        const requestedTemplate = templateIdSchema.safeParse(
          new URLSearchParams(window.location.search).get("useTemplate"),
        );
        const stored = fresh
          ? null
          : readBrowserDraft(
              initialInvitation?.id ?? requestedId,
              ownerId.current,
            );
        if (stored && (!initialInvitation || stored.dirty)) {
          const restoredInvitation = requestedTemplate.success
            ? switchTemplate(stored.invitation, requestedTemplate.data)
            : stored.invitation;
          setInvitation(restoredInvitation);
          setLocale(restoredInvitation.defaultLocale);
          bindDraftUrl(stored.invitation.id);
          setNotice(
            "Shu brauzerdagi saqlanmagan o‘zgartirishlaringiz tiklandi.",
          );
          return;
        }
      } catch {
        setError(
          "Oldingi qoralamani o‘qib bo‘lmadi. Yangi ma’lumotlar kiritishingiz mumkin.",
        );
      }
      if (initialInvitation) {
        setInvitation(initialInvitation);
        setLocale(initialInvitation.defaultLocale);
        return;
      }
      const template = new URLSearchParams(window.location.search).get(
        "template",
      );
      const selected = templateIdSchema.safeParse(template);
      const created = createInvitation(selected.success ? selected.data : "");
      setInvitation(created);
      try {
        saveBrowserDraft(created, true, ownerId.current);
      } catch {
        setError(
          "Brauzerga saqlash imkoni yo‘q. Zaxira uchun qoralamangizni yuklab oling.",
        );
      }
      bindDraftUrl(created.id);
    }
    void recover();
    return () => {
      alive = false;
    };
  }, [initialInvitation]);

  useEffect(() => {
    let alive = true;
    fetch("/api/catalog", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then((result) => {
        if (alive && Array.isArray(result.templates)) {
          setTemplates(result.templates);
          if (Array.isArray(result.categories))
            setCategories(
              [...result.categories].sort(
                (a: TemplateCategory, b: TemplateCategory) =>
                  a.position - b.position || a.name.localeCompare(b.name),
              ),
            );
          if (!result.configured)
            setCatalogNote(
              "Dizaynlar qo‘shilgach, ular shu yerda ko‘rinadi. Ma’lumotlaringizni hozirdan qoralama sifatida saqlashingiz mumkin.",
            );
        }
      })
      .catch(() => {
        if (alive)
          setCatalogNote(
            "Dizaynlar ro‘yxatini yuklab bo‘lmadi. Ma’lumotlaringizni qoralama sifatida saqlashingiz mumkin.",
          );
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!invitation) return;
    setSaved("Saqlanmoqda…");
    const timer = window.setTimeout(() => {
      try {
        saveBrowserDraft(
          invitation,
          JSON.stringify(invitation) !== lastCloudSnapshot.current,
          ownerId.current,
        );
        setSaved("Shu brauzerda saqlandi");
      } catch {
        setSaved("Brauzerga saqlanmadi");
        setError(
          "Brauzer xotirasi to‘lgan yoki saqlashga ruxsat yo‘q. Hisobingizga saqlashni tanlang.",
        );
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [invitation]);

  useEffect(() => {
    const flush = () => {
      const current = invitationRef.current;
      if (current)
        try {
          saveBrowserDraft(
            current,
            JSON.stringify(current) !== lastCloudSnapshot.current,
            ownerId.current,
          );
        } catch {
          /* Preserve existing stored content when quota/storage is unavailable. */
        }
    };
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, []);

  useEffect(
    () => () => {
      if (audioPreview) URL.revokeObjectURL(audioPreview);
    },
    [audioPreview],
  );

  useEffect(() => {
    if (!auth) return;
    previousFocus.current = document.activeElement as HTMLElement;
    dialogRef.current?.querySelector<HTMLElement>("button, a")?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAuth(null);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const elements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), input, select, textarea, [tabindex="0"]',
        ),
      );
      const first = elements[0],
        last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
      previousFocus.current?.focus();
    };
  }, [auth]);

  useEffect(() => {
    if (!auth || authIdentity) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      try {
        const response = await fetch(
          `/api/auth/telegram/status?requestId=${encodeURIComponent(auth!.requestId)}`,
          { cache: "no-store" },
        );
        const result = await response.json();
        if (cancelled) return;
        if (result.state === "confirmed") {
          setAuthIdentity({
            displayName:
              result.user?.displayName ??
              result.displayName ??
              "Telegram foydalanuvchisi",
          });
          setAuthStatus(
            "Telegram tasdiqladi. Hisobingizni tekshiring va davom eting.",
          );
          return;
        }
        if (result.state === "expired") {
          setAuthStatus(
            "Kirish havolasining muddati tugadi. Oynani yoping va qayta saqlashni bosing.",
          );
          return;
        }
        if (!response.ok)
          setAuthStatus("Tekshirish vaqtincha ishlamadi. Qayta urinilmoqda…");
      } catch {
        if (!cancelled)
          setAuthStatus("Ulanish kutilmoqda. Qoralamangiz saqlangan.");
      }
      if (!cancelled) timer = setTimeout(poll, 3000);
    }
    void poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [auth, authIdentity]);

  if (!invitation)
    return (
      <div className={styles.loading}>
        <LoaderCircle size={24} className={styles.spinner} />
        <p>Taklifnomangiz tayyorlanmoqda…</p>
      </div>
    );
  const content = getContent(invitation, locale);
  const selectedTemplate = templates.find(
    (item) => item.id === invitation.templateId,
  );
  const authoredPreview = hasAuthoredInvitationContent(invitation);
  const previewInvitation =
    section === 2 && !authoredPreview
      ? createTemplatePreviewSample(invitation.templateId)
      : invitation;
  const identityLocked = invitation.status !== "draft";
  function update(patch: Partial<Invitation>) {
    setInvitation((current) => (current ? { ...current, ...patch } : current));
  }
  function updateContent(patch: Partial<InvitationContent>) {
    setInvitation((current) =>
      current
        ? {
            ...current,
            content: {
              ...current.content,
              [locale]: { ...getContent(current, locale), ...patch },
            },
          }
        : current,
    );
  }
  function person(index: number, value: string) {
    const people = [...content.people];
    people[index] = value;
    updateContent({ people });
  }
  function moveProgram(index: number, direction: number) {
    const program = [...invitation!.program];
    const target = index + direction;
    if (target < 0 || target >= program.length) return;
    [program[index], program[target]] = [program[target], program[index]];
    update({ program });
  }
  async function cloudSave() {
    const current = invitationRef.current;
    if (!current) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const sessionResponse = await fetch("/api/auth/session", {
        cache: "no-store",
      });
      if (!sessionResponse.ok)
        throw new Error(
          "Hisobni tekshirib bo‘lmadi. Qoralamangiz brauzerda saqlanmoqda.",
        );
      const session: SessionResponse = await sessionResponse.json();
      if (!session.user) {
        if (!session.configured) {
          setNotice(
            "Telegram orqali saqlash hozircha sozlanmagan. Qoralamangiz shu brauzerda saqlanadi.",
          );
          return;
        }
        const response = await fetch("/api/auth/telegram/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ draftId: current.id }),
        });
        const result = await response.json();
        if (!response.ok || !result.loginUrl)
          throw new Error(
            "Telegram orqali kirishni boshlab bo‘lmadi. Qayta urinib ko‘ring.",
          );
        setAuth(result);
        setAuthIdentity(null);
        setAuthStatus(
          "Botda kirishni tasdiqlang va o‘z telefon raqamingizni ulashing.",
        );
        return;
      }
      if (!session.user.phoneShared)
        throw new Error(
          "Saqlash uchun Telegram botimizda o‘z telefon raqamingizni ulashing.",
        );
      if (
        ownerId.current &&
        ownerId.current !== "unavailable-private-owner" &&
        ownerId.current !== session.user.id
      )
        throw new Error(
          "Bu oynada hisob almashgan. Qoralamangizni yo‘qotmaslik uchun uni yuklab oling va oldingi Telegram hisobingiz bilan qayta kiring.",
        );
      ownerId.current = session.user.id;
      const checked = invitationSchema.safeParse(current);
      if (!checked.success)
        throw new Error(
          "Ma’lumotlar saqlashga tayyor emas. Xarita va rasm havolalarini hamda kiritilgan maydonlarni tekshiring.",
        );
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitation: current }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        if (response.status === 409)
          throw new Error(
            "Taklifnoma boshqa oynada o‘zgartirilgan. Sizning o‘zgartirishlaringiz shu brauzerda saqlandi. Sahifani qayta yuklashdan oldin qoralamangizni yuklab oling va yangilangan taklifnoma bilan solishtiring.",
          );
        throw new Error(
          result.message ??
            "Hisobingizga saqlanmadi. Qoralamangiz shu brauzerda saqlangan; qayta urinib ko‘ring.",
        );
      }
      const result = await response.json();
      if (result.invitation) {
        lastCloudSnapshot.current = JSON.stringify(result.invitation);
        const changedDuringSave =
          JSON.stringify(invitationRef.current) !== JSON.stringify(current);
        if (!changedDuringSave) setInvitation(result.invitation);
        else if (invitationRef.current)
          setInvitation({
            ...invitationRef.current,
            revision: result.invitation.revision,
          });
        try {
          saveBrowserDraft(
            changedDuringSave && invitationRef.current
              ? {
                  ...invitationRef.current,
                  revision: result.invitation.revision,
                }
              : result.invitation,
            changedDuringSave,
            ownerId.current,
          );
        } catch {
          /* Cloud save has succeeded even if browser storage is unavailable. */
        }
        if (changedDuringSave) {
          setNotice(
            "Saqlash paytida yana o‘zgartirish kiritdingiz. So‘nggi o‘zgartirishlar brauzerda saqlangan; hisobingizga saqlashni yana bosing.",
          );
          return;
        }
      }
      setNotice(
        "Taklifnomangiz hisobingizga saqlandi. Uni “Taklifnomalarim” bo‘limidan topasiz.",
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Saqlash vaqtincha ishlamadi. Qayta urinib ko‘ring.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function completeLogin() {
    if (!auth) return;
    setBusy(true);
    try {
      const response = await fetch("/api/auth/telegram/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: auth.requestId }),
      });
      if (!response.ok)
        throw new Error(
          "Kirish yakunlanmadi. Botdagi tasdiqlash va telefon ulashishni tekshiring.",
        );
      setAuth(null);
      setAuthIdentity(null);
      await cloudSave();
    } catch (cause) {
      setAuthStatus(
        cause instanceof Error ? cause.message : "Qayta urinib ko‘ring.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function upload(file: File, kind: "image" | "audio") {
    if (!invitationRef.current) return;
    setError("");
    const mimeFallback: Record<string, string> = {
      mp3: "audio/mpeg",
      m4a: "audio/mp4",
      wav: "audio/wav",
      ogg: "audio/ogg",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    };
    const contentType =
      file.type ||
      mimeFallback[file.name.split(".").pop()?.toLowerCase() ?? ""] ||
      "";
    if (
      (kind === "image" &&
        !["image/jpeg", "image/png", "image/webp"].includes(contentType)) ||
      (kind === "audio" && !contentType.startsWith("audio/"))
    ) {
      setError(
        "Mos fayl tanlang: rasm uchun JPG, PNG yoki WebP; musiqa uchun audio fayl.",
      );
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError("Fayl 15 MB dan kichik bo‘lishi kerak.");
      return;
    }
    if (kind === "audio") {
      setAudioPreview(URL.createObjectURL(file));
      setAudioName(file.name);
    }
    setUploading(true);
    try {
      const response = await fetch("/api/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          size: file.size,
          contentType,
          kind,
          draftId: invitationRef.current.id,
        }),
      });
      const prepared = await response.json();
      if (!response.ok || !prepared.upload?.url)
        throw new Error(
          "Faylni yuklash hozircha mavjud emas. Hisobingizga kirganingizni tekshiring va qayta urinib ko‘ring.",
        );
      const uploaded = await fetch(prepared.upload.url, {
        method: "PUT",
        headers: prepared.upload.headers,
        body: file,
      });
      if (!uploaded.ok)
        throw new Error(
          "Fayl yuklanmadi. Ulanishni tekshirib, qayta urinib ko‘ring.",
        );
      const complete = await fetch(prepared.upload.completeUrl, {
        method: "POST",
      });
      const result = await complete.json();
      if (!complete.ok || !result.asset?.url)
        throw new Error(
          "Faylni tekshirish yakunlanmadi. Mos formatdagi fayl bilan qayta urinib ko‘ring.",
        );
      const current = invitationRef.current;
      if (kind === "audio") {
        update({
          music: {
            enabled: true,
            assetId: result.asset.id,
            url: result.asset.url,
            filename: file.name,
          },
        });
        setAudioPreview("");
      } else
        update({
          gallery: [
            ...current.gallery,
            {
              id: result.asset.id ?? crypto.randomUUID(),
              url: result.asset.url,
              alt: "",
              caption: "",
            },
          ],
        });
      setNotice("Fayl yuklandi. Taklifnomani hisobingizga saqlashni unutmang.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Fayl yuklanmadi.");
    } finally {
      setUploading(false);
    }
  }
  function exportDraft() {
    const current = invitationRef.current;
    if (!current) return;
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(current, null, 2)], {
        type: "application/json",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `taklifnoma-${current.id}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className={styles.studio}>
      <header className={styles.topbar}>
        <Link href="/dashboard" className={styles.back}>
          <ArrowLeft size={19} />
          <span>Taklifnomalarim</span>
        </Link>
        <div className={styles.documentName}>
          <span className={styles.documentIcon}>
            <Heart size={17} />
          </span>
          <span>
            Yangi taklifnoma
            <small aria-live="polite">
              <CheckCircle2 size={12} />
              {saved}
            </small>
          </span>
        </div>
        <button
          className={styles.saveButton}
          onClick={cloudSave}
          disabled={busy}
        >
          <Save size={16} />
          {busy ? "Saqlanmoqda…" : "Hisobimga saqlash"}
        </button>
      </header>
      <div className={styles.mobileTabs}>
        <button
          className={!mobilePreview ? styles.activeMobile : ""}
          aria-pressed={!mobilePreview}
          onClick={() => setMobilePreview(false)}
        >
          <Settings2 size={16} />
          Tahrirlash
        </button>
        <button
          className={mobilePreview ? styles.activeMobile : ""}
          aria-pressed={mobilePreview}
          onClick={() => setMobilePreview(true)}
        >
          <Eye size={16} />
          Ko‘rinishi
        </button>
      </div>
      <div className={styles.workspace}>
        <aside
          className={`${styles.sidebar} ${mobilePreview ? styles.mobileHidden : ""}`}
          aria-label="Tahrirlash bo‘limlari"
        >
          <p className={styles.sidebarTitle}>Taklifnomani yarating</p>
          <nav>
            {sections.map((item, index) => (
              <button
                key={item.title}
                className={`${styles.sectionButton} ${section === index ? styles.activeSection : ""}`}
                onClick={() => setSection(index)}
                aria-current={section === index ? "step" : undefined}
              >
                <span className={styles.sectionNumber}>{index + 1}</span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.note}</small>
                </span>
                {section === index && <ChevronRight size={15} />}
              </button>
            ))}
          </nav>
          <div className={styles.sidebarNote}>
            <ShieldCheck size={22} />
            <p>
              Avval tayyorlang.
              <br />
              Keyin hisobingizga saqlang.
            </p>
            <small>
              Kiritgan ma’lumotlaringiz dizaynni almashtirganda ham saqlanadi.
            </small>
          </div>
        </aside>
        <main
          id="main"
          className={`${styles.editor} ${mobilePreview ? styles.mobileHidden : ""}`}
        >
          <div className={styles.editorIntro}>
            <span className={styles.step}>Qadam {section + 1} / 4</span>
            <h1>{sections[section].title}</h1>
            <p>
              {
                [
                  "Eng chiroyli taklif o‘z so‘zlaringizdan boshlanadi.",
                  "Mehmonlaringiz barcha kerakli ma’lumotni bir joyda topsin.",
                  "Ma’lumotlaringiz o‘zgarmaydi. Faqat yangi ko‘rinish tanlang.",
                  "Faqat o‘zingizga kerakli imkoniyatlarni yoqing.",
                ][section]
              }
            </p>
          </div>
          <div aria-live="polite">
            {notice && (
              <div className={styles.notice}>
                <CheckCircle2 size={18} />
                <span>{notice}</span>
                <button
                  aria-label="Xabarni yopish"
                  onClick={() => setNotice("")}
                >
                  <X size={16} />
                </button>
              </div>
            )}
            {error && (
              <div className={styles.error} role="alert">
                <span>{error}</span>
                <button aria-label="Xatoni yopish" onClick={() => setError("")}>
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
          {section !== 2 && (
            <div className={styles.languages}>
              <Globe2 size={16} />
              <div className={styles.languageTabs}>
                {invitation.enabledLocales.map((item) => (
                  <button
                    key={item}
                    className={locale === item ? styles.activeLanguage : ""}
                    aria-pressed={locale === item}
                    onClick={() => setLocale(item)}
                  >
                    {LANGUAGE_NAMES[item]}
                    {item === invitation.defaultLocale && (
                      <span className={styles.primaryDot} title="Asosiy til" />
                    )}
                  </button>
                ))}
              </div>
              {invitation.enabledLocales.length < 4 && (
                <select
                  aria-label="Til qo‘shish"
                  value=""
                  onChange={(event) => {
                    const next = event.target.value as Locale;
                    setInvitation(addLanguage(invitation, next));
                    setLocale(next);
                  }}
                >
                  <option value="" disabled>
                    + Til qo‘shish
                  </option>
                  {LOCALES.filter(
                    (item) => !invitation.enabledLocales.includes(item),
                  ).map((item) => (
                    <option value={item} key={item}>
                      {LANGUAGE_NAMES[item]}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {section === 0 && (
            <div className={styles.form}>
              {invitation.enabledLocales.length > 1 && (
                <div className={styles.languageHint}>
                  <span>
                    {LANGUAGE_NAMES[locale]} matnlarini kiriting. Sana, rasmlar
                    va boshqa umumiy ma’lumotlar barcha tillarda bir xil.
                  </span>
                  <button
                    onClick={() => update({ defaultLocale: locale })}
                    disabled={locale === invitation.defaultLocale}
                  >
                    {locale === invitation.defaultLocale
                      ? "Asosiy til"
                      : "Asosiy til qilish"}
                  </button>
                </div>
              )}
              <Field label="Tadbir turi">
                <select
                  value={invitation.eventType}
                  disabled={identityLocked}
                  onChange={(event) =>
                    update({
                      eventType: event.target.value as Invitation["eventType"],
                    })
                  }
                >
                  <option value="wedding">Nikoh to‘yi</option>
                  <option value="birthday">Tug‘ilgan kun</option>
                  <option value="osh">Nahorgi osh</option>
                  <option value="qiz-bazmi">Qiz bazmi</option>
                  <option value="other">Boshqa tadbir</option>
                </select>
              </Field>
              <div className={styles.groupHeader}>
                <h2>Kimning quvonchli kuni?</h2>
                <button
                  className={styles.textButton}
                  disabled={identityLocked || content.people.length >= 20}
                  onClick={() =>
                    updateContent({ people: [...content.people, ""] })
                  }
                >
                  <Plus size={15} />
                  Ism qo‘shish
                </button>
              </div>
              <div className={styles.twoColumns}>
                {content.people.map((name, index) => (
                  <Field label={`${index + 1}-ism`} key={index}>
                    <div className={styles.inlineInput}>
                      <input
                        value={name}
                        maxLength={300}
                        disabled={identityLocked}
                        onChange={(event) => person(index, event.target.value)}
                        placeholder="Ism"
                      />
                      {content.people.length > 1 && (
                        <button
                          aria-label={`${index + 1}-ismni olib tashlash`}
                          disabled={identityLocked}
                          onClick={() =>
                            updateContent({
                              people: content.people.filter(
                                (_, i) => i !== index,
                              ),
                            })
                          }
                        >
                          <X size={15} />
                        </button>
                      )}
                    </div>
                  </Field>
                ))}
              </div>
              {identityLocked && (
                <p className={styles.help}>
                  Nashrdan keyin asosiy ismlar va tadbir turi o‘zgarmaydi.
                  Tuzatish uchun administratorga murojaat qiling.
                </p>
              )}
              <Field label="Oila yoki mezbonlar" hint="Ixtiyoriy">
                <input
                  value={content.hosts}
                  maxLength={300}
                  disabled={identityLocked}
                  onChange={(event) =>
                    updateContent({ hosts: event.target.value })
                  }
                />
              </Field>
              <div className={styles.divider} />
              <Field label="Taklifnoma sarlavhasi">
                <input
                  value={content.title}
                  maxLength={300}
                  onChange={(event) =>
                    updateContent({ title: event.target.value })
                  }
                />
              </Field>
              <Field label="Tadbir nomi" hint="Bu matn taklifnomada ko‘rinadi.">
                <input
                  value={content.eventLabel}
                  maxLength={300}
                  onChange={(event) =>
                    updateContent({ eventLabel: event.target.value })
                  }
                />
              </Field>
              <Field label="Mehmonlarga salomlashish">
                <input
                  value={content.greeting}
                  maxLength={300}
                  onChange={(event) =>
                    updateContent({ greeting: event.target.value })
                  }
                />
              </Field>
              <Field label="Taklif matni">
                <textarea
                  value={content.message}
                  maxLength={10000}
                  rows={5}
                  onChange={(event) =>
                    updateContent({ message: event.target.value })
                  }
                />
              </Field>
              <Field
                label="Shaxsiy taklif salomlashuvi"
                hint="{name} o‘rniga mehmonning ismi qo‘yiladi. Shaxsiy havolalar keyin yaratiladi."
              >
                <input
                  value={content.personalGreeting}
                  maxLength={300}
                  onChange={(event) =>
                    updateContent({ personalGreeting: event.target.value })
                  }
                />
              </Field>
            </div>
          )}

          {section === 1 && (
            <div className={styles.form}>
              <h2>Sana va vaqt</h2>
              <Field label="Tadbir boshlanishi">
                <input
                  type="datetime-local"
                  value={invitation.startsAt}
                  disabled={identityLocked}
                  onChange={(event) => update({ startsAt: event.target.value })}
                />
              </Field>
              <Field label="Vaqt mintaqasi">
                <select
                  value={invitation.timezone}
                  disabled={identityLocked}
                  onChange={(event) => update({ timezone: event.target.value })}
                >
                  <option value="Asia/Tashkent">O‘zbekiston — Toshkent</option>
                  <option value="Asia/Riyadh">
                    Qatar / Saudiya Arabistoni
                  </option>
                  <option value="Asia/Dubai">BAA — Dubay</option>
                  <option value="Europe/Moscow">Rossiya — Moskva</option>
                  <option value="Europe/London">
                    Buyuk Britaniya — London
                  </option>
                  <option value="UTC">UTC</option>
                </select>
              </Field>
              {identityLocked && (
                <p className={styles.help}>
                  Sanani ko‘chirish administrator tasdig‘i bilan amalga
                  oshiriladi.
                </p>
              )}
              <div className={styles.divider} />
              <h2>Manzil</h2>
              <Field label="To‘yxona yoki joy nomi">
                <input
                  value={content.venueName}
                  maxLength={300}
                  onChange={(event) =>
                    updateContent({ venueName: event.target.value })
                  }
                  placeholder="Joy nomini kiriting"
                />
              </Field>
              <Field label="To‘liq manzil">
                <textarea
                  value={content.address}
                  rows={2}
                  maxLength={1000}
                  onChange={(event) =>
                    updateContent({ address: event.target.value })
                  }
                />
              </Field>
              <Field label="Mo‘ljal va qo‘shimcha yo‘l-yo‘riq">
                <textarea
                  value={content.landmark}
                  rows={2}
                  maxLength={1000}
                  onChange={(event) =>
                    updateContent({ landmark: event.target.value })
                  }
                  placeholder="Ixtiyoriy"
                />
              </Field>
              <Field
                label="Xarita havolasi"
                hint="Google Maps yoki Yandex Maps havolasini kiriting."
              >
                <input
                  type="url"
                  value={invitation.venue.mapUrl}
                  maxLength={2048}
                  onChange={(event) =>
                    update({
                      venue: {
                        ...invitation.venue,
                        mapUrl: event.target.value,
                      },
                    })
                  }
                  placeholder="https://…"
                />
              </Field>
              <div className={styles.divider} />
              <Field label="Dastur sarlavhasi">
                <input
                  value={content.programHeading}
                  maxLength={300}
                  onChange={(event) =>
                    updateContent({ programHeading: event.target.value })
                  }
                />
              </Field>
              <div className={styles.program}>
                {invitation.program.map((item, index) => (
                  <div key={item.id} className={styles.programItem}>
                    <span className={styles.timelineDot} />
                    <Field label="Vaqt">
                      <input
                        type="time"
                        value={item.time}
                        onChange={(event) =>
                          update({
                            program: invitation.program.map((row) =>
                              row.id === item.id
                                ? { ...row, time: event.target.value }
                                : row,
                            ),
                          })
                        }
                      />
                    </Field>
                    <Field label="Dastur bandi">
                      <input
                        value={content.programTitles[item.id] ?? ""}
                        maxLength={300}
                        onChange={(event) =>
                          updateContent({
                            programTitles: {
                              ...content.programTitles,
                              [item.id]: event.target.value,
                            },
                          })
                        }
                        placeholder="Dastur bandi nomi"
                      />
                    </Field>
                    <div className={styles.rowActions}>
                      <button
                        aria-label="Yuqoriga ko‘chirish"
                        disabled={index === 0}
                        onClick={() => moveProgram(index, -1)}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        aria-label="Pastga ko‘chirish"
                        disabled={index === invitation.program.length - 1}
                        onClick={() => moveProgram(index, 1)}
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        aria-label="Dastur bandini o‘chirish"
                        onClick={() =>
                          update({
                            program: invitation.program.filter(
                              (row) => row.id !== item.id,
                            ),
                          })
                        }
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className={styles.addButton}
                disabled={invitation.program.length >= 100}
                onClick={() =>
                  update({
                    program: [
                      ...invitation.program,
                      { id: crypto.randomUUID(), time: "" },
                    ],
                  })
                }
              >
                <Plus size={17} />
                Dastur bandini qo‘shish
              </button>
            </div>
          )}

          {section === 2 && (
            <div className={styles.form}>
              {catalogNote && <p className={styles.help}>{catalogNote}</p>}
              {invitation.templateId &&
                !templates.some(
                  (item) => item.id === invitation.templateId && item.published,
                ) && (
                  <div className={styles.notice}>
                    Bu qoralamadagi dizayn endi mavjud emas. Ma’lumotlaringiz
                    saqlangan; yangi dizayn qo‘shilgach tanlashingiz mumkin.
                  </div>
                )}
              <div className={styles.designNotice}>
                <CheckCircle2 size={20} />
                <p>
                  Hozircha tayyor dizaynlar qo‘shilmagan. Ma’lumotlaringizni
                  qoralama sifatida saqlashingiz va dizaynlar paydo bo‘lgach
                  tanlashingiz mumkin.
                </p>
              </div>
              {templates.some((template) => template.published) && (
                <div
                  className={styles.categoryFilters}
                  role="group"
                  aria-label="Dizayn kategoriyalari"
                >
                  <button
                    aria-pressed={categoryFilter === "all"}
                    className={
                      categoryFilter === "all" ? styles.selectedCategory : ""
                    }
                    onClick={() => setCategoryFilter("all")}
                  >
                    Barchasi
                    <span>
                      {
                        templates.filter((template) => template.published)
                          .length
                      }
                    </span>
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      aria-pressed={categoryFilter === category.id}
                      className={
                        categoryFilter === category.id
                          ? styles.selectedCategory
                          : ""
                      }
                      onClick={() => setCategoryFilter(category.id)}
                    >
                      {category.name}
                      <span>
                        {
                          templates.filter(
                            (template) =>
                              template.published &&
                              template.categoryIds.includes(category.id),
                          ).length
                        }
                      </span>
                    </button>
                  ))}
                </div>
              )}
              <div className={styles.templateGrid}>
                {templates
                  .filter(
                    (template) =>
                      template.published &&
                      (categoryFilter === "all" ||
                        template.categoryIds.includes(categoryFilter)),
                  )
                  .map((template) => (
                    <div
                      key={template.id}
                      className={`${styles.templateCard} ${invitation.templateId === template.id ? styles.selectedTemplate : ""}`}
                    >
                      <button
                        type="button"
                        disabled={identityLocked}
                        className={styles.templateSelect}
                        aria-pressed={invitation.templateId === template.id}
                        onClick={() =>
                          setInvitation(switchTemplate(invitation, template.id))
                        }
                      >
                        <div
                          className={styles.templateArt}
                          style={{
                            backgroundImage: `url(/templates/${template.id}/${template.previewImage ?? "stage.webp"})`,
                          }}
                          aria-label={`${template.name} dizaynining birinchi sahifasi`}
                        >
                          {invitation.templateId === template.id && (
                            <span className={styles.selectedCheck}>
                              <Check size={17} />
                            </span>
                          )}
                        </div>
                        <div className={styles.templateMeta}>
                          <strong>{template.name}</strong>
                          <small>{template.description}</small>
                          <span>{formatPrice(template.priceMinor)}</span>
                        </div>
                      </button>
                      <Link
                        className={styles.templateFullPreview}
                        href={`/preview?template=${encodeURIComponent(template.id)}&draft=${encodeURIComponent(invitation.id)}`}
                        onClick={() => {
                          try {
                            sessionStorage.setItem(
                              `taklifnoma:full-preview:v1:${invitation.id}`,
                              JSON.stringify(
                                switchTemplate(invitation, template.id),
                              ),
                            );
                          } catch {
                            // The full preview can recover the last saved browser draft.
                          }
                        }}
                      >
                        <Eye size={15} /> To‘liq ko‘rish
                      </Link>
                    </div>
                  ))}
              </div>
              {!templates.some(
                (template) =>
                  template.published &&
                  (categoryFilter === "all" ||
                    template.categoryIds.includes(categoryFilter)),
              ) && (
                <div className={styles.categoryEmpty}>
                  <LayoutTemplate size={24} />
                  <p>Hozircha tanlash uchun dizayn yo‘q.</p>
                  <small>
                    Qoralamangiz saqlanadi va keyin dizayn tanlashingiz mumkin.
                  </small>
                </div>
              )}
              {identityLocked && (
                <p className={styles.help}>
                  Nashr qilingan taklifnomada dizaynni almashtirish hozircha
                  mavjud emas.
                </p>
              )}
              {selectedTemplate ? (
                <div className={styles.priceNote}>
                  <span>Tanlangan dizayn</span>
                  <strong>{selectedTemplate.name}</strong>
                  <b>{formatPrice(selectedTemplate.priceMinor)}</b>
                  <small>
                    To‘lovdan oldin hisobingizga kirish talab qilinadi.
                  </small>
                </div>
              ) : (
                <div className={styles.priceNote}>
                  <span>Dizayn narxi</span>
                  <strong>Hozircha belgilanmagan</strong>
                  <small>Dizayn tanlanganidan keyin narx ko‘rsatiladi.</small>
                </div>
              )}
            </div>
          )}

          {section === 3 && (
            <div className={styles.form}>
              <div className={styles.groupHeader}>
                <h2>
                  <ImagePlus size={20} />
                  Xotiralaringiz
                </h2>
                <span className={styles.optional}>Ixtiyoriy</span>
              </div>
              <p className={styles.help}>
                O‘zingiz uchun qadrli rasmlarni qo‘shing. Dizayn o‘zgarsa ham
                ular saqlanadi.
              </p>
              <label className={styles.uploadBox}>
                <ImagePlus size={25} />
                <strong>{uploading ? "Yuklanmoqda…" : "Rasm yuklash"}</strong>
                <span>JPG, PNG yoki WebP · 15 MB gacha</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={uploading || invitation.gallery.length >= 50}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void upload(file, "image");
                    event.target.value = "";
                  }}
                />
              </label>
              <details className={styles.details}>
                <summary>Mavjud rasm havolasi orqali qo‘shish</summary>
                <div className={styles.linkInput}>
                  <input
                    aria-label="Rasm havolasi"
                    type="url"
                    value={imageUrl}
                    onChange={(event) => setImageUrl(event.target.value)}
                    placeholder="https://…"
                  />
                  <button
                    onClick={() => {
                      if (!/^https?:\/\//i.test(imageUrl)) {
                        setError("To‘liq https:// rasm havolasini kiriting.");
                        return;
                      }
                      if (invitation.gallery.length >= 50) return;
                      update({
                        gallery: [
                          ...invitation.gallery,
                          {
                            id: crypto.randomUUID(),
                            url: imageUrl,
                            alt: "",
                            caption: "",
                          },
                        ],
                      });
                      setImageUrl("");
                    }}
                  >
                    <Plus size={17} />
                    Qo‘shish
                  </button>
                </div>
              </details>
              {invitation.gallery.map((image, index) => (
                <div className={styles.galleryRow} key={image.id}>
                  <div
                    className={styles.imageThumb}
                    style={{
                      backgroundImage: `url(${JSON.stringify(image.url)})`,
                    }}
                    role="img"
                    aria-label={image.alt || `Rasm ${index + 1}`}
                  />
                  <Field label={`Rasm ${index + 1} izohi`}>
                    <input
                      value={image.caption}
                      maxLength={300}
                      onChange={(event) =>
                        update({
                          gallery: invitation.gallery.map((item) =>
                            item.id === image.id
                              ? {
                                  ...item,
                                  caption: event.target.value,
                                  alt: event.target.value,
                                }
                              : item,
                          ),
                        })
                      }
                    />
                  </Field>
                  <button
                    className={styles.iconButton}
                    aria-label="Rasmni olib tashlash"
                    onClick={() =>
                      update({
                        gallery: invitation.gallery.filter(
                          (item) => item.id !== image.id,
                        ),
                      })
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <div className={styles.divider} />
              <Toggle
                title="Fon musiqasi"
                description="Mehmon taklifnomani ochganda musiqa tinglashi mumkin."
                checked={invitation.music.enabled}
                onChange={(enabled) =>
                  update({ music: { ...invitation.music, enabled } })
                }
              />
              {invitation.music.enabled && (
                <div className={styles.optionBody}>
                  <label className={styles.audioUpload}>
                    <Music2 size={20} />
                    <span>
                      {uploading ? "Yuklanmoqda…" : "O‘z musiqangizni yuklang"}
                      <small>Audio fayl · 15 MB gacha</small>
                    </span>
                    <input
                      type="file"
                      accept="audio/*"
                      disabled={uploading}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) void upload(file, "audio");
                        event.target.value = "";
                      }}
                    />
                  </label>
                  {(audioPreview || invitation.music.url) && (
                    <>
                      <p className={styles.help}>
                        {audioPreview
                          ? `${audioName} — faqat shu oynadagi sinov, hali yuklanmagan.`
                          : invitation.music.filename}
                      </p>
                      <audio
                        controls
                        preload="none"
                        src={audioPreview || invitation.music.url}
                        className={styles.audio}
                      />
                      <button
                        className={styles.textButton}
                        onClick={() => {
                          update({
                            music: {
                              ...invitation.music,
                              assetId: null,
                              url: "",
                              filename: "",
                            },
                          });
                          setAudioPreview("");
                          setAudioName("");
                        }}
                      >
                        <Trash2 size={14} />
                        Musiqani olib tashlash
                      </button>
                    </>
                  )}
                  <p className={styles.help}>
                    Musiqa qo‘shish majburiy emas. Ovoz mehmonning bosishi bilan
                    boshlanadi.
                  </p>
                </div>
              )}
              <div className={styles.divider} />
              <Toggle
                title="To‘yona kartasi"
                description="Istasangiz, mehmonlar uchun karta ma’lumotlarini ko‘rsating."
                checked={invitation.gift.enabled}
                onChange={(enabled) =>
                  update({
                    gift: {
                      ...invitation.gift,
                      enabled,
                      receiptUploadEnabled:
                        enabled && invitation.gift.receiptUploadEnabled,
                    },
                  })
                }
              />
              {invitation.gift.enabled && (
                <div className={styles.optionBody}>
                  <Field label="Karta raqami">
                    <input
                      inputMode="numeric"
                      value={invitation.gift.cardNumber}
                      maxLength={30}
                      onChange={(event) =>
                        update({
                          gift: {
                            ...invitation.gift,
                            cardNumber: event.target.value,
                          },
                        })
                      }
                    />
                  </Field>
                  <Field label="Karta egasining ismi">
                    <input
                      value={invitation.gift.cardHolder}
                      maxLength={300}
                      onChange={(event) =>
                        update({
                          gift: {
                            ...invitation.gift,
                            cardHolder: event.target.value,
                          },
                        })
                      }
                    />
                  </Field>
                  <Field label="Bank nomi (ixtiyoriy)">
                    <input
                      value={invitation.gift.bankName}
                      maxLength={300}
                      onChange={(event) =>
                        update({
                          gift: {
                            ...invitation.gift,
                            bankName: event.target.value,
                          },
                        })
                      }
                    />
                  </Field>
                  <Toggle
                    title="Chek yuborishga ruxsat"
                    description="Mehmonlar pul o‘tkazmasi chekini yuborishi mumkin."
                    checked={invitation.gift.receiptUploadEnabled}
                    onChange={(receiptUploadEnabled) =>
                      update({
                        gift: { ...invitation.gift, receiptUploadEnabled },
                      })
                    }
                  />
                </div>
              )}
              <div className={styles.divider} />
              <Toggle
                title="Qatnashishni tasdiqlash"
                description="Mehmonlar kelishini oldindan bildirsin."
                checked={invitation.rsvp.enabled}
                onChange={(enabled) =>
                  update({ rsvp: { ...invitation.rsvp, enabled } })
                }
              />
              {invitation.rsvp.enabled && (
                <div className={`${styles.optionBody} ${styles.twoColumns}`}>
                  <Field label="Javob berish muddati">
                    <input
                      type="date"
                      value={invitation.rsvp.deadline}
                      onChange={(event) =>
                        update({
                          rsvp: {
                            ...invitation.rsvp,
                            deadline: event.target.value,
                          },
                        })
                      }
                    />
                  </Field>
                  <Field label="Bir javobdagi mehmonlar soni">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={invitation.rsvp.maxPartySize}
                      onChange={(event) =>
                        update({
                          rsvp: {
                            ...invitation.rsvp,
                            maxPartySize: Math.min(
                              100,
                              Math.max(1, Number(event.target.value) || 1),
                            ),
                          },
                        })
                      }
                    />
                  </Field>
                </div>
              )}
              <div className={styles.divider} />
              <Toggle
                title="Mehmonlar tilaklari"
                description="Tilaklar faqat siz tasdiqlaganingizdan keyin ko‘rinadi."
                checked={invitation.wishes.enabled}
                onChange={(enabled) =>
                  update({ wishes: { ...invitation.wishes, enabled } })
                }
              />
              <div className={styles.divider} />
              <div className={styles.groupHeader}>
                <h2>Bog‘lanish</h2>
                <button
                  className={styles.textButton}
                  disabled={invitation.contacts.length >= 20}
                  onClick={() =>
                    update({
                      contacts: [
                        ...invitation.contacts,
                        {
                          id: crypto.randomUUID(),
                          type: "phone",
                          label: "",
                          value: "",
                        },
                      ],
                    })
                  }
                >
                  <Plus size={15} />
                  Qo‘shish
                </button>
              </div>
              {invitation.contacts.length === 0 && (
                <p className={styles.help}>
                  Telefon raqami yoki Telegram manzilini qo‘shishingiz mumkin.
                </p>
              )}
              {invitation.contacts.map((contact) => (
                <div className={styles.contactRow} key={contact.id}>
                  <Field label="Turi">
                    <select
                      value={contact.type}
                      onChange={(event) =>
                        update({
                          contacts: invitation.contacts.map((item) =>
                            item.id === contact.id
                              ? {
                                  ...item,
                                  type: event.target.value as
                                    "phone" | "telegram",
                                }
                              : item,
                          ),
                        })
                      }
                    >
                      <option value="phone">Telefon</option>
                      <option value="telegram">Telegram</option>
                    </select>
                  </Field>
                  <Field label="Ism / vazifa">
                    <input
                      value={contact.label}
                      maxLength={300}
                      onChange={(event) =>
                        update({
                          contacts: invitation.contacts.map((item) =>
                            item.id === contact.id
                              ? { ...item, label: event.target.value }
                              : item,
                          ),
                        })
                      }
                    />
                  </Field>
                  <Field label="Raqam / username">
                    <input
                      value={contact.value}
                      maxLength={300}
                      onChange={(event) =>
                        update({
                          contacts: invitation.contacts.map((item) =>
                            item.id === contact.id
                              ? { ...item, value: event.target.value }
                              : item,
                          ),
                        })
                      }
                    />
                  </Field>
                  <button
                    className={styles.iconButton}
                    aria-label="Kontaktni o‘chirish"
                    onClick={() =>
                      update({
                        contacts: invitation.contacts.filter(
                          (item) => item.id !== contact.id,
                        ),
                      })
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className={styles.exportDraft}>
            <button className={styles.textButton} onClick={exportDraft}>
              Qoralamani yuklab olish
            </button>
            <span>Saqlashda muammo bo‘lsa, zaxira nusxa oling.</span>
          </div>
          <footer className={styles.editorFooter}>
            <button
              className={styles.secondaryButton}
              onClick={() => setSection(Math.max(0, section - 1))}
              disabled={section === 0}
            >
              <ArrowLeft size={16} />
              Orqaga
            </button>
            {section < 3 ? (
              <button
                className={styles.saveButton}
                onClick={() => setSection(section + 1)}
              >
                Davom etish
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                className={styles.saveButton}
                onClick={cloudSave}
                disabled={busy}
              >
                <Save size={16} />
                Hisobimga saqlash
              </button>
            )}
          </footer>
        </main>
        <aside
          className={`${styles.previewPanel} ${!mobilePreview ? styles.previewMobileHidden : ""}`}
          aria-label="Taklifnoma ko‘rinishi"
        >
          <div className={styles.previewHeading}>
            <span>
              <Smartphone size={16} />
              Jonli ko‘rinish
            </span>
            <span>{LANGUAGE_NAMES[locale]}</span>
            {invitation.templateId === "anor" && (
              <Link
                className={styles.fullPreviewLink}
                href={`/preview?template=anor&draft=${encodeURIComponent(invitation.id)}${section === 2 && !authoredPreview ? "&demo=1" : ""}`}
                onClick={() => {
                  try {
                    sessionStorage.setItem(
                      `taklifnoma:full-preview:v1:${invitation.id}`,
                      JSON.stringify(invitation),
                    );
                  } catch {
                    // The full preview can recover the last saved browser draft.
                  }
                }}
              >
                <Eye size={14} /> To‘liq ko‘rish
              </Link>
            )}
          </div>
          <div className={styles.realPreview}>
            {invitation.templateId === "anor" ? (
              <AnorInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                fullPreview
              />
            ) : (
              <div className={styles.categoryEmpty}>
                <LayoutTemplate size={28} />
                <strong>
                  {selectedTemplate?.name ?? "Dizayn tanlanmagan"}
                </strong>
                <p>
                  Taklifnoma dizayni qo‘shilgach, jonli ko‘rinishi shu yerda
                  chiqadi.
                </p>
              </div>
            )}
          </div>
          <p className={styles.previewNote}>
            {section === 2 && !authoredPreview
              ? "Namuna ma’lumotlari faqat dizayn tanlashda ko‘rsatiladi."
              : "Siz kiritgan ma’lumotlar taklifnomada shunday ko‘rinadi."}
          </p>
        </aside>
      </div>
      {auth && (
        <div
          className={styles.overlay}
          onClick={(event) => {
            if (event.target === event.currentTarget) setAuth(null);
          }}
        >
          <div
            className={styles.authDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
            ref={dialogRef}
          >
            <button
              className={styles.closeDialog}
              aria-label="Kirish oynasini yopish"
              onClick={() => setAuth(null)}
            >
              <X size={20} />
            </button>
            <span className={styles.telegramIcon}>
              <Send size={28} />
            </span>
            <h2 id="auth-title">Taklifnomani o‘z hisobingizga saqlang</h2>
            <p>
              Telegram orqali kiring. Kiritgan ma’lumotlaringiz shu yerda
              qoladi.
            </p>
            <div className={styles.authCode}>
              <span>Sayt va botdagi kod bir xil bo‘lsin</span>
              <strong>{auth.code}</strong>
            </div>
            <p role="status">{authStatus}</p>
            {authIdentity ? (
              <button
                className={styles.saveButton}
                onClick={completeLogin}
                disabled={busy}
              >
                <Check size={17} />
                {authIdentity.displayName} sifatida saqlash
              </button>
            ) : (
              <a
                className={styles.saveButton}
                href={auth.loginUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Send size={17} />
                Telegram orqali davom etish
              </a>
            )}
            <small>Faqat o‘zingiz boshlagan kirishni tasdiqlang.</small>
          </div>
        </div>
      )}
    </div>
  );
}
