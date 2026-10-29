"use client";

import { isValidElement, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Eye,
  Globe2,
  ImagePlus,
  LayoutTemplate,
  LoaderCircle,
  MapPin,
  Music2,
  Plus,
  Save,
  Send,
  Settings2,
  Trash2,
  Users,
  X,
} from "lucide-react";
import {
  addLanguage,
  createInvitation,
  defaultDressCode,
  defaultEventLabel,
  defaultLocalizedInvitationContent,
  EVENT_TYPE_OPTIONS,
  formatPrice,
  getContent,
  invitationSchema,
  muhrliMaktubDataSchema,
  yubileySahifasiDataSchema,
  fayzliXonadonDataSchema,
  gulbogDataSchema,
  zarrinDataSchema,
  mountainDataSchema,
  oltinYolDataSchema,
  osmonDataSchema,
  pariDataSchema,
  qogozDataSchema,
  sharlarDataSchema,
  sakuraDataSchema,
  pulauSehatiDataSchema,
  LANGUAGE_NAMES,
  LOCALES,
  removeLanguage,
  switchTemplate,
  templateById,
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
import { StudioTemplatePicker } from "./studio-template-picker";
import { OptionalSection } from "./optional-section";
import { useStudioPreview, type PreviewTarget } from "./use-studio-preview";
import { SoftSelect } from "@/components/soft-select";
import { DateTimePicker, TimePicker } from "@/components/date-time-picker";
import { readBrowserDraft, saveBrowserDraft } from "./draft-storage";
import { PlaceSearch } from "./place-search";
import { AnorInvitation } from "@/templates/anor";
import { isMarxabaTemplate, MarxabaInvitation } from "@/templates/marxaba";
import { isInvitateTemplate, InvitateInvitation } from "@/templates/invitate";
import { VelvetRoyaleInvitation } from "@/templates/velvet-royale/renderer";
import { OliveManorInvitation } from "@/templates/olive-manor/renderer";
import { IslamicEditionInvitation } from "@/templates/islamic-edition/renderer";
import { ManorInvitation } from "@/templates/manor-edition/renderer";
import { OshEditionInvitation } from "@/templates/osh-edition-v1/renderer";
import { MonochromeEditorialInvitation } from "@/templates/monochrome-editorial-edition/renderer";
import { XatnaEditionInvitation } from "@/templates/xatna-edition/renderer";
import { AmruMarufEditionInvitation } from "@/templates/amru-maruf-edition-v1/renderer";
import { GulliDarvozaInvitation } from "@/templates/onlinetaklifnoma/gulli-darvoza";
import { OltinDarvozaInvitation } from "@/templates/onlinetaklifnoma/oltin-darvoza-ortidagi-baxt";
import { MingBirKechaInvitation } from "@/templates/onlinetaklifnoma/ming-bir-kecha";
import { ZarrinDoppiInvitation } from "@/templates/onlinetaklifnoma/zarrin-doppi";
import { AndalusDarvozasiInvitation } from "@/templates/onlinetaklifnoma/andalus-darvozasi";
import { SamarqandPeshtoqInvitation } from "@/templates/onlinetaklifnoma/samarqand-peshtoqi";
import { ShishaBogInvitation } from "@/templates/onlinetaklifnoma/shisha-bog";
import { KapadokiyaTongiInvitation } from "@/templates/onlinetaklifnoma/kapadokiya-tongi";
import { BuxoroRavoqInvitation } from "@/templates/onlinetaklifnoma/buxoro-ravoq";
import { JannatBogiInvitation } from "@/templates/onlinetaklifnoma/jannat-bogi";
import { TojmahalOltinDarvozasiInvitation } from "@/templates/onlinetaklifnoma/tojmahal-oltin-darvozasi";
import { WedivoPulauSehati } from "@/templates/wedivo-pulau-sehati/renderer";
import { TakliflaAsalari } from "@/templates/taklifla-asalari/renderer";
import { TungiSaroyInvitation } from "@/templates/taklifla-tungi-saroy/renderer";
import { TakliflaTovus } from "@/templates/taklifla-tovus/renderer";
import { TakliflaTortFasl } from "@/templates/taklifla-tort-fasl/renderer";
import { TakliflaFayzliXonadonInvitation } from "@/templates/taklifla-fayzli-xonadon/renderer";
import { TakliflaErtak } from "@/templates/taklifla-ertak/renderer";
import { TakliflaGulbog } from "@/templates/taklifla-gulbog/renderer";
import { TakliflaZarrinGullar } from "@/templates/taklifla-zarrin-gullar/renderer";
import { ToglarBagridaInvitation } from "@/templates/taklifla-toglar-bagrida/renderer";
import { TakliflaOltinYol } from "@/templates/taklifla-oltin-yol/renderer";
import { TakliflaOsmonInvitation } from "@/templates/taklifla-osmon/renderer";
import { TakliflaParilarErtagiInvitation } from "@/templates/taklifla-parilar-ertagi/renderer";
import { TakliflaQogozErtagiInvitation } from "@/templates/taklifla-qogoz-ertagi/renderer";
import { SakuraGuliInvitation } from "@/templates/taklifla-sakura-guli/renderer";
import { TakliflaSharlarInvitation } from "@/templates/taklifla-sharlar/renderer";
import { TakliflaYubileySahifasi } from "@/templates/taklifla-yubiley-sahifasi/renderer";
import { TakliflaBarakali } from "@/templates/taklifla-barakali/renderer";
import { TakliflaZarhalSahifaInvitation } from "@/templates/taklifla-zarhal-sahifa/renderer";
import { MuhrliMaktubInvitation } from "@/templates/taklifla-muhrli-maktub/renderer";
import { isChorloveTemplate, ChorloveInvitation } from "@/templates/chorlove";
import {
  createTemplatePreviewSample,
  hasAuthoredInvitationContent,
} from "@/modules/catalog/preview-sample";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import { orderEventTemplates } from "@/modules/catalog/template-order";
import { PublishedLink } from "@/components/published-link";
import {
  publicationIssues,
  type PublicationIssue,
} from "@taklifnoma/contracts/publication";

const sections = [
  {
    icon: LayoutTemplate,
    title: "Dizayn tanlash",
    short: "Dizayn",
    note: "Tadbir va dizaynni tanlang",
    description: "Tadbir turini va dizaynni tanlang.",
  },
  {
    icon: Users,
    title: "Asosiy ma’lumotlar",
    short: "Ma’lumotlar",
    note: "Ismlar va taklif matni",
    description: "Ismlar va taklif matnini kiriting.",
  },
  {
    icon: MapPin,
    title: "Dastur va manzil",
    short: "Manzil",
    note: "Qachon va qayerda",
    description: "Sana, manzil va tadbir dasturini belgilang.",
  },
  {
    icon: Settings2,
    title: "Yakunlash",
    short: "Yakunlash",
    note: "Imkoniyatlar va yakuniy tekshiruv",
    description: "Kerakli imkoniyatlarni yoqing va taklifnomani tekshiring.",
  },
];

function fillDressCodeDefaults(
  current: Invitation["dressCode"],
): Invitation["dressCode"] {
  const defaults = defaultDressCode();
  const missingColors = defaults.colors.filter(
    (color) =>
      !current.colors.some(
        (existing) =>
          existing.hex.toLowerCase() === color.hex.toLowerCase() ||
          LOCALES.some(
            (item) =>
              existing.name[item]?.trim() &&
              existing.name[item]?.trim() === color.name[item],
          ),
      ),
  );
  return {
    ...current,
    enabled: true,
    style: Object.fromEntries(
      LOCALES.map((item) => [
        item,
        current.style[item] || defaults.style[item] || "",
      ]),
    ),
    text: Object.fromEntries(
      LOCALES.map((item) => [
        item,
        current.text[item] || defaults.text[item] || "",
      ]),
    ),
    note: Object.fromEntries(
      LOCALES.map((item) => [
        item,
        current.note[item] || defaults.note[item] || "",
      ]),
    ),
    colors: [
      ...current.colors,
      ...missingColors.slice(0, Math.max(0, 12 - current.colors.length)),
    ],
  };
}

const placeholders = {
  addLanguage: "+ Til qo‘shish",
  groomName: "Kuyovning ismi",
  brideName: "Kelinning ismi",
  personName: "Ism",
  family: "Raxmonovlar oilasi",
  venueName: "Joy nomini kiriting",
  optional: "Ixtiyoriy",
  programItem: "Dastur bandi nomi",
  musicLoading: "Musiqalar yuklanmoqda…",
  chooseMusic: "Musiqani tanlang",
  noMusic: "Hozircha yuklangan musiqa yo‘q",
};
const PROGRAM_TITLE_MAX_LENGTH = 300;
const PROGRAM_DESCRIPTION_MAX_LENGTH = 10000;

const defaultProgramItemTitles: Record<Locale, string> = {
  "uz-Latn": "Mehmonlarni kutib olish",
  "uz-Cyrl": "Меҳмонларни кутиб олиш",
  en: "Welcoming guests",
  ru: "Встреча гостей",
};

function addStarterProgramItem(invitation: Invitation): Invitation {
  const id = crypto.randomUUID();
  const content = { ...invitation.content };
  for (const locale of invitation.enabledLocales) {
    content[locale] = {
      ...getContent(invitation, locale),
      programTitles: {
        ...getContent(invitation, locale).programTitles,
        [id]: defaultProgramItemTitles[locale],
      },
    };
  }
  return {
    ...invitation,
    content,
    program: [...invitation.program, { id, time: "" }],
  };
}

function addInvitationLanguage(invitation: Invitation, locale: Locale) {
  const localized = addLanguage(invitation, locale);
  if (localized === invitation) return invitation;
  const seededProgramTitles = Object.fromEntries(
    invitation.program.flatMap((item) =>
      invitation.enabledLocales.some(
        (existingLocale) =>
          getContent(invitation, existingLocale).programTitles[item.id] ===
          defaultProgramItemTitles[existingLocale],
      )
        ? [[item.id, defaultProgramItemTitles[locale]]]
        : [],
    ),
  );
  return {
    ...localized,
    content: {
      ...localized.content,
      [locale]: {
        ...getContent(localized, locale),
        programTitles: {
          ...getContent(localized, locale).programTitles,
          ...seededProgramTitles,
        },
      },
    },
  };
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  if (
    isValidElement(children) &&
    (children.type === SoftSelect ||
      children.type === DateTimePicker ||
      children.type === TimePicker)
  )
    return (
      <div className={styles.field}>
        <span>{label}</span>
        {children}
        {hint && <small>{hint}</small>}
      </div>
    );
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
  adminContext,
}: {
  initialInvitation?: Invitation;
  adminContext?: { ownerId: string; ownerName: string };
}) {
  const [adminReason, setAdminReason] = useState(
    "Administrator tomonidan tahrirlash",
  );
  function studioFetch(input: RequestInfo | URL, init?: RequestInit) {
    if (
      adminContext &&
      initialInvitation &&
      typeof input === "string" &&
      (input.startsWith("/api/invitations") || input.startsWith("/api/uploads"))
    ) {
      const headers = new Headers(init?.headers);
      headers.set("X-Admin-Invitation", initialInvitation.id);
      headers.set("X-Admin-Reason", encodeURIComponent(adminReason));
      return globalThis.fetch(input, { ...init, headers });
    }
    return globalThis.fetch(input, init);
  }
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [locale, setLocale] = useState<Locale>(
    initialInvitation?.defaultLocale ?? "uz-Latn",
  );
  const [section, setSection] = useState(0);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishingMode, setPublishingMode] = useState("free");
  const [paidInvitationId, setPaidInvitationId] = useState("");
  const [publishIssues, setPublishIssues] = useState<PublicationIssue[]>([]);
  const [publicUrl, setPublicUrl] = useState<string>();
  const pendingAction = useRef<"save" | "publish">("save");
  const operationInFlight = useRef(false);
  const [auth, setAuth] = useState<{
    loginUrl: string;
    requestId: string;
  } | null>(null);
  const [authIdentity, setAuthIdentity] = useState<{
    displayName: string;
  } | null>(null);
  const [authStatus, setAuthStatus] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [audioPreview, setAudioPreview] = useState("");
  const [audioName, setAudioName] = useState("");
  const [savedMusic, setSavedMusic] = useState<
    Array<{ id: string; assetId: string | null; url: string; filename: string }>
  >([]);
  const [musicLibraryLoading, setMusicLibraryLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [templates, setTemplates] = useState<TemplateDefinition[]>([]);
  const [categories, setCategories] =
    useState<TemplateCategory[]>(TEMPLATE_CATEGORIES);
  const [browserSnapshot, setBrowserSnapshot] = useState("");
  const [browserSaveError, setBrowserSaveError] = useState(false);
  const [previewTarget, setPreviewTarget] = useState<PreviewTarget>("names");
  const previewHost = useRef<HTMLDivElement>(null);
  useStudioPreview(previewHost, invitation?.templateId, previewTarget);
  const [catalogNote, setCatalogNote] = useState("");
  const invitationRef = useRef(invitation);
  const lastCloudSnapshot = useRef(
    initialInvitation ? JSON.stringify(initialInvitation) : "",
  );
  const ownerId = useRef<string | null>(
    initialInvitation ? "unavailable-private-owner" : null,
  );
  const dressCodeDefaultsApplied = useRef(new Set<string>());
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  invitationRef.current = invitation;

  useEffect(() => {
    if (!invitation?.music.enabled) return;
    const controller = new AbortController();
    setMusicLibraryLoading(true);
    Promise.all([
      studioFetch("/api/music", { signal: controller.signal })
        .then(async (response) => {
          if (!response.ok) return [];
          const result = (await response.json()) as {
            tracks?: Array<{
              id: string;
              assetId: string;
              url: string;
              filename: string;
            }>;
          };
          return result.tracks ?? [];
        })
        .catch(() => []),
      studioFetch("/api/uploads", { signal: controller.signal })
        .then(async (response) => {
          if (!response.ok) return [];
          const result = (await response.json()) as {
            assets?: Array<{ id: string; url: string; filename: string }>;
          };
          return result.assets ?? [];
        })
        .catch(() => []),
    ])
      .then(([catalogTracks, assets]) =>
        setSavedMusic([
          {
            id: CATALOG_PREVIEW_MUSIC.id,
            assetId: null,
            url: CATALOG_PREVIEW_MUSIC.url,
            filename: CATALOG_PREVIEW_MUSIC.filename,
          },
          ...catalogTracks.map((track) => ({ ...track })),
          ...assets.map((asset) => ({ ...asset, assetId: asset.id })),
        ]),
      )
      .finally(() => {
        if (!controller.signal.aborted) setMusicLibraryLoading(false);
      });
    return () => controller.abort();
  }, [invitation?.id, invitation?.music.enabled]);

  useEffect(() => {
    let alive = true;
    setPaidInvitationId("");
    async function recover() {
      function bindDraftUrl(id: string) {
        if (initialInvitation) return;
        const url = new URL(window.location.href);
        url.searchParams.delete("new");
        url.searchParams.delete("useTemplate");
        url.searchParams.delete("template");
        url.searchParams.set("draft", id);
        window.history.replaceState(
          window.history.state,
          "",
          `${url.pathname}${url.search}${url.hash}`,
        );
      }
      try {
        const response = await studioFetch("/api/auth/session", {
          cache: "no-store",
        });
        if (response.ok) {
          const session: SessionResponse = await response.json();
          ownerId.current =
            session.user?.id ??
            (initialInvitation ? "unavailable-private-owner" : null);
          const savedId =
            initialInvitation?.id ??
            new URLSearchParams(window.location.search).get("draft");
          if (session.user && savedId && !adminContext) {
            void studioFetch(
              `/api/invitations/${encodeURIComponent(savedId)}/payment`,
              { cache: "no-store" },
            )
              .then((result) => (result.ok ? result.json() : null))
              .then((result) => {
                if (
                  alive &&
                  result?.order?.invitationId === savedId &&
                  result.order.status === "SUCCEEDED"
                )
                  setPaidInvitationId(savedId);
              })
              .catch(() => {
                /* Payment authority is rechecked when publishing. */
              });
          }
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
        const query = new URLSearchParams(window.location.search);
        const requestedTemplate = templateIdSchema.safeParse(
          query.get("useTemplate") ?? query.get("template"),
        );
        const stored =
          fresh || !!adminContext
            ? null
            : readBrowserDraft(
                initialInvitation?.id ?? requestedId,
                ownerId.current,
              );
        if (stored && (!initialInvitation || stored.dirty)) {
          const switchedInvitation = requestedTemplate.success
            ? switchTemplate(stored.invitation, requestedTemplate.data)
            : stored.invitation;
          const restoredInvitation = switchedInvitation.dressCode.enabled
            ? {
                ...switchedInvitation,
                dressCode: fillDressCodeDefaults(switchedInvitation.dressCode),
              }
            : switchedInvitation;
          setInvitation(restoredInvitation);
          setLocale(restoredInvitation.defaultLocale);
          setSection(restoredInvitation.templateId ? 1 : 0);
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
        const query = new URLSearchParams(window.location.search);
        const requestedTemplate = templateIdSchema.safeParse(
          query.get("useTemplate") ?? query.get("template"),
        );
        const selectedInvitation = requestedTemplate.success
          ? switchTemplate(initialInvitation, requestedTemplate.data)
          : initialInvitation;
        setInvitation(
          selectedInvitation.dressCode.enabled
            ? {
                ...selectedInvitation,
                dressCode: fillDressCodeDefaults(selectedInvitation.dressCode),
              }
            : selectedInvitation,
        );
        setLocale(initialInvitation.defaultLocale);
        setSection(selectedInvitation.templateId ? 1 : 0);
        return;
      }
      const template = new URLSearchParams(window.location.search).get(
        "template",
      );
      const selected = templateIdSchema.safeParse(template);
      const created = createInvitation(selected.success ? selected.data : "");
      if (selected.success) {
        const templateDefinition = templateById(selected.data);
        if (templateDefinition?.supportedEventTypes.length) {
          created.eventType =
            templateDefinition.previewEventType ??
            templateDefinition.supportedEventTypes[0];
          created.content[created.defaultLocale] =
            defaultLocalizedInvitationContent(
              created.eventType,
              created.defaultLocale,
            );
        }
        setSection(1);
      } else {
        created.eventType = "wedding";
        created.content[created.defaultLocale] =
          defaultLocalizedInvitationContent("wedding", created.defaultLocale);
      }
      const invitationWithStarterProgram = addStarterProgramItem(created);
      setInvitation(invitationWithStarterProgram);
      try {
        saveBrowserDraft(invitationWithStarterProgram, true, ownerId.current);
      } catch {
        setError(
          "Brauzerga saqlash imkoni yo‘q. Zaxira uchun qoralamangizni yuklab oling.",
        );
      }
      bindDraftUrl(invitationWithStarterProgram.id);
    }
    void recover();
    return () => {
      alive = false;
    };
  }, [initialInvitation]);

  useEffect(() => {
    if (
      !invitation?.dressCode.enabled ||
      dressCodeDefaultsApplied.current.has(invitation.id)
    )
      return;
    dressCodeDefaultsApplied.current.add(invitation.id);
    const dressCode = fillDressCodeDefaults(invitation.dressCode);
    if (JSON.stringify(dressCode) !== JSON.stringify(invitation.dressCode))
      setInvitation({ ...invitation, dressCode });
  }, [invitation]);

  useEffect(() => {
    let alive = true;
    studioFetch("/api/catalog", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then((result) => {
        if (alive && Array.isArray(result.templates)) {
          setTemplates(result.templates);
          setPublishingMode(result.publishingMode ?? "free");
          if (Array.isArray(result.categories))
            setCategories(
              [...result.categories].sort(
                (a: TemplateCategory, b: TemplateCategory) =>
                  a.position - b.position || a.name.localeCompare(b.name),
              ),
            );
          setCatalogNote("");
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
    if (!invitation || adminContext) return;
    const timer = window.setTimeout(() => {
      try {
        saveBrowserDraft(
          invitation,
          JSON.stringify(invitation) !== lastCloudSnapshot.current,
          ownerId.current,
        );
        setBrowserSnapshot(JSON.stringify(invitation));
        setBrowserSaveError(false);
      } catch {
        setBrowserSaveError(true);
        setError(
          "Brauzer xotirasi to‘lgan yoki saqlashga ruxsat yo‘q. Hisobingizga saqlashni tanlang.",
        );
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [invitation]);

  useEffect(() => {
    const flush = () => {
      if (adminContext) return;
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
        const response = await studioFetch(
          `/api/auth/telegram/status?requestId=${encodeURIComponent(auth!.requestId)}`,
          { cache: "no-store" },
        );
        const result = await response.json();
        if (cancelled) return;
        if (result.state === "confirmed") {
          const complete = await studioFetch("/api/auth/telegram/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requestId: auth!.requestId }),
          });
          if (!complete.ok) throw new Error("Kirishni yakunlab bo‘lmadi.");
          setAuth(null);
          setAuthIdentity(null);
          await saveOrPublish(pendingAction.current);
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

  useEffect(() => {
    if (authIdentity)
      dialogRef.current
        ?.querySelector<HTMLButtonElement>("[data-auth-complete]")
        ?.focus();
  }, [authIdentity]);

  if (!invitation)
    return (
      <div className={styles.loading}>
        <LoaderCircle size={24} className={styles.spinner} />
        <p>Taklifnomangiz tayyorlanmoqda…</p>
      </div>
    );
  const content = getContent(invitation, locale);
  // Placeholder copy follows the Uzbek Latin editor UI, independently of the
  // invitation language currently being authored.
  const selectedTemplate = templates.find(
    (item) => item.id === invitation.templateId,
  );
  const singleCelebrant =
    invitation.eventType === "sunnat-toyi" ||
    invitation.eventType === "beshik-toyi" ||
    invitation.templateId === "beshik" ||
    invitation.templateId === "nahor" ||
    invitation.eventType === "bitiruv" ||
    invitation.eventType === "korporativ" ||
    invitation.templateId === "bitiruv" ||
    invitation.templateId === "korporativ" ||
    invitation.eventType === "yangi-uy" ||
    invitation.templateId === "yangi-uy";
  const singleCelebrantLabel =
    invitation.templateId === "nahor"
      ? "Mezbon yoki oila nomi"
      : invitation.eventType === "bitiruv"
        ? "Bitiruvchining ismi"
        : invitation.eventType === "korporativ" ||
            invitation.templateId === "korporativ"
          ? "Tashkilot yoki shaxs nomi"
          : invitation.eventType === "yangi-uy" ||
              invitation.templateId === "yangi-uy"
            ? "Xonadon yoki oila nomi"
            : invitation.templateId === "bitiruv"
              ? "Nishonlanuvchi ismi"
              : "Bola ismi";
  const singleCelebrantPlaceholder =
    invitation.templateId === "nahor"
      ? "Masalan, Rahmonovlar oilasi"
      : invitation.eventType === "bitiruv"
        ? "Bitiruvchining ismi"
        : invitation.eventType === "korporativ" ||
            invitation.templateId === "korporativ"
          ? "Tashkilot yoki shaxs nomi"
          : invitation.eventType === "yangi-uy" ||
              invitation.templateId === "yangi-uy"
            ? "Masalan, Rahmonovlar xonadoni"
            : invitation.templateId === "bitiruv"
              ? "Nishonlanuvchining ismi"
              : "Bolaning ismi";
  const personFields =
    content.people.length > 0
      ? content.people
      : singleCelebrant
        ? [""]
        : ["", ""];
  const compatibleTemplates = orderEventTemplates(
    templates,
    invitation.eventType,
  );
  const readiness = publicationIssues(invitation);
  if (
    invitation.status === "draft" &&
    invitation.templateId &&
    (!selectedTemplate?.published ||
      !selectedTemplate.supportedEventTypes.includes(invitation.eventType))
  ) {
    readiness.push({
      path: "templateId",
      section: 0,
      message: templates.length
        ? "Mos dizaynni tanlang."
        : "Dizaynlar yuklanishini kuting yoki sahifani yangilang.",
    });
  }
  const currentSnapshot = JSON.stringify(invitation);
  const saveStatus =
    currentSnapshot === lastCloudSnapshot.current
      ? "Hisobga saqlangan"
      : adminContext
        ? "Saqlanmagan o‘zgarishlar"
        : browserSaveError
          ? "Brauzerga saqlanmadi"
          : browserSnapshot === currentSnapshot
            ? "Brauzerga saqlangan"
            : "Saqlanmoqda…";
  const authoredPreview = hasAuthoredInvitationContent(invitation);
  const previewInvitation =
    section === 0 && !authoredPreview
      ? createTemplatePreviewSample(invitation.templateId, invitation)
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
  const pulauData = pulauSehatiDataSchema.parse(
    invitation.templateData["wedivo-pulau-sehati"] ?? {},
  );
  function updatePulauData(patch: Partial<typeof pulauData>) {
    setInvitation((current) =>
      current
        ? {
            ...current,
            templateData: {
              ...current.templateData,
              "wedivo-pulau-sehati": { ...pulauData, ...patch },
            },
          }
        : current,
    );
  }
  const sharlarData=sharlarDataSchema.parse(invitation.templateData["taklifla-sharlar"] ?? {});
  const sakuraData=sakuraDataSchema.parse(invitation.templateData["taklifla-sakura-guli"] ?? {});
  function updateSakuraNote(key:keyof typeof sakuraData,value:string){setInvitation(current=>current?{...current,templateData:{...current.templateData,"taklifla-sakura-guli":{...sakuraData,[key]:{...sakuraData[key],[locale]:value}}}}:current);}
  const qogozData=qogozDataSchema.parse(invitation.templateData["taklifla-qogoz-ertagi"] ?? {});
  function updateQogozNote(key:keyof typeof qogozData,value:string){setInvitation(current=>current?{...current,templateData:{...current.templateData,"taklifla-qogoz-ertagi":{...qogozData,[key]:{...qogozData[key],[locale]:value}}}}:current);}
  const pariData=pariDataSchema.parse(invitation.templateData["taklifla-parilar-ertagi"] ?? {});
  function updatePariDetail(value:string,id?:string){setInvitation(current=>current?{...current,templateData:{...current.templateData,"taklifla-parilar-ertagi":id?{...pariData,programLabels:{...pariData.programLabels,[id]:{...pariData.programLabels[id],[locale]:value}}}:{...pariData,arrivalNote:{...pariData.arrivalNote,[locale]:value}}}}:current);}
  const osmonData=osmonDataSchema.parse(invitation.templateData["taklifla-osmon"] ?? {});
  function updateOsmonNote(key:keyof typeof osmonData,value:string){setInvitation(current=>current?{...current,templateData:{...current.templateData,"taklifla-osmon":{...osmonData,[key]:{...osmonData[key],[locale]:value}}}}:current);}
  const oltinYolData=oltinYolDataSchema.parse(invitation.templateData["taklifla-oltin-yol"] ?? {});
  function updateOltinNote(key:keyof typeof oltinYolData,value:string){setInvitation(current=>current?{...current,templateData:{...current.templateData,"taklifla-oltin-yol":{...oltinYolData,[key]:{...oltinYolData[key],[locale]:value}}}}:current);}
  const mountainData=mountainDataSchema.parse(invitation.templateData["taklifla-toglar-bagrida"] ?? {});
  function updateMountainTime(key:"ceremonyTime"|"celebrationTime",value:string){setInvitation(current=>current?{...current,templateData:{...current.templateData,"taklifla-toglar-bagrida":{...mountainData,[key]:value}}}:current);}
  const zarrinData=zarrinDataSchema.parse(invitation.templateData["taklifla-zarrin-gullar"] ?? {});
  function updateZarrinField(key:"brideFamily"|"groomFamily"|"stayText"|"footerNote"|"hashtag",value:string){setInvitation(current=>current?{...current,templateData:{...current.templateData,"taklifla-zarrin-gullar":{...zarrinData,[key]:key==="hashtag"?value:{...zarrinData[key],[locale]:value}}}}:current);}
  const gulbogData=gulbogDataSchema.parse(invitation.templateData["taklifla-gulbog"] ?? {});
  function updateGulbogField(key:keyof typeof gulbogData,value:string){setInvitation(current=>current?{...current,templateData:{...current.templateData,"taklifla-gulbog":{...gulbogData,[key]:{...gulbogData[key],[locale]:value}}}}:current);}
  const xonadonData=fayzliXonadonDataSchema.parse(invitation.templateData["taklifla-fayzli-xonadon"] ?? {});
  function updateXonadonMenu(menu: typeof xonadonData.menu) {setInvitation(current=>current?{...current,templateData:{...current.templateData,"taklifla-fayzli-xonadon":{menu}}}:current);}
  const yubileyData = yubileySahifasiDataSchema.parse(invitation.templateData["taklifla-yubiley-sahifasi"] ?? {});
  function updateYubileyData(next: typeof yubileyData) {
    setInvitation(current=>current ? {...current,templateData:{...current.templateData,"taklifla-yubiley-sahifasi":next}} : current);
  }
  const muhrliMaktubData = muhrliMaktubDataSchema.parse(
    invitation.templateData["taklifla-muhrli-maktub"] ?? {},
  );
  function updateMuhrliMaktubFlowersNote(value: string) {
    setInvitation((current) => {
      if (!current) return current;
      const data = muhrliMaktubDataSchema.parse(
        current.templateData["taklifla-muhrli-maktub"] ?? {},
      );
      return {
        ...current,
        templateData: {
          ...current.templateData,
          "taklifla-muhrli-maktub": {
            ...data,
            flowersNote: { ...data.flowersNote, [locale]: value },
          },
        },
      };
    });
  }
  function changeEventType(value: string) {
    const currentInvitation = invitation;
    if (!currentInvitation) return;
    const eventType = value as Invitation["eventType"];
    const currentContent = getContent(currentInvitation, locale);
    const previousDefaults = defaultLocalizedInvitationContent(
      currentInvitation.eventType,
      locale,
    );
    const nextDefaults = defaultLocalizedInvitationContent(eventType, locale);
    const defaultFields = [
      "title",
      "greeting",
      "message",
      "eventLabel",
      "programHeading",
    ] as const;
    const localizedPatch = Object.fromEntries(
      defaultFields
        .filter(
          (field) =>
            !currentContent[field].trim() ||
            currentContent[field] === previousDefaults[field],
        )
        .map((field) => [field, nextDefaults[field]]),
    ) as Partial<InvitationContent>;
    const contentPatch =
      Object.keys(localizedPatch).length === 0
        ? {}
        : {
            content: {
              ...currentInvitation.content,
              [locale]: { ...currentContent, ...localizedPatch },
            },
          };
    const selected =
      templates.find((item) => item.id === currentInvitation.templateId) ??
      templateById(currentInvitation.templateId);
    setNotice("");
    if (selected && !selected.supportedEventTypes.includes(eventType)) {
      update({ eventType, templateId: "", ...contentPatch });
    } else update({ eventType, ...contentPatch });
  }
  function updateDressCode(patch: Partial<Invitation["dressCode"]>) {
    const current = invitation;
    if (!current) return;
    update({ dressCode: { ...current.dressCode, ...patch } });
  }
  function updateDressCodeText(
    field: "style" | "text" | "note",
    value: string,
  ) {
    const current = invitation;
    if (!current) return;
    const values = current.dressCode[field];
    updateDressCode({ [field]: { ...values, [locale]: value } });
  }
  function person(index: number, value: string) {
    const people = [...personFields];
    people[index] = value;
    updateContent({ people });
  }
  async function cloudSave() {
    await saveOrPublish("save");
  }
  async function saveOrPublish(action: "save" | "publish") {
    const current = invitationRef.current;
    if (!current || operationInFlight.current || uploading) return;
    setPublishIssues([]);
    if (action === "publish") {
      const issues = publicationIssues(current);
      if (issues.length) {
        setPublishIssues(issues);
        setNotice("");
        setError("");
        goToSection(issues[0].section);
        if (issues[0].locale) setLocale(issues[0].locale);
        return;
      }
    }
    pendingAction.current = action;
    operationInFlight.current = true;
    setBusy(true);
    setPublishing(action === "publish");
    setError("");
    setNotice("");
    try {
      const sessionResponse = await studioFetch("/api/auth/session", {
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
        const response = await studioFetch("/api/auth/telegram/start", {
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
          "Telegram botida o‘z telefon raqamingizni ulashing. Keyin saytga qayting.",
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
      const response = await studioFetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitation: current }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        if (result.error?.code === "STALE_REVISION")
          throw new Error(
            adminContext
              ? "Taklifnoma boshqa oynada o‘zgartirilgan. O‘zgarishlaringiz hozirgi oynada turibdi; qayta yuklashdan oldin nusxasini saqlang."
              : "Taklifnoma boshqa oynada o‘zgartirilgan. Sizning o‘zgartirishlaringiz shu brauzerda saqlandi. Sahifani qayta yuklashdan oldin qoralamangizni yuklab oling va yangilangan taklifnoma bilan solishtiring.",
          );
        throw new Error(
          result.error?.message ??
            (adminContext
              ? "Saqlanmadi. Ushbu oynani yopmasdan qayta urinib ko‘ring."
              : "Hisobingizga saqlanmadi. Qoralamangiz shu brauzerda saqlangan; qayta urinib ko‘ring."),
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
          if (!adminContext)
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
            adminContext
              ? "Saqlash paytida yana o‘zgartirish kiritdingiz. Ushbu oynadagi so‘nggi o‘zgarishlarni yana saqlang."
              : "Saqlash paytida yana o‘zgartirish kiritdingiz. So‘nggi o‘zgartirishlar brauzerda saqlangan; hisobingizga saqlashni yana bosing.",
          );
          return;
        }
        // Reopening/reloading now loads the authoritative account record.
        window.history.replaceState(
          window.history.state,
          "",
          adminContext
            ? `/admin/invitations/${current.id}/edit`
            : `/studio/${current.id}`,
        );
      }
      if (action === "publish") {
        const saved = invitationSchema.parse(result.invitation);
        const publish = () =>
          studioFetch(`/api/invitations/${saved.id}/publish`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ revision: saved.revision }),
          });
        // Retrying this endpoint is safe even if the first response was lost
        // after commit. The server returns the original code and timestamps.
        let publishedResponse: Response;
        try {
          publishedResponse = await publish();
        } catch {
          publishedResponse = await publish();
        }
        let published = await publishedResponse.json();
        if (
          publishedResponse.status === 402 &&
          published.error?.code === "PAYMENT_REQUIRED"
        ) {
          if (adminContext)
            throw new Error(
              "To‘lovni taklifnoma egasi o‘z hisobidan yakunlashi kerak.",
            );
          if (!selectedTemplate)
            throw new Error("Narxni tekshirish uchun dizaynni qayta tanlang.");
          const checkout = await studioFetch(
            `/api/invitations/${saved.id}/checkout`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                revision: saved.revision,
                expectedAmountMinor: selectedTemplate.priceMinor,
              }),
            },
          );
          const result = await checkout.json();
          if (!checkout.ok)
            throw new Error(
              result.error?.message ??
                "To‘lovni boshlab bo‘lmadi. Qoralamangiz saqlangan.",
            );
          // Checkout was prepared asynchronously. Keep the order in our app and
          // let a fresh user tap open its saved URL through Telegram's SDK.
          window.location.assign(
            `/payment/return?order=${encodeURIComponent(result.order.id)}${window.location.hash}`,
          );
          return;
        }
        if (!publishedResponse.ok) {
          // Another tab may already have published this same saved draft.
          const latestResponse = await studioFetch(
            `/api/invitations/${saved.id}`,
            {
              cache: "no-store",
            },
          );
          const latest = latestResponse.ok ? await latestResponse.json() : null;
          if (
            latest?.invitation?.status === "published" &&
            latest.invitation.slug
          )
            published = { invitation: latest.invitation };
          else
            throw new Error(
              published.error?.message ??
                "Nashr qilinmadi. Qayta urinib ko‘ring.",
            );
        }
        const publishedInvitation = invitationSchema.parse(
          published.invitation,
        );
        lastCloudSnapshot.current = JSON.stringify(publishedInvitation);
        invitationRef.current = publishedInvitation;
        setInvitation(publishedInvitation);
        setPublicUrl(published.url);
        try {
          if (!adminContext)
            saveBrowserDraft(publishedInvitation, false, ownerId.current);
        } catch {
          /* Publication succeeded; the link remains visible. */
        }
        setNotice(
          "Taklifnomangiz nashr qilindi. Havolani mehmonlaringiz bilan ulashing.",
        );
        setMobilePreview(false);
        window.scrollTo({ top: 0, behavior: "instant" });
        return;
      }
      setNotice(
        "Taklifnomangiz hisobingizga saqlandi. Uni “Taklifnomalarim” bo‘limidan topasiz.",
      );
    } catch (cause) {
      setError(
        cause instanceof TypeError
          ? "Ulanish uzildi. Qoralamangiz brauzerda saqlangan. Nashr holatini tekshirish uchun sahifani qayta oching."
          : cause instanceof Error
            ? cause.message
            : "Saqlash vaqtincha ishlamadi. Qayta urinib ko‘ring.",
      );
      setMobilePreview(false);
      window.scrollTo({ top: 0, behavior: "instant" });
    } finally {
      setBusy(false);
      setPublishing(false);
      operationInFlight.current = false;
    }
  }
  async function completeLogin() {
    if (!auth) return;
    setBusy(true);
    try {
      const response = await studioFetch("/api/auth/telegram/complete", {
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
      await saveOrPublish(pendingAction.current);
    } catch (cause) {
      setAuthStatus(
        cause instanceof Error ? cause.message : "Qayta urinib ko‘ring.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function upload(
    file: File,
    kind: "image" | "audio",
    artistId?: string,
  ) {
    if (!invitationRef.current) return;
    setError("");
    const mimeFallback: Record<string, string> = {
      mp3: "audio/mpeg",
      m4a: "audio/mp4",
      wav: "audio/wav",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    };
    const detectedType =
      file.type.split(";")[0] ||
      mimeFallback[file.name.split(".").pop()?.toLowerCase() ?? ""] ||
      "";
    const contentType =
      (
        {
          "audio/x-wav": "audio/wav",
          "audio/wave": "audio/wav",
          "audio/mp3": "audio/mpeg",
        } as Record<string, string>
      )[detectedType] || detectedType;
    if (
      (kind === "image" &&
        !["image/jpeg", "image/png", "image/webp"].includes(contentType)) ||
      (kind !== "image" &&
        !["audio/mpeg", "audio/wav", "audio/mp4", "audio/x-m4a"].includes(
          contentType,
        ))
    ) {
      setError(
        "Rasm uchun JPG, PNG yoki WebP; musiqa uchun MP3, WAV yoki M4A tanlang.",
      );
      return;
    }
    if (file.size < 16 || file.size > 15 * 1024 * 1024) {
      setError("Fayl 15 MB dan kichik bo‘lishi kerak.");
      return;
    }
    if (kind === "audio") {
      setAudioPreview(URL.createObjectURL(file));
      setAudioName(file.name);
    }
    setUploading(true);
    try {
      const response = await studioFetch("/api/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          size: file.size,
          contentType,
          kind: kind === "image" ? "image" : "audio",
          draftId: invitationRef.current.id,
        }),
      });
      const prepared = await response.json();
      if (!response.ok || !prepared.upload?.url)
        throw new Error(
          (response.status === 401
            ? "Avval yuqoridagi Saqlash tugmasi orqali Telegram hisobingizga kiring, so‘ng faylni qayta tanlang."
            : prepared.error?.message) ||
            "Faylni yuklash hozircha mavjud emas. Hisobingizga kirganingizni tekshiring va qayta urinib ko‘ring.",
        );
      const uploaded = await studioFetch(prepared.upload.url, {
        method: "PUT",
        headers: prepared.upload.headers,
        body: file,
      });
      if (!uploaded.ok)
        throw new Error(
          "Fayl yuklanmadi. Ulanishni tekshirib, qayta urinib ko‘ring.",
        );
      const complete = await studioFetch(prepared.upload.completeUrl, {
        method: "POST",
      });
      const result = await complete.json();
      if (!complete.ok || !result.asset?.url)
        throw new Error(
          result.error?.message ||
            "Faylni tekshirish yakunlanmadi. Mos formatdagi fayl bilan qayta urinib ko‘ring.",
        );
      const current = invitationRef.current;
      if (kind === "audio") {
        setSavedMusic((items) => [
          {
            id: result.asset.id,
            assetId: result.asset.id,
            url: result.asset.url,
            filename: file.name,
          },
          ...items.filter((item) => item.id !== result.asset.id),
        ]);
        update({
          music: {
            enabled: true,
            assetId: result.asset.id,
            url: result.asset.url,
            filename: file.name,
          },
        });
        setAudioPreview("");
      } else if (artistId) {
        update({
          artistLineup: current.artistLineup.map((artist) =>
            artist.id === artistId
              ? {
                  ...artist,
                  imageUrl: result.asset.url,
                  imageAssetId: result.asset.id ?? null,
                }
              : artist,
          ),
        });
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
  function goToSection(next: number) {
    setSection(next);
    setPreviewTarget(next === 2 ? "location" : "names");
    setMobilePreview(false);
    document
      .querySelector<HTMLDetailsElement>("[data-mobile-steps]")
      ?.removeAttribute("open");
    // Avoid opening the next step halfway down a long form.
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function goToIssue(issue: PublicationIssue) {
    if (issue.locale) setLocale(issue.locale);
    goToSection(issue.section);
    const feature = issue.path.split(".")[0];
    const target =
      feature === "gift" ||
      feature === "music" ||
      feature === "rsvp" ||
      feature === "gallery" ||
      feature === "contacts"
        ? feature
        : null;
    if (target)
      requestAnimationFrame(() => {
        const details = document.querySelector<HTMLDetailsElement>(
          `main details[data-preview-target="${target}"]`,
        );
        if (!details) return;
        details.open = true;
        setPreviewTarget(target);
        details.scrollIntoView({ block: "center", behavior: "instant" });
        details
          .querySelector<HTMLElement>("input, select, textarea, button")
          ?.focus({ preventScroll: true });
      });
  }

  return (
    <div className={styles.studio}>
      <header className={styles.topbar}>
        <Link
          href="/dashboard"
          className={styles.back}
          aria-label="Taklifnomalarimga qaytish"
        >
          <ArrowLeft size={19} />
          <span>Taklifnomalarim</span>
        </Link>
        <div className={styles.toolbarSave}>
          <span className={styles.saveStatus} role="status">
            {saveStatus}
          </span>
          <button
            className={styles.saveButton}
            onClick={cloudSave}
            disabled={busy || uploading || !!auth}
          >
            <Save size={16} />
            {busy
              ? publishing
                ? "Nashr qilinmoqda…"
                : "Saqlanmoqda…"
              : "Saqlash"}
          </button>
        </div>
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
      {!mobilePreview && (
        <details className={styles.mobileStepMenu} data-mobile-steps>
          <summary>
            <span>
              {section + 1} / {sections.length}
            </span>
            {sections[section].title}
            <ChevronRight size={15} />
          </summary>
          <nav aria-label="Qadamni tanlash">
            {sections.map((item, index) => (
              <button
                type="button"
                key={item.title}
                aria-current={index === section ? "step" : undefined}
                onClick={() => goToSection(index)}
              >
                {index + 1}. {item.title}
                {index < section &&
                  !readiness.some((issue) => issue.section === index) && (
                    <Check size={15} />
                  )}
              </button>
            ))}
          </nav>
        </details>
      )}
      <div
        className={`${styles.workspace} ${section === 0 && invitation.templateId ? styles.hasSelectionActions : ""}`}
      >
        <aside
          className={`${styles.sidebar} ${mobilePreview ? styles.mobileHidden : ""}`}
          aria-label="Tahrirlash bo‘limlari"
        >
          <Link href="/dashboard" className={styles.studioBrand}>
            visol<span>Yaratish studiyasi</span>
          </Link>
          <nav>
            {sections.map((item, index) => (
              <button
                key={item.title}
                className={`${styles.sectionButton} ${section === index ? styles.activeSection : ""}`}
                onClick={() => goToSection(index)}
                aria-current={section === index ? "step" : undefined}
              >
                <span className={styles.sectionNumber}>
                  {index < section &&
                  !readiness.some((issue) => issue.section === index) ? (
                    <Check size={15} />
                  ) : (
                    index + 1
                  )}
                </span>
                <span>
                  <strong>
                    <span className={styles.desktopStepTitle}>
                      {item.title}
                    </span>
                    <span className={styles.mobileStepTitle}>{item.short}</span>
                  </strong>
                  <small>{item.note}</small>
                </span>
                {section === index && <ChevronRight size={15} />}
              </button>
            ))}
          </nav>
          {selectedTemplate && (
            <button
              className={styles.selectedDesign}
              onClick={() => goToSection(0)}
            >
              <span className={styles.selectedDesignIcon}>
                <LayoutTemplate size={21} strokeWidth={1.2} />
              </span>
              <span>
                <small>Tanlangan dizayn</small>
                <strong>{selectedTemplate.name}</strong>
              </span>
              <ChevronRight size={14} />
            </button>
          )}
        </aside>
        <main
          id="main"
          className={`${styles.editor} ${mobilePreview ? styles.mobileHidden : ""}`}
          onFocusCapture={(event) => {
            const target = event.target.closest<HTMLElement>(
              "[data-preview-target]",
            )?.dataset.previewTarget;
            if (target) setPreviewTarget(target as PreviewTarget);
          }}
          onClickCapture={(event) => {
            const target = (event.target as HTMLElement).closest<HTMLElement>(
              "[data-preview-target]",
            )?.dataset.previewTarget;
            if (target) setPreviewTarget(target as PreviewTarget);
          }}
        >
          <fieldset className={styles.editorFields} disabled={busy}>
            {adminContext && (
              <section
                className="inline-note"
                style={{ padding: 18, marginBottom: 20 }}
              >
                <strong>Administrator tahriri: {adminContext.ownerName}</strong>
                <p style={{ fontSize: 13, lineHeight: 1.7 }}>
                  Taklifnoma egasi o‘zgarmaydi. Har bir saqlash sizning
                  nomingizdan tarixga yoziladi.
                </p>
                <label style={{ display: "grid", gap: 8, fontSize: 13 }}>
                  Amal sababi
                  <input
                    name="adminReason"
                    value={adminReason}
                    onChange={(event) => setAdminReason(event.target.value)}
                    minLength={5}
                    maxLength={500}
                    required
                    style={{
                      padding: 12,
                      border: "1px solid var(--line)",
                      borderRadius: 6,
                    }}
                  />
                </label>
                <a
                  href="/admin?view=invitations"
                  className="button secondary"
                  style={{ marginTop: 12 }}
                >
                  Boshqaruvga qaytish
                </a>
                <a
                  href="/admin/verify"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button secondary"
                  style={{ marginTop: 12, marginLeft: 8 }}
                >
                  Hisobni tasdiqlash
                </a>
              </section>
            )}
            {invitation.status === "published" && invitation.slug && (
              <PublishedLink slug={invitation.slug} canonicalUrl={publicUrl} />
            )}
            {publishIssues.length > 0 && (
              <div className={styles.publicationErrors} role="alert">
                <strong>Nashr qilishdan oldin to‘ldiring</strong>
                <ul>
                  {publishIssues.map((issue) => (
                    <li key={issue.path}>
                      <button type="button" onClick={() => goToIssue(issue)}>
                        {issue.message}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className={styles.editorIntro}>
              <h1>{sections[section].title}</h1>
              <p>{sections[section].description}</p>
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
                  <button
                    aria-label="Xatoni yopish"
                    onClick={() => setError("")}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
            {section !== 2 && (
              <details className={styles.languageDisclosure}>
                <summary>
                  <Globe2 size={15} />
                  {LANGUAGE_NAMES[locale]}
                  <span>
                    {invitation.enabledLocales.length > 1
                      ? `${invitation.enabledLocales.length} til`
                      : "Til sozlamalari"}
                  </span>
                </summary>
                <div className={styles.languages}>
                  <Globe2 size={16} />
                  <div className={styles.languageTabs}>
                    {invitation.enabledLocales.map((item) => (
                      <span className={styles.languageItem} key={item}>
                        <button
                          className={
                            locale === item ? styles.activeLanguage : ""
                          }
                          aria-pressed={locale === item}
                          onClick={() => setLocale(item)}
                        >
                          {LANGUAGE_NAMES[item]}
                          {item === invitation.defaultLocale && (
                            <span
                              className={styles.primaryDot}
                              title="Asosiy til"
                            />
                          )}
                        </button>
                        {item !== invitation.defaultLocale &&
                          !identityLocked && (
                            <button
                              type="button"
                              className={styles.removeLanguage}
                              aria-label={`${LANGUAGE_NAMES[item]} tilini olib tashlash`}
                              title="Tilni olib tashlash"
                              onClick={() => {
                                setInvitation(removeLanguage(invitation, item));
                                if (locale === item)
                                  setLocale(invitation.defaultLocale);
                              }}
                            >
                              <X size={12} />
                            </button>
                          )}
                      </span>
                    ))}
                  </div>
                  {invitation.enabledLocales.length < 4 && !identityLocked && (
                    <div className={styles.addLanguage}>
                      <SoftSelect
                        label="Til qo‘shish"
                        value=""
                        placeholder={placeholders.addLanguage}
                        options={LOCALES.filter(
                          (item) => !invitation.enabledLocales.includes(item),
                        ).map((item) => ({
                          value: item,
                          label: LANGUAGE_NAMES[item],
                        }))}
                        onChange={(value) => {
                          const next = value as Locale;
                          setInvitation(
                            addInvitationLanguage(invitation, next),
                          );
                          setLocale(next);
                        }}
                      />
                    </div>
                  )}
                </div>
              </details>
            )}

            {section === 1 && (
              <div className={styles.form}>
                {invitation.enabledLocales.length > 1 && (
                  <div className={styles.languageHint}>
                    <span>
                      {LANGUAGE_NAMES[locale]} matnlarini kiriting. Sana,
                      rasmlar va boshqa umumiy ma’lumotlar barcha tillarda bir
                      xil.
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
                <div className={styles.groupHeader}>
                  <h2>Kimning quvonchli kuni?</h2>
                  {!singleCelebrant && (
                    <button
                      className={styles.textButton}
                      disabled={identityLocked || content.people.length >= 20}
                      onClick={() =>
                        updateContent({
                          people: [...personFields, ""],
                        })
                      }
                    >
                      <Plus size={15} />
                      Ism qo‘shish
                    </button>
                  )}
                </div>
                <div className={styles.twoColumns}>
                  {personFields.map((name, index) => (
                    <Field
                      label={
                        singleCelebrant && index === 0
                          ? singleCelebrantLabel
                          : invitation.eventType === "wedding" && index < 2
                            ? index === 0
                              ? "Kuyov ismi"
                              : "Kelin ismi"
                            : `${index + 1}-ism`
                      }
                      key={index}
                    >
                      <div className={styles.inlineInput}>
                        <input
                          value={name}
                          maxLength={300}
                          disabled={identityLocked}
                          onChange={(event) =>
                            person(index, event.target.value)
                          }
                          placeholder={
                            singleCelebrant && index === 0
                              ? singleCelebrantPlaceholder
                              : invitation.eventType === "wedding" && index < 2
                                ? index === 0
                                  ? placeholders.groomName
                                  : placeholders.brideName
                                : placeholders.personName
                          }
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
                {invitation.eventType === "birthday" && (
                  <Field label="Bayram sohibining yoshi" hint="Ixtiyoriy. Tug‘ilgan kun dizaynlarida ko‘rsatiladi.">
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={invitation.celebrantAge ?? ""}
                      onChange={(event) => {
                        const value = event.target.value;
                        update({ celebrantAge: value === "" ? null : Math.min(120, Math.max(1, Number(value))) });
                      }}
                    />
                  </Field>
                )}
                <Field label="Oila yoki mezbonlar" hint="Ixtiyoriy">
                  <input
                    value={content.hosts}
                    placeholder={placeholders.family}
                    maxLength={300}
                    disabled={identityLocked}
                    onChange={(event) =>
                      updateContent({ hosts: event.target.value })
                    }
                  />
                </Field>
                {invitation.templateId === "wedivo-pulau-sehati" && (
                  <Field label="Birga taklif etuvchilar">
                    <textarea
                      value={pulauData.coInviters}
                      maxLength={1000}
                      rows={2}
                      onChange={(event) =>
                        updatePulauData({ coInviters: event.target.value })
                      }
                    />
                  </Field>
                )}
                <div className={styles.divider} />
                <Field
                  label="Tadbir nomi"
                  hint="Bu matn taklifnomada ko‘rinadi."
                >
                  <input
                    value={
                      content.eventLabel ||
                      defaultEventLabel(invitation.eventType, locale)
                    }
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
                {(invitation.templateId === "muhabbat-kitobi" ||
                  invitation.story.length > 0) && (
                  <>
                    <div className={styles.divider} />
                    <div className={styles.groupHeader}>
                      <div>
                        <h2>Hikoya boblari</h2>
                        <p className={styles.help}>
                          Ixtiyoriy. Muhabbat Kitobi dizaynida ko‘rsatiladi. Har
                          bir til uchun matnni alohida kiriting.
                        </p>
                      </div>
                      <button
                        className={styles.textButton}
                        disabled={invitation.story.length >= 20}
                        onClick={() =>
                          update({
                            story: [
                              ...invitation.story,
                              { id: crypto.randomUUID(), title: {}, text: {} },
                            ],
                          })
                        }
                      >
                        <Plus size={15} />
                        Bob qo‘shish
                      </button>
                    </div>
                    {invitation.story.map((chapter, index) => (
                      <div className={styles.storyItem} key={chapter.id}>
                        <div className={styles.groupHeader}>
                          <h3>{index + 1}-bob</h3>
                          <button
                            className={styles.iconButton}
                            aria-label={`${index + 1}-bobni olib tashlash`}
                            onClick={() =>
                              update({
                                story: invitation.story.filter(
                                  (item) => item.id !== chapter.id,
                                ),
                              })
                            }
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <Field label="Sarlavha">
                          <input
                            value={chapter.title[locale] ?? ""}
                            maxLength={300}
                            onChange={(event) =>
                              update({
                                story: invitation.story.map((item) =>
                                  item.id === chapter.id
                                    ? {
                                        ...item,
                                        title: {
                                          ...item.title,
                                          [locale]: event.target.value,
                                        },
                                      }
                                    : item,
                                ),
                              })
                            }
                          />
                        </Field>
                        <Field label="Hikoya matni">
                          <textarea
                            value={chapter.text[locale] ?? ""}
                            maxLength={10000}
                            rows={5}
                            onChange={(event) =>
                              update({
                                story: invitation.story.map((item) =>
                                  item.id === chapter.id
                                    ? {
                                        ...item,
                                        text: {
                                          ...item.text,
                                          [locale]: event.target.value,
                                        },
                                      }
                                    : item,
                                ),
                              })
                            }
                          />
                        </Field>
                        {invitation.templateId === "wedivo-pulau-sehati" && (
                          <Field label="Hikoya sanasi">
                            <input
                              type="date"
                              value={pulauData.storyDates[chapter.id] ?? ""}
                              onChange={(event) =>
                                updatePulauData({
                                  storyDates: {
                                    ...pulauData.storyDates,
                                    [chapter.id]: event.target.value,
                                  },
                                })
                              }
                            />
                          </Field>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
            {invitation.templateId === "wedivo-pulau-sehati" && (
              <div className={styles.form}>
                <h2>Pulau Sehati — ma’lumotlar</h2>
                <Field label="Arabcha bitik">
                  <textarea
                    dir="rtl"
                    rows={3}
                    value={pulauData.inscription.arabic}
                    onChange={(event) =>
                      updatePulauData({
                        inscription: {
                          ...pulauData.inscription,
                          arabic: event.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <Field label="Bitik tarjimasi">
                  <textarea
                    rows={3}
                    value={pulauData.inscription.text[locale] ?? ""}
                    onChange={(event) =>
                      updatePulauData({
                        inscription: {
                          ...pulauData.inscription,
                          text: {
                            ...pulauData.inscription.text,
                            [locale]: event.target.value,
                          },
                        },
                      })
                    }
                  />
                </Field>
                <Field label="Manba yoki muallif">
                  <input
                    value={pulauData.inscription.attribution[locale] ?? ""}
                    onChange={(event) =>
                      updatePulauData({
                        inscription: {
                          ...pulauData.inscription,
                          attribution: {
                            ...pulauData.inscription.attribution,
                            [locale]: event.target.value,
                          },
                        },
                      })
                    }
                  />
                </Field>
                {[0, 1].map((index) => (
                  <div key={index}>
                    <h3>{index === 0 ? "Kuyov" : "Kelin"} profili</h3>
                    <Field label="Sinf">
                      <input
                        value={pulauData.profiles[index].characterClass}
                        onChange={(event) =>
                          updatePulauData({
                            profiles: pulauData.profiles.map((row, i) =>
                              i === index
                                ? { ...row, characterClass: event.target.value }
                                : row,
                            ),
                          })
                        }
                      />
                    </Field>
                    <Field label="Kelib chiqishi">
                      <input
                        value={pulauData.profiles[index].origin}
                        onChange={(event) =>
                          updatePulauData({
                            profiles: pulauData.profiles.map((row, i) =>
                              i === index
                                ? { ...row, origin: event.target.value }
                                : row,
                            ),
                          })
                        }
                      />
                    </Field>
                    <Field label="Ota-onalar haqida">
                      <textarea
                        value={pulauData.profiles[index].bio[locale] ?? ""}
                        onChange={(event) =>
                          updatePulauData({
                            profiles: pulauData.profiles.map((row, i) =>
                              i === index
                                ? {
                                    ...row,
                                    bio: {
                                      ...row.bio,
                                      [locale]: event.target.value,
                                    },
                                  }
                                : row,
                            ),
                          })
                        }
                      />
                    </Field>
                    <Field label="Maxsus mahorat">
                      <input
                        value={pulauData.profiles[index].skill}
                        onChange={(event) =>
                          updatePulauData({
                            profiles: pulauData.profiles.map((row, i) =>
                              i === index
                                ? { ...row, skill: event.target.value }
                                : row,
                            ),
                          })
                        }
                      />
                    </Field>
                    <Field label="Esdalik buyumi">
                      <input
                        value={pulauData.profiles[index].item}
                        onChange={(event) =>
                          updatePulauData({
                            profiles: pulauData.profiles.map((row, i) =>
                              i === index
                                ? { ...row, item: event.target.value }
                                : row,
                            ),
                          })
                        }
                      />
                    </Field>
                    <h4>Statistika (0–10)</h4>
                    {Array.from({ length: 6 }, (_, statIndex) => (
                      <div className={styles.inlineInput} key={statIndex}>
                        <input
                          aria-label="Stat nomi"
                          placeholder="Masalan: Mehr"
                          value={
                            pulauData.profiles[index].stats[statIndex]?.label ??
                            ""
                          }
                          onChange={(event) =>
                            updatePulauData({
                              profiles: pulauData.profiles.map((row, i) => {
                                if (i !== index) return row;
                                const stats = Array.from(
                                  {
                                    length: Math.max(
                                      row.stats.length,
                                      statIndex + 1,
                                    ),
                                  },
                                  (_, j) =>
                                    row.stats[j] ?? { label: "", value: 0 },
                                );
                                stats[statIndex] = {
                                  label: event.target.value,
                                  value: stats[statIndex].value,
                                };
                                return { ...row, stats };
                              }),
                            })
                          }
                        />
                        <input
                          aria-label="Stat qiymati"
                          type="number"
                          min={0}
                          max={10}
                          value={
                            pulauData.profiles[index].stats[statIndex]?.value ??
                            0
                          }
                          onChange={(event) =>
                            updatePulauData({
                              profiles: pulauData.profiles.map((row, i) => {
                                if (i !== index) return row;
                                const stats = Array.from(
                                  {
                                    length: Math.max(
                                      row.stats.length,
                                      statIndex + 1,
                                    ),
                                  },
                                  (_, j) =>
                                    row.stats[j] ?? { label: "", value: 0 },
                                );
                                stats[statIndex] = {
                                  label: stats[statIndex].label,
                                  value: Number(event.target.value),
                                };
                                return { ...row, stats };
                              }),
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                ))}
                <Field label="Hashtag">
                  <input
                    value={pulauData.hashtag}
                    onChange={(event) =>
                      updatePulauData({ hashtag: event.target.value })
                    }
                  />
                </Field>
                <h2>Mehmonxonalar</h2>
                {Array.from({ length: 2 }, (_, index) => (
                  <div key={index}>
                    <h3>{index + 1}-mehmonxona</h3>
                    {(
                      [
                        "name",
                        "address",
                        "distance",
                        "price",
                        "bookingUrl",
                        "note",
                      ] as const
                    ).map((key) => (
                      <Field
                        key={key}
                        label={
                          {
                            name: "Nomi",
                            address: "Manzil",
                            distance: "Masofa",
                            price: "Narx",
                            bookingUrl: "Bron havolasi",
                            note: "Izoh",
                          }[key]
                        }
                      >
                        <input
                          value={pulauData.hotels[index]?.[key] ?? ""}
                          onChange={(event) => {
                            const hotels = [...pulauData.hotels];
                            hotels[index] = {
                              ...{
                                name: "",
                                address: "",
                                distance: "",
                                price: "",
                                bookingUrl: "",
                                note: "",
                              },
                              ...hotels[index],
                              [key]: event.target.value,
                            };
                            updatePulauData({ hotels });
                          }}
                        />
                      </Field>
                    ))}
                  </div>
                ))}
                <h2>Video va jonli efir</h2>
                <Field label="Video URL">
                  <input
                    value={pulauData.media.videoUrl}
                    onChange={(event) =>
                      updatePulauData({
                        media: {
                          ...pulauData.media,
                          videoUrl: event.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <Field label="YouTube / jonli efir URL">
                  <input
                    value={pulauData.media.liveUrl}
                    onChange={(event) =>
                      updatePulauData({
                        media: {
                          ...pulauData.media,
                          liveUrl: event.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <Field label="Izoh">
                  <textarea
                    value={pulauData.media.intro}
                    onChange={(event) =>
                      updatePulauData({
                        media: {
                          ...pulauData.media,
                          intro: event.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <h2>Mehmonlar uchun topshiriqlar</h2>
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={index}>
                    <h3>{index + 1}-topshiriq</h3>
                    {(["title", "description", "reward"] as const).map(
                      (key) => (
                        <Field
                          key={key}
                          label={
                            {
                              title: "Nomi",
                              description: "Tavsifi",
                              reward: "Mukofoti",
                            }[key]
                          }
                        >
                          <input
                            value={pulauData.missions[index]?.[key] ?? ""}
                            onChange={(event) => {
                              const missions = [...pulauData.missions];
                              missions[index] = {
                                ...{ title: "", description: "", reward: "" },
                                ...missions[index],
                                [key]: event.target.value,
                              };
                              updatePulauData({ missions });
                            }}
                          />
                        </Field>
                      ),
                    )}
                  </div>
                ))}
                <h2>Esdaliklar</h2>
                {Array.from({ length: 6 }, (_, index) => (
                  <div key={index}>
                    <h3>{index + 1}-esdalik</h3>
                    <Field label="Nomi">
                      <input
                        value={pulauData.keepsakes[index]?.name ?? ""}
                        onChange={(event) => {
                          const keepsakes = [...pulauData.keepsakes];
                          keepsakes[index] = {
                            ...{
                              name: "",
                              anecdote: "",
                              icon: "cincin" as const,
                            },
                            ...keepsakes[index],
                            name: event.target.value,
                          };
                          updatePulauData({ keepsakes });
                        }}
                      />
                    </Field>
                    <Field label="Hikoya">
                      <textarea
                        value={pulauData.keepsakes[index]?.anecdote ?? ""}
                        onChange={(event) => {
                          const keepsakes = [...pulauData.keepsakes];
                          keepsakes[index] = {
                            ...{
                              name: "",
                              anecdote: "",
                              icon: "cincin" as const,
                            },
                            ...keepsakes[index],
                            anecdote: event.target.value,
                          };
                          updatePulauData({ keepsakes });
                        }}
                      />
                    </Field>
                    <Field label="Belgi">
                      <select
                        value={pulauData.keepsakes[index]?.icon ?? "cincin"}
                        onChange={(event) => {
                          const keepsakes = [...pulauData.keepsakes];
                          keepsakes[index] = {
                            ...{
                              name: "",
                              anecdote: "",
                              icon: "cincin" as const,
                            },
                            ...keepsakes[index],
                            icon: event.target
                              .value as (typeof pulauData.keepsakes)[number]["icon"],
                          };
                          updatePulauData({ keepsakes });
                        }}
                      >
                        <option value="tiket">Tiket</option>
                        <option value="stik">Stik</option>
                        <option value="surat">Xat</option>
                        <option value="kerang">Chig‘anoq</option>
                        <option value="kunci">Kalit</option>
                        <option value="cincin">Uzuk</option>
                        <option value="bunga">Gul</option>
                        <option value="kamera">Kamera</option>
                      </select>
                    </Field>
                  </div>
                ))}
                <Toggle
                  title="Niyat qudug‘i"
                  description="Mehmon yuborgan summa va xabar taklif egasiga niyat sifatida saqlanadi; pul o‘tkazilmaydi."
                  checked={pulauData.giftWell.enabled}
                  onChange={(enabled) =>
                    updatePulauData({
                      giftWell: { ...pulauData.giftWell, enabled },
                    })
                  }
                />
                <Field label="Valyuta belgisi">
                  <input
                    value={pulauData.giftWell.currencyLabel}
                    maxLength={30}
                    onChange={(event) =>
                      updatePulauData({
                        giftWell: {
                          ...pulauData.giftWell,
                          currencyLabel: event.target.value,
                        },
                      })
                    }
                  />
                </Field>
              </div>
            )}

            {section === 2 && (
              <div className={styles.form}>
                <h2>Sana va vaqt</h2>
                <Field label="Tadbir boshlanishi">
                  <DateTimePicker
                    value={invitation.startsAt}
                    disabled={identityLocked}
                    onChange={(startsAt) => update({ startsAt })}
                  />
                </Field>
                {invitation.templateId === "wedivo-pulau-sehati" && (
                  <>
                    <div className={styles.divider} />
                    <Toggle
                      title="Ikkinchi marosim"
                      description="Masalan, nikoh va ziyofat uchun alohida vaqt va manzil."
                      checked={pulauData.secondaryEvent.enabled}
                      onChange={(enabled) =>
                        updatePulauData({
                          secondaryEvent: {
                            ...pulauData.secondaryEvent,
                            enabled,
                          },
                        })
                      }
                    />
                    {pulauData.secondaryEvent.enabled && (
                      <>
                        <Field label="Marosim nomi">
                          <input
                            value={pulauData.secondaryEvent.label}
                            maxLength={300}
                            onChange={(event) =>
                              updatePulauData({
                                secondaryEvent: {
                                  ...pulauData.secondaryEvent,
                                  label: event.target.value,
                                },
                              })
                            }
                          />
                        </Field>
                        <Field label="Sana">
                          <input
                            type="date"
                            value={pulauData.secondaryEvent.date}
                            onChange={(event) =>
                              updatePulauData({
                                secondaryEvent: {
                                  ...pulauData.secondaryEvent,
                                  date: event.target.value,
                                },
                              })
                            }
                          />
                        </Field>
                        <Field label="Vaqt">
                          <TimePicker
                            value={pulauData.secondaryEvent.time}
                            onChange={(time) =>
                              updatePulauData({
                                secondaryEvent: {
                                  ...pulauData.secondaryEvent,
                                  time,
                                },
                              })
                            }
                          />
                        </Field>
                        <Field label="Joy nomi">
                          <input
                            value={pulauData.secondaryEvent.venueName}
                            onChange={(event) =>
                              updatePulauData({
                                secondaryEvent: {
                                  ...pulauData.secondaryEvent,
                                  venueName: event.target.value,
                                },
                              })
                            }
                          />
                        </Field>
                        <Field label="Manzil">
                          <textarea
                            value={pulauData.secondaryEvent.address}
                            maxLength={1000}
                            onChange={(event) =>
                              updatePulauData({
                                secondaryEvent: {
                                  ...pulauData.secondaryEvent,
                                  address: event.target.value,
                                },
                              })
                            }
                          />
                        </Field>
                        <Field label="Xarita URL">
                          <input
                            value={pulauData.secondaryEvent.mapUrl}
                            onChange={(event) =>
                              updatePulauData({
                                secondaryEvent: {
                                  ...pulauData.secondaryEvent,
                                  mapUrl: event.target.value,
                                },
                              })
                            }
                          />
                        </Field>
                      </>
                    )}
                  </>
                )}
                {identityLocked && (
                  <p className={styles.help}>
                    Sanani ko‘chirish administrator tasdig‘i bilan amalga
                    oshiriladi.
                  </p>
                )}
                <div className={styles.divider} />
                <h2>Manzil</h2>
                <Field
                  label="To‘yxona yoki joy nomi"
                  hint="Nomni yozib Google Maps joylaridan tanlang yoki qo‘lda kiriting."
                >
                  <PlaceSearch
                    value={content.venueName}
                    locale={locale}
                    onChange={(value) => updateContent({ venueName: value })}
                    onSelect={(place) => {
                      updateContent({
                        venueName: place.name,
                        address: place.address,
                      });
                      update({
                        venue: {
                          latitude: place.latitude,
                          longitude: place.longitude,
                          mapUrl: place.mapUrl,
                        },
                      });
                    }}
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
                    placeholder={placeholders.optional}
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
                  {invitation.program.map((item) => (
                    <div key={item.id} className={styles.programItem}>
                      <span className={styles.timelineDot} />
                      <div className={styles.programPreview}>
                        <div className={styles.programPreviewLine}>
                          <TimePicker
                            compact
                            value={item.time}
                            onChange={(time) =>
                              update({
                                program: invitation.program.map((row) =>
                                  row.id === item.id ? { ...row, time } : row,
                                ),
                              })
                            }
                          />
                          <input
                            className={styles.programPreviewInput}
                            aria-label="Dastur bandi nomi"
                            value={content.programTitles[item.id] ?? ""}
                            maxLength={PROGRAM_TITLE_MAX_LENGTH}
                            onChange={(event) =>
                              updateContent({
                                programTitles: {
                                  ...content.programTitles,
                                  [item.id]: event.target.value,
                                },
                              })
                            }
                            placeholder={placeholders.programItem}
                          />
                          <button
                            type="button"
                            className={styles.programDeleteButton}
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
                        {invitation.templateId === "invitate-wedding" && (
                          <textarea
                            className={styles.programDescriptionInput}
                            aria-label="Dastur bandi izohi"
                            value={content.programDescriptions[item.id] ?? ""}
                            maxLength={PROGRAM_DESCRIPTION_MAX_LENGTH}
                            rows={2}
                            placeholder="Dastur bandi haqida qisqacha"
                            onChange={(event) =>
                              updateContent({
                                programDescriptions: {
                                  ...content.programDescriptions,
                                  [item.id]: event.target.value,
                                },
                              })
                            }
                          />
                        )}
                        <span className={styles.programTitleCount}>
                          {(content.programTitles[item.id] ?? "").length}/
                          {PROGRAM_TITLE_MAX_LENGTH}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className={styles.addButton}
                  disabled={invitation.program.length >= 100}
                  onClick={() =>
                    setInvitation(addStarterProgramItem(invitation))
                  }
                >
                  <Plus size={17} />
                  Dastur bandini qo‘shish
                </button>
                <section
                  className={styles.programSectionPreview}
                  aria-label="Taklifnomadagi dastur ko‘rinishi"
                >
                  <span className={styles.programSectionPreviewEyebrow}>
                    Taklifnomada ko‘rinishi
                  </span>
                  <h3>{content.programHeading || "To‘y dasturi"}</h3>
                  {invitation.program.length ? (
                    <ol>
                      {invitation.program.map((item) => (
                        <li key={item.id}>
                          <time>{item.time || "--:--"}</time>
                          <span>
                            {content.programTitles[item.id]?.trim() ||
                              placeholders.programItem}
                            {invitation.templateId === "invitate-wedding" &&
                              content.programDescriptions[item.id]?.trim() && (
                                <small>
                                  {content.programDescriptions[item.id]}
                                </small>
                              )}
                          </span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p>Dastur bandlari shu yerda ko‘rinadi.</p>
                  )}
                </section>
                <div className={styles.divider} />
                <Toggle
                  title="Kiyinish uslubi"
                  description="Taklifnomaga ixtiyoriy kiyinish uslubi va ranglar palitrasini qo‘shing."
                  checked={invitation.dressCode.enabled}
                  onChange={(enabled) => {
                    if (!enabled) {
                      updateDressCode({ enabled: false });
                      return;
                    }
                    updateDressCode(
                      fillDressCodeDefaults(invitation.dressCode),
                    );
                  }}
                />
                {invitation.dressCode.enabled && (
                  <div className={styles.optionBody}>
                    <Field label="Kiyinish uslubi">
                      <input
                        value={invitation.dressCode.style[locale] ?? ""}
                        maxLength={300}
                        onChange={(event) =>
                          updateDressCodeText("style", event.target.value)
                        }
                      />
                    </Field>
                    <Field label="Mehmonlar uchun izoh">
                      <textarea
                        value={invitation.dressCode.text[locale] ?? ""}
                        maxLength={10000}
                        rows={3}
                        onChange={(event) =>
                          updateDressCodeText("text", event.target.value)
                        }
                      />
                    </Field>
                    <Field label="Qo‘shimcha eslatma" hint="Ixtiyoriy">
                      <textarea
                        value={invitation.dressCode.note[locale] ?? ""}
                        maxLength={10000}
                        rows={2}
                        onChange={(event) =>
                          updateDressCodeText("note", event.target.value)
                        }
                      />
                    </Field>
                    <div className={styles.sectionHeading}>
                      <strong>Ranglar palitrasi</strong>
                      <span>{invitation.dressCode.colors.length}/12</span>
                    </div>
                    {invitation.dressCode.colors.map((color, index) => (
                      <div key={color.id} className={styles.twoColumns}>
                        <Field label={`${index + 1}-rang nomi`}>
                          <input
                            value={color.name[locale] ?? ""}
                            maxLength={300}
                            onChange={(event) =>
                              updateDressCode({
                                colors: invitation.dressCode.colors.map(
                                  (item) =>
                                    item.id === color.id
                                      ? {
                                          ...item,
                                          name: {
                                            ...item.name,
                                            [locale]: event.target.value,
                                          },
                                        }
                                      : item,
                                ),
                              })
                            }
                          />
                        </Field>
                        <Field label="Rang kodi">
                          <input
                            type="color"
                            value={color.hex}
                            onChange={(event) =>
                              updateDressCode({
                                colors: invitation.dressCode.colors.map(
                                  (item) =>
                                    item.id === color.id
                                      ? { ...item, hex: event.target.value }
                                      : item,
                                ),
                              })
                            }
                          />
                        </Field>
                        <button
                          className={styles.textButton}
                          type="button"
                          onClick={() =>
                            updateDressCode({
                              colors: invitation.dressCode.colors.filter(
                                (item) => item.id !== color.id,
                              ),
                            })
                          }
                        >
                          <Trash2 size={14} /> Rangni olib tashlash
                        </button>
                      </div>
                    ))}
                    <button
                      className={styles.addButton}
                      type="button"
                      disabled={invitation.dressCode.colors.length >= 12}
                      onClick={() =>
                        updateDressCode({
                          colors: [
                            ...invitation.dressCode.colors,
                            {
                              id: crypto.randomUUID(),
                              name: { [locale]: "" },
                              hex: "#c9a55c",
                            },
                          ],
                        })
                      }
                    >
                      <Plus size={17} /> Rang qo‘shish
                    </button>
                  </div>
                )}
              </div>
            )}

            {section === 0 && (
              <div className={styles.form}>
                <Field label="Tadbir turi">
                  <SoftSelect
                    label="Tadbir turi"
                    value={invitation.eventType}
                    disabled={identityLocked}
                    options={EVENT_TYPE_OPTIONS.map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                    onChange={changeEventType}
                  />
                </Field>
                {catalogNote && <p className={styles.help}>{catalogNote}</p>}
                <StudioTemplatePicker
                  invitation={invitation}
                  templates={compatibleTemplates}
                  categories={categories}
                  disabled={identityLocked}
                  onSelect={(id) =>
                    setInvitation(switchTemplate(invitation, id))
                  }
                />
                {identityLocked && (
                  <p className={styles.help}>
                    Nashr qilingan taklifnomada dizaynni almashtirish hozircha
                    mavjud emas.
                  </p>
                )}
              </div>
            )}

            {section === 3 && (
              <div className={styles.form}>
                <OptionalSection
                  title="Rasmlar"
                  summary={`${invitation.gallery.length} ta rasm`}
                  target="gallery"
                >
                  <div className={styles.groupHeader}>
                    <h2>
                      <ImagePlus size={20} />
                      Xotiralaringiz
                    </h2>
                    <span className={styles.optional}>Ixtiyoriy</span>
                  </div>
                  <p className={styles.help}>
                    O‘zingiz uchun qadrli rasmlarni qo‘shing. Dizayn o‘zgarsa
                    ham ular saqlanadi.
                  </p>
                  <label className={styles.uploadBox}>
                    <ImagePlus size={25} />
                    <strong>
                      {uploading ? "Yuklanmoqda…" : "Rasm yuklash"}
                    </strong>
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
                            setError(
                              "To‘liq https:// rasm havolasini kiriting.",
                            );
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
                </OptionalSection>
                {invitation.templateId === "invitate-wedding" && (
                  <OptionalSection
                    title="San’atkorlar va boshlovchilar"
                    summary={`${invitation.artistLineup.length} ta ishtirokchi`}
                  >
                    <div className={styles.divider} />
                    <div className={styles.groupHeader}>
                      <h2>
                        <Users size={20} /> San’atkorlar va boshlovchilar
                      </h2>
                      <button
                        className={styles.textButton}
                        disabled={
                          identityLocked || invitation.artistLineup.length >= 50
                        }
                        onClick={() =>
                          update({
                            artistLineup: [
                              ...invitation.artistLineup,
                              {
                                id: crypto.randomUUID(),
                                name: {},
                                role: {},
                                imageUrl: "",
                                imageAssetId: null,
                              },
                            ],
                          })
                        }
                      >
                        <Plus size={15} /> San’atkor qo‘shish
                      </button>
                    </div>
                    <p className={styles.help}>
                      Ism, vazifa va suratni kiriting. Har bir yoqilgan tilda
                      ism va vazifani alohida yozishingiz mumkin.
                    </p>
                    {invitation.artistLineup.map((artist, index) => (
                      <div className={styles.storyItem} key={artist.id}>
                        <div className={styles.twoColumns}>
                          <Field
                            label={`${index + 1}-san’atkor ismi · ${LANGUAGE_NAMES[locale]}`}
                          >
                            <input
                              value={artist.name[locale] ?? ""}
                              maxLength={300}
                              disabled={identityLocked}
                              onChange={(event) =>
                                update({
                                  artistLineup: invitation.artistLineup.map(
                                    (row) =>
                                      row.id === artist.id
                                        ? {
                                            ...row,
                                            name: {
                                              ...row.name,
                                              [locale]: event.target.value,
                                            },
                                          }
                                        : row,
                                  ),
                                })
                              }
                            />
                          </Field>
                          <Field label={`Vazifasi · ${LANGUAGE_NAMES[locale]}`}>
                            <input
                              value={artist.role[locale] ?? ""}
                              maxLength={300}
                              disabled={identityLocked}
                              onChange={(event) =>
                                update({
                                  artistLineup: invitation.artistLineup.map(
                                    (row) =>
                                      row.id === artist.id
                                        ? {
                                            ...row,
                                            role: {
                                              ...row.role,
                                              [locale]: event.target.value,
                                            },
                                          }
                                        : row,
                                  ),
                                })
                              }
                            />
                          </Field>
                          <Field label="Portret havolasi">
                            <input
                              type="url"
                              value={artist.imageUrl}
                              maxLength={2048}
                              disabled={identityLocked}
                              placeholder="https://…"
                              onChange={(event) =>
                                update({
                                  artistLineup: invitation.artistLineup.map(
                                    (row) =>
                                      row.id === artist.id
                                        ? {
                                            ...row,
                                            imageUrl: event.target.value,
                                            imageAssetId: null,
                                          }
                                        : row,
                                  ),
                                })
                              }
                            />
                          </Field>
                          <label className={styles.audioUpload}>
                            <ImagePlus size={18} />
                            <span>
                              {artist.imageUrl
                                ? "Portretni almashtirish"
                                : "Portret yuklash"}
                              <small>JPG, PNG yoki WebP · 15 MB gacha</small>
                            </span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              disabled={uploading || identityLocked}
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) void upload(file, "image", artist.id);
                                event.target.value = "";
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            className={styles.iconButton}
                            aria-label="San’atkorni olib tashlash"
                            disabled={identityLocked}
                            onClick={() =>
                              update({
                                artistLineup: invitation.artistLineup.filter(
                                  (row) => row.id !== artist.id,
                                ),
                              })
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </OptionalSection>
                )}
                <div className={styles.divider} />
                <OptionalSection
                  title="Musiqa"
                  summary={
                    invitation.music.enabled
                      ? invitation.music.filename || "Yoqilgan"
                      : "O‘chirilgan"
                  }
                  target="music"
                >
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
                      <Field label="Musiqa kutubxonasi">
                        <SoftSelect
                          label="Musiqa kutubxonasi"
                          value={
                            savedMusic.find((item) =>
                              invitation.music.assetId
                                ? item.assetId === invitation.music.assetId
                                : item.url === invitation.music.url,
                            )?.id ?? ""
                          }
                          disabled={
                            musicLibraryLoading || savedMusic.length === 0
                          }
                          placeholder={
                            musicLibraryLoading
                              ? placeholders.musicLoading
                              : savedMusic.length
                                ? placeholders.chooseMusic
                                : placeholders.noMusic
                          }
                          options={savedMusic.map((track) => ({
                            value: track.id,
                            label: track.filename,
                          }))}
                          onChange={(value) => {
                            const track = savedMusic.find(
                              (item) => item.id === value,
                            );
                            if (!track) return;
                            setAudioPreview("");
                            setAudioName("");
                            update({
                              music: {
                                enabled: true,
                                assetId: track.assetId,
                                url: track.url,
                                filename: track.filename,
                              },
                            });
                          }}
                        />
                      </Field>
                      <p className={styles.help}>
                        Kutubxonadagi tayyor musiqani tanlang yoki
                        o‘zingiznikini yuklang.
                      </p>
                      <label className={styles.audioUpload}>
                        <Music2 size={20} />
                        <span>
                          {uploading ? "Yuklanmoqda…" : "Yangi musiqa yuklang"}
                          <small>Audio fayl · 15 MB gacha</small>
                        </span>
                        <input
                          type="file"
                          accept="audio/mpeg,audio/wav,audio/mp4,audio/x-m4a"
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
                        Musiqa qo‘shish majburiy emas. Mehmon uni o‘zi bosib
                        tinglaydi.
                      </p>
                    </div>
                  )}
                </OptionalSection>
                <div className={styles.divider} />
                <OptionalSection
                  title="To‘yona"
                  summary={invitation.gift.enabled ? "Yoqilgan" : "O‘chirilgan"}
                  target="gift"
                >
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
                      <Toggle
                        title="Chek yuborishga ruxsat"
                        description="Chek faqat sizga ko‘rinadi. Pul tushganini o‘zingiz tekshirasiz."
                        checked={invitation.gift.receiptUploadEnabled}
                        onChange={(receiptUploadEnabled) =>
                          update({
                            gift: { ...invitation.gift, receiptUploadEnabled },
                          })
                        }
                      />
                    </div>
                  )}
                </OptionalSection>
                <div className={styles.divider} />
                {invitation.templateId === "taklifla-sharlar" && <Field label="Eshiklar ochilish vaqti"><input type="time" value={sharlarData.doorsAt} onChange={e=>{const doorsAt=e.target.value;setInvitation(current=>current?{...current,templateData:{...current.templateData,"taklifla-sharlar":{doorsAt}}}:current);}} /></Field>}
                {invitation.templateId === "taklifla-sakura-guli" && <div className={styles.formGrid}>{(["contactNote","infoNote","footerNote"] as const).map(key=><Field key={key} label={`${({contactNote:"Aloqa haqida izoh",infoNote:"Mehmonlarga eslatma",footerNote:"Yakuniy izoh"})[key]} · ${LANGUAGE_NAMES[locale]}`}><textarea maxLength={4000} rows={3} value={sakuraData[key][locale] || ""} onChange={e=>updateSakuraNote(key,e.target.value)} /></Field>)}</div>}
                {invitation.templateId === "taklifla-qogoz-ertagi" && <div className={styles.formGrid}>{(["contactNote","footerNote"] as const).map(key=><Field key={key} label={`${key === "contactNote" ? "Aloqa haqida izoh" : "Yakuniy izoh"} · ${LANGUAGE_NAMES[locale]}`}><textarea maxLength={4000} rows={3} value={qogozData[key][locale] || ""} onChange={e=>updateQogozNote(key,e.target.value)} /></Field>)}</div>}
                {invitation.templateId === "taklifla-parilar-ertagi" && <div className={styles.formGrid}><Field label={`Kelish haqida · ${LANGUAGE_NAMES[locale]}`}><textarea maxLength={4000} rows={3} value={pariData.arrivalNote[locale] || ""} onChange={e=>updatePariDetail(e.target.value)} /></Field>{invitation.program.map(item=><Field key={item.id} label={`${item.time} · Qisqa dastur yorlig‘i · ${LANGUAGE_NAMES[locale]}`}><input maxLength={300} value={pariData.programLabels[item.id]?.[locale] || ""} onChange={e=>updatePariDetail(e.target.value,item.id)} /></Field>)}</div>}
                {invitation.templateId === "taklifla-osmon" && <div className={styles.formGrid}>{(["rsvpNote","giftNote"] as const).map(key=><Field key={key} label={`${key === "rsvpNote" ? "Ishtirok haqida izoh" : "Sovg‘alar haqida izoh"} · ${LANGUAGE_NAMES[locale]}`}><textarea maxLength={4000} rows={3} value={osmonData[key][locale] || ""} onChange={e=>updateOsmonNote(key,e.target.value)} /></Field>)}</div>}
                {invitation.templateId === "taklifla-oltin-yol" && <div className={styles.formGrid}>{(["arrivalNote","giftNote","contactNote","footerNote"] as const).map(key=><Field key={key} label={`${({arrivalNote:"Kelish haqida",giftNote:"Sovg‘alar haqida izoh",contactNote:"Mas’ul shaxs haqida",footerNote:"Yakuniy izoh"})[key]} · ${LANGUAGE_NAMES[locale]}`}><textarea maxLength={4000} rows={3} value={oltinYolData[key][locale] || ""} onChange={e=>updateOltinNote(key,e.target.value)} /></Field>)}</div>}
                {invitation.templateId === "taklifla-toglar-bagrida" && <div className={styles.formGrid}>{(["ceremonyTime","celebrationTime"] as const).map(key=><Field key={key} label={key === "ceremonyTime" ? "Marosim vaqti" : "Ziyofat vaqti"}><input maxLength={80} value={mountainData[key]} placeholder="Asosiy tadbir vaqti" onChange={e=>updateMountainTime(key,e.target.value)} /></Field>)}</div>}
                {invitation.templateId === "taklifla-zarrin-gullar" && <div className={styles.formGrid}>
                  {(["brideFamily","groomFamily","stayText","footerNote","hashtag"] as const).map(key=><Field key={key} label={`${({brideFamily:"Kelin oilasi",groomFamily:"Kuyov oilasi",stayText:"Turar joy haqida",footerNote:"Yakuniy izoh",hashtag:"Heshteg"})[key]} · ${LANGUAGE_NAMES[locale]}`}><textarea maxLength={key==="hashtag"?100:4000} rows={2} value={key==="hashtag"?zarrinData.hashtag:zarrinData[key][locale] || ""} onChange={e=>updateZarrinField(key,e.target.value)}/></Field>)}
                </div>}
                {invitation.templateId === "taklifla-gulbog" && <div className={styles.formGrid}>
                  {(["brideFamily","reminderTitle","reminderText","footerNote"] as const).map(key=><Field key={key} label={`${({brideFamily:"Kelin oilasi satri",reminderTitle:"Eslatma sarlavhasi",reminderText:"Mehmonlarga eslatma",footerNote:"Yakuniy izoh"})[key]} · ${LANGUAGE_NAMES[locale]}`}><textarea maxLength={key==="reminderTitle"?300:4000} rows={3} value={gulbogData[key][locale] || ""} onChange={e=>updateGulbogField(key,e.target.value)}/></Field>)}
                </div>}
                {invitation.templateId === "taklifla-fayzli-xonadon" && <div className={styles.formGrid}>
                  {xonadonData.menu.map((item,index)=><div key={item.id}>
                    {(["label","name","description"] as const).map(key=><Field key={key} label={`${({label:"Taom turi",name:"Taom",description:"Izoh"})[key]} · ${LANGUAGE_NAMES[locale]}`}><textarea maxLength={key==="description"?4000:300} rows={2} value={item[key][locale] || ""} onChange={e=>updateXonadonMenu(xonadonData.menu.map((s,i)=>i===index?{...s,[key]:{...s[key],[locale]:e.target.value}}:s))}/></Field>)}
                    <button type="button" onClick={()=>updateXonadonMenu(xonadonData.menu.filter(s=>s.id!==item.id))}>O‘chirish</button>
                  </div>)}
                  {xonadonData.menu.length<12 && <button type="button" onClick={()=>updateXonadonMenu([...xonadonData.menu,{id:crypto.randomUUID(),label:{},name:{},description:{}}])}>Taom qo‘shish</button>}
                </div>}
                {invitation.templateId === "taklifla-yubiley-sahifasi" && <div className={styles.formGrid}>
                  <Field label="Yubiley yili"><input type="number" min={1} max={999} value={yubileyData.years ?? ""} disabled={identityLocked} onChange={e=>updateYubileyData({...yubileyData,years:e.target.value ? Math.min(999,Math.max(1,Number(e.target.value))) : null})}/></Field>
                  <Field label={`Asoschining lavozimi · ${LANGUAGE_NAMES[locale]}`}><input maxLength={300} value={yubileyData.founderRole[locale] || ""} onChange={e=>updateYubileyData({...yubileyData,founderRole:{...yubileyData.founderRole,[locale]:e.target.value}})}/></Field>
                  {invitation.story.map(chapter=><Field key={chapter.id} label={`Tarix sanasi · ${chapter.title[locale] || chapter.id}`}><input maxLength={30} value={yubileyData.storyYears[chapter.id] || ""} onChange={e=>updateYubileyData({...yubileyData,storyYears:{...yubileyData.storyYears,[chapter.id]:e.target.value}})}/></Field>)}
                  {yubileyData.statistics.map((item,index)=><div key={item.id}>
                    <Field label="Ko‘rsatkich"><input maxLength={30} value={item.value} onChange={e=>updateYubileyData({...yubileyData,statistics:yubileyData.statistics.map((s,i)=>i===index?{...s,value:e.target.value}:s)})}/></Field>
                    <Field label={`Izoh · ${LANGUAGE_NAMES[locale]}`}><input maxLength={300} value={item.label[locale] || ""} onChange={e=>updateYubileyData({...yubileyData,statistics:yubileyData.statistics.map((s,i)=>i===index?{...s,label:{...s.label,[locale]:e.target.value}}:s)})}/></Field>
                    <button type="button" onClick={()=>updateYubileyData({...yubileyData,statistics:yubileyData.statistics.filter(s=>s.id!==item.id)})}>O‘chirish</button>
                  </div>)}
                  {yubileyData.statistics.length<8 && <button type="button" onClick={()=>updateYubileyData({...yubileyData,statistics:[...yubileyData.statistics,{id:crypto.randomUUID(),value:"",label:{}}]})}>Ko‘rsatkich qo‘shish</button>}
                </div>}
                {invitation.templateId === "taklifla-muhrli-maktub" && (
                  <Field
                    label={`Gullar o‘rniga izoh · ${LANGUAGE_NAMES[locale]}`}
                    hint="Mehmonlarga ko‘rinadi. Bo‘sh qoldirsangiz, dizaynning boshlang‘ich matni ishlatiladi."
                  >
                    <textarea
                      value={muhrliMaktubData.flowersNote?.[locale] ?? ""}
                      maxLength={1000}
                      rows={3}
                      disabled={identityLocked}
                      placeholder="Masalan, gullar o‘rniga samimiy tilaklaringizni qoldiring."
                      onChange={(event) =>
                        updateMuhrliMaktubFlowersNote(event.target.value)
                      }
                    />
                  </Field>
                )}
                <OptionalSection
                  title="Mehmonlar javobi"
                  summary={invitation.rsvp.enabled ? "Yoqilgan" : "O‘chirilgan"}
                  target="rsvp"
                >
                  <Toggle
                    title="Qatnashishni tasdiqlash"
                    description="Mehmonlar kelishini oldindan bildirsin."
                    checked={invitation.rsvp.enabled}
                    onChange={(enabled) =>
                      update({ rsvp: { ...invitation.rsvp, enabled } })
                    }
                  />
                  {invitation.rsvp.enabled && (
                    <div
                      className={`${styles.optionBody} ${styles.twoColumns}`}
                    >
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
                </OptionalSection>
                <div className={styles.divider} />
                <OptionalSection
                  title="Mehmonlar tilaklari"
                  summary={
                    invitation.wishes.enabled ? "Yoqilgan" : "O‘chirilgan"
                  }
                  target="rsvp"
                >
                  <Toggle
                    title="Mehmonlar tilaklari"
                    description="Tilaklar faqat siz tasdiqlaganingizdan keyin ko‘rinadi."
                    checked={invitation.wishes.enabled}
                    onChange={(enabled) =>
                      update({ wishes: { ...invitation.wishes, enabled } })
                    }
                  />
                </OptionalSection>
                <div className={styles.divider} />
                <OptionalSection
                  title="Bog‘lanish"
                  summary={
                    [
                      invitation.contacts.phoneNumber,
                      invitation.contacts.telegramUsername,
                      invitation.contacts.instagramUrl,
                    ].filter(Boolean).length
                      ? "Kiritilgan"
                      : "Ixtiyoriy"
                  }
                  target="contacts"
                >
                  <div className={styles.groupHeader}>
                    <h2>Bog‘lanish</h2>
                  </div>
                  <div className={styles.twoColumns}>
                    <Field label="Telefon raqami">
                      <input
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        value={invitation.contacts.phoneNumber}
                        maxLength={300}
                        placeholder="+998 90 123 45 67"
                        onChange={(event) =>
                          update({
                            contacts: {
                              ...invitation.contacts,
                              phoneNumber: event.target.value,
                            },
                          })
                        }
                      />
                    </Field>
                    <Field label="Telegram nomi">
                      <input
                        type="text"
                        autoComplete="username"
                        value={invitation.contacts.telegramUsername}
                        maxLength={300}
                        placeholder="@username"
                        onChange={(event) =>
                          update({
                            contacts: {
                              ...invitation.contacts,
                              telegramUsername: event.target.value,
                            },
                          })
                        }
                      />
                    </Field>
                    <Field label="Instagram">
                      <input
                        type="text"
                        autoComplete="url"
                        value={invitation.contacts.instagramUrl}
                        maxLength={300}
                        placeholder="@username yoki instagram.com/username"
                        onChange={(event) =>
                          update({
                            contacts: {
                              ...invitation.contacts,
                              instagramUrl: event.target.value,
                            },
                          })
                        }
                      />
                    </Field>
                  </div>{" "}
                </OptionalSection>
              </div>
            )}
            {section === sections.length - 1 &&
              invitation.status === "draft" && (
                <section className={styles.publishPanel}>
                  <div>
                    <h2>
                      {readiness.length
                        ? "Yakuniy tekshiruv"
                        : "Taklifnomangiz tayyor"}
                    </h2>
                    <p>
                      Mehmonlarga ulashishdan oldin ma’lumotlarni tekshiring.
                    </p>
                    <dl className={styles.reviewSummary}>
                      {[
                        ["Dizayn", selectedTemplate?.name || "Tanlanmagan", 0],
                        [
                          "Ismlar",
                          content.people.filter(Boolean).join(" & ") ||
                            "Kiritilmagan",
                          1,
                        ],
                        [
                          "Sana va vaqt",
                          readiness.some((issue) => issue.path === "startsAt")
                            ? "Kiritilmagan"
                            : new Intl.DateTimeFormat("uz-UZ", {
                                dateStyle: "long",
                                timeStyle: "short",
                                timeZone: "UTC",
                              }).format(new Date(`${invitation.startsAt}Z`)),
                          2,
                        ],
                        [
                          "Manzil",
                          [content.venueName, content.address]
                            .filter(Boolean)
                            .join(" · ") || "Kiritilmagan",
                          2,
                        ],
                      ].map(([label, value, step]) => (
                        <div key={label}>
                          <dt>{label}</dt>
                          <dd>
                            {value}
                            <button
                              type="button"
                              onClick={() => goToSection(Number(step))}
                            >
                              Tahrirlash
                              <span className={styles.srOnly}> · {label}</span>
                            </button>
                          </dd>
                        </div>
                      ))}
                      <div>
                        <dt>Tillar</dt>
                        <dd className={styles.reviewLanguages}>
                          {invitation.enabledLocales.map((item) => (
                            <button
                              type="button"
                              key={item}
                              onClick={() => {
                                setLocale(item);
                                goToSection(1);
                              }}
                            >
                              {LANGUAGE_NAMES[item]} ·{" "}
                              {readiness.some((issue) => issue.locale === item)
                                ? "To‘ldiring"
                                : "Tayyor"}
                            </button>
                          ))}
                        </dd>
                      </div>
                      <div>
                        <dt>Nashr narxi</dt>
                        <dd>
                          {paidInvitationId === invitation.id
                            ? "To‘lov qabul qilingan"
                            : publishingMode === "paid"
                              ? selectedTemplate
                                ? formatPrice(selectedTemplate.priceMinor)
                                : "Dizayn tanlang"
                              : "Bepul"}
                        </dd>
                      </div>
                    </dl>
                    {readiness.length > 0 && (
                      <div className={styles.reviewIssues}>
                        <strong>Quyidagilarni to‘ldiring</strong>
                        <ul>
                          {readiness.map((issue) => (
                            <li key={issue.path}>
                              <button
                                type="button"
                                onClick={() => goToIssue(issue)}
                              >
                                {issue.message}
                                <ChevronRight size={14} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <ul className={styles.publicationTerms}>
                      {paidInvitationId === invitation.id ? (
                        <li>
                          To‘lov qabul qilingan. Nashrni yakunlash uchun qayta
                          to‘lov talab qilinmaydi.
                        </li>
                      ) : (
                        publishingMode === "paid" && (
                          <li>
                            Click to‘lovi tasdiqlangach, taklifnoma nashr
                            qilinadi. To‘lov boshlanganidan keyin ismlar, sana
                            va dizayn qulflanadi.
                          </li>
                        )
                      )}
                      <li>
                        Nashrdan so‘ng ismlar, mezbon, tadbir turi, sana va
                        dizaynni o‘zgartirib bo‘lmaydi.
                      </li>
                      <li>
                        Matn, manzil va boshqa tafsilotlarni tadbir kuni
                        tugaguncha tahrirlashingiz mumkin.
                      </li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    className={styles.saveButton}
                    onClick={() => void saveOrPublish("publish")}
                    disabled={
                      busy || uploading || !!auth || readiness.length > 0
                    }
                  >
                    <Send size={16} />
                    {publishing
                      ? "Tayyorlanmoqda…"
                      : paidInvitationId === invitation.id
                        ? "Nashrni yakunlash"
                        : publishingMode === "paid"
                          ? `To‘lash va nashr qilish${selectedTemplate ? ` · ${formatPrice(selectedTemplate.priceMinor)}` : ""}`
                          : "Nashr qilish"}
                  </button>
                </section>
              )}
            <footer className={styles.editorFooter}>
              <button
                className={styles.secondaryButton}
                onClick={() => goToSection(Math.max(0, section - 1))}
                disabled={section === 0}
              >
                <ArrowLeft size={16} />
                Orqaga
              </button>
              {section < 3 ? (
                <button
                  className={styles.saveButton}
                  onClick={() => goToSection(section + 1)}
                >
                  Davom etish
                  <ChevronRight size={16} />
                </button>
              ) : null}
            </footer>
          </fieldset>
        </main>
        <aside
          className={`${styles.previewPanel} ${!mobilePreview ? styles.previewMobileHidden : ""}`}
          aria-label="Taklifnoma ko‘rinishi"
        >
          <div className={styles.previewHeading}>
            {invitation.templateId && (
              <Link
                className={styles.fullPreviewLink}
                href={`/preview?template=${encodeURIComponent(invitation.templateId)}&draft=${encodeURIComponent(invitation.id)}${section === 0 && !authoredPreview ? "&demo=1" : ""}`}
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
                <Eye size={14} /> Mehmon sifatida ko‘rish
              </Link>
            )}
          </div>
          <div className={styles.realPreview} ref={previewHost}>
            {invitation.templateId === "oltin-darvoza-ortidagi-baxt" ? (
              <OltinDarvozaInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={section === 0 && !authoredPreview}
                sampleWishes={section === 0 && !authoredPreview}
              />
            ) : invitation.templateId === "ming-bir-kecha" ? (
              <MingBirKechaInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={section === 0 && !authoredPreview}
                sampleWishes={section === 0 && !authoredPreview}
              />
            ) : invitation.templateId === "samarqand-peshtoqi" ? (
              <SamarqandPeshtoqInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={section === 0 && !authoredPreview}
                sampleWishes={section === 0 && !authoredPreview}
              />
            ) : invitation.templateId === "shisha-bog" ? (
              <ShishaBogInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={section === 0 && !authoredPreview}
                sampleWishes={section === 0 && !authoredPreview}
              />
            ) : invitation.templateId === "kapadokiya-tongi" ? (
              <KapadokiyaTongiInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={section === 0 && !authoredPreview}
                sampleWishes={section === 0 && !authoredPreview}
              />
            ) : invitation.templateId === "buxoro-ravoq" ? (
              <BuxoroRavoqInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={section === 0 && !authoredPreview}
                sampleWishes={section === 0 && !authoredPreview}
              />
            ) : invitation.templateId === "jannat-bogi" ? (
              <JannatBogiInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={section === 0 && !authoredPreview}
                sampleWishes={section === 0 && !authoredPreview}
              />
            ) : invitation.templateId === "tojmahal-oltin-darvozasi" ? (
              <TojmahalOltinDarvozasiInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={section === 0 && !authoredPreview}
                sampleWishes={section === 0 && !authoredPreview}
              />
            ) : invitation.templateId === "andalus-darvozasi" ? (
              <AndalusDarvozasiInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={section === 0 && !authoredPreview}
                sampleWishes={section === 0 && !authoredPreview}
              />
            ) : invitation.templateId === "zarrin-doppi" ? (
              <ZarrinDoppiInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={section === 0 && !authoredPreview}
                sampleWishes={section === 0 && !authoredPreview}
              />
            ) : invitation.templateId === "gulli-darvoza" ? (
              <GulliDarvozaInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={section === 0 && !authoredPreview}
                sampleWishes={section === 0 && !authoredPreview}
              />
            ) : invitation.templateId === "wedivo-pulau-sehati" ? (
              <WedivoPulauSehati
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                fullPreview
                catalogMusic={section === 0 && !authoredPreview}
                sampleWishes={section === 0 && !authoredPreview}
              />
            ) : invitation.templateId === "anor" ? (
              <AnorInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                fullPreview
                catalogMusic={section === 0 && !authoredPreview}
                sampleWishes={section === 0 && !authoredPreview}
              />
            ) : invitation.templateId === "royal-burgundy-edition" ? (
              <VelvetRoyaleInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={section === 0 && !authoredPreview}
                sampleWishes={section === 0 && !authoredPreview}
              />
            ) : invitation.templateId === "olive-manor-edition" ? (
              <OliveManorInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={section === 0 && !authoredPreview}
                sampleWishes={section === 0 && !authoredPreview}
              />
            ) : invitation.templateId === "islamic-edition" ? (
              <IslamicEditionInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={section === 0 && !authoredPreview}
                sampleWishes={section === 0 && !authoredPreview}
              />
            ) : invitation.templateId === "manor-edition" ? (
              <ManorInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={section === 0 && !authoredPreview}
                sampleWishes={section === 0 && !authoredPreview}
              />
            ) : invitation.templateId === "osh-edition-v1" ? (
              <OshEditionInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={section === 0 && !authoredPreview}
              />
            ) : invitation.templateId === "monochrome-editorial-edition" ? (
              <MonochromeEditorialInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={section === 0 && !authoredPreview}
              />
            ) : invitation.templateId === "amru-maruf-edition-v1" ? (
              <AmruMarufEditionInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={section === 0 && !authoredPreview}
              />
            ) : invitation.templateId === "xatna-edition" ? (
              <XatnaEditionInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={section === 0 && !authoredPreview}
              />
            ) : invitation.templateId === "taklifla-fayzli-xonadon" ? (
              <TakliflaFayzliXonadonInvitation invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={section === 0 && !authoredPreview} silentPlayback />
            ) : invitation.templateId === "taklifla-ertak" ? (
              <TakliflaErtak invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={section === 0 && !authoredPreview} silentPlayback />
            ) : invitation.templateId === "taklifla-gulbog" ? (
              <TakliflaGulbog invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={section === 0 && !authoredPreview} silentPlayback />
            ) : invitation.templateId === "taklifla-zarrin-gullar" ? (
              <TakliflaZarrinGullar invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={section === 0 && !authoredPreview} silentPlayback />
            ) : invitation.templateId === "taklifla-toglar-bagrida" ? (
              <ToglarBagridaInvitation invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={section === 0 && !authoredPreview} silentPlayback />
            ) : invitation.templateId === "taklifla-oltin-yol" ? (
              <TakliflaOltinYol invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={section === 0 && !authoredPreview} silentPlayback />
            ) : invitation.templateId === "taklifla-osmon" ? (
              <TakliflaOsmonInvitation invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={section === 0 && !authoredPreview} silentPlayback />
            ) : invitation.templateId === "taklifla-parilar-ertagi" ? (
              <TakliflaParilarErtagiInvitation invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={section === 0 && !authoredPreview} silentPlayback />
            ) : invitation.templateId === "taklifla-qogoz-ertagi" ? (
              <TakliflaQogozErtagiInvitation invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={section === 0 && !authoredPreview} silentPlayback />
            ) : invitation.templateId === "taklifla-sakura-guli" ? (
              <SakuraGuliInvitation invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={section === 0 && !authoredPreview} silentPlayback />
            ) : invitation.templateId === "taklifla-sharlar" ? (
              <TakliflaSharlarInvitation invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={section === 0 && !authoredPreview} silentPlayback />
            ) : invitation.templateId === "taklifla-yubiley-sahifasi" ? (
              <TakliflaYubileySahifasi invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={section === 0 && !authoredPreview} silentPlayback />
            ) : invitation.templateId === "taklifla-barakali" ? (
              <TakliflaBarakali invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={section === 0 && !authoredPreview} sampleWishes={section === 0 && !authoredPreview} silentPlayback />
            ) : invitation.templateId === "taklifla-zarhal-sahifa" ? (
              <TakliflaZarhalSahifaInvitation invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={section === 0 && !authoredPreview} sampleWishes={section === 0 && !authoredPreview} silentPlayback />
            ) : invitation.templateId === "taklifla-tungi-saroy" ? (
              <TungiSaroyInvitation invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={section === 0 && !authoredPreview} silentPlayback />
            ) : invitation.templateId === "taklifla-tovus" ? (
              <TakliflaTovus invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={section === 0 && !authoredPreview} silentPlayback />
            ) : invitation.templateId === "taklifla-tort-fasl" ? (
              <TakliflaTortFasl invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={section === 0 && !authoredPreview} silentPlayback />
            ) : invitation.templateId === "taklifla-asalari" ? (
              <TakliflaAsalari
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                sampleWishes={section === 0 && !authoredPreview}
                silentPlayback
              />
            ) : invitation.templateId === "taklifla-muhrli-maktub" ? (
              <MuhrliMaktubInvitation
                sampleWishes={section === 0 && !authoredPreview}
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                fullPreview
                catalogMusic={section === 0 && !authoredPreview}
                silentPlayback
              />
            ) : invitation.templateId &&
              isChorloveTemplate(invitation.templateId) ? (
              <ChorloveInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                templateId={invitation.templateId}
                preview
                fullPreview
                catalogMusic={section === 0 && !authoredPreview}
                sampleWishes={section === 0 && !authoredPreview}
              />
            ) : invitation.templateId &&
              isInvitateTemplate(invitation.templateId) ? (
              <InvitateInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                fullPreview
                catalogMusic={section === 0 && !authoredPreview}
                sampleWishes={section === 0 && !authoredPreview}
              />
            ) : invitation.templateId &&
              isMarxabaTemplate(invitation.templateId) ? (
              <MarxabaInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                templateId={invitation.templateId}
                preview
                fullPreview
                catalogMusic={section === 0 && !authoredPreview}
                sampleWishes={section === 0 && !authoredPreview}
              />
            ) : (
              <div className={styles.categoryEmpty}>
                <LayoutTemplate size={28} />
                <strong>{selectedTemplate?.name ?? "Dizayn tanlang"}</strong>
                <p>Tanlagan dizayningiz shu yerda ko‘rinadi.</p>
              </div>
            )}
          </div>
        </aside>
      </div>
      {section < sections.length - 1 && (
        <div className={styles.mobileSelectionActions}>
          <button
            type="button"
            className={styles.secondaryButton}
            disabled={section === 0}
            onClick={() => goToSection(section - 1)}
          >
            <ArrowLeft size={16} /> Orqaga
          </button>
          <button
            type="button"
            className={styles.saveButton}
            onClick={() => goToSection(section + 1)}
          >
            Davom etish <ChevronRight size={16} />
          </button>
        </div>
      )}
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
              {authIdentity ? <CheckCircle2 size={28} /> : <Send size={28} />}
            </span>
            <h2 id="auth-title">
              {authIdentity
                ? "Hisobingiz tasdiqlandi"
                : pendingAction.current === "publish"
                  ? "Nashr qilish uchun hisobingizga kiring"
                  : "Taklifnomani o‘z hisobingizga saqlang"}
            </h2>
            {!authIdentity && (
              <p>
                Telegram orqali kiring. Kiritgan ma’lumotlaringiz shu yerda
                qoladi.
              </p>
            )}
            {authIdentity && (
              <div className={styles.authAccount}>
                <span>
                  {authIdentity.displayName
                    .trim()
                    .charAt(0)
                    .toLocaleUpperCase() || "T"}
                </span>
                <div>
                  <small>Tasdiqlangan Telegram hisobi</small>
                  <strong>{authIdentity.displayName}</strong>
                </div>
                <CheckCircle2 size={19} />
              </div>
            )}
            <p role="status">{authStatus}</p>
            {authIdentity ? (
              <button
                className={styles.saveButton}
                onClick={completeLogin}
                disabled={busy}
                data-auth-complete
              >
                {busy ? (
                  <LoaderCircle size={17} className={styles.spinner} />
                ) : (
                  <Check size={17} />
                )}
                {busy
                  ? "Yakunlanmoqda…"
                  : pendingAction.current === "publish"
                    ? "Nashr qilishni yakunlash"
                    : "Saqlashni yakunlash"}
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
          </div>
        </div>
      )}
    </div>
  );
}
