"use client";
import { BRAND_NAME } from "@/lib/brand";
import { StaticImagePreview } from "@/modules/static-images/static-image-preview";
import { downloadInvitationImage } from "@/modules/static-images/download";
import { InvitationCorrections } from "./invitation-corrections";
import { switchEventType } from "./event-switch";
import { eventTimestamp } from "@/lib/event-date";
import { editingClosed, eventDay, type InvitationEditAccess } from "@taklifnoma/contracts/policies";
import { Download } from "lucide-react";

import { refreshFavorites } from "@/modules/favorites/favorites-store";

import { publicTemplateId, resolveTemplateId } from "@taklifnoma/contracts";

import { applyOptionalFeatureVisibility, normalizeInvitation, templateCapabilities } from "@taklifnoma/contracts/capabilities";
import { studioSavePayload } from "@taklifnoma/contracts/studio-inputs";
import { hasVenuePoint, yandexMapUrl } from "@taklifnoma/contracts/maps";
import { DEFAULT_INVITATION_MUSIC } from "@taklifnoma/contracts/music";
import { ReadinessChecklist } from "./readiness-checklist";
import { isValidElement, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type SetStateAction } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Eye,
  Globe2,
  Gift,
  ImagePlus,
  Info,
  LayoutTemplate,
  Lightbulb,
  LoaderCircle,
  MapPin,
  MapPinned,
  Music2,
  Pause,
  Play,
  MessageSquare,
  Phone,
  Plus,
  Save,
  Send,
  Settings2,
  Signpost,
  FileText,
  UserCheck,
  Shirt,
  Trash2,
  ListOrdered,
  Users,
  Search,
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
  terracottaDataSchema,
  starryDataSchema,
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
import { TemplateFormatSwitch, type TemplateFormat } from "@/modules/catalog/template-format-switch";
import { OptionalSection } from "./optional-section";
import { StudioSection } from "./studio-section";
import { useStudioPreview, type PreviewTarget } from "./use-studio-preview";
import { SoftSelect } from "@/components/soft-select";
import { DateTimePicker, TimePicker } from "@/components/date-time-picker";
import { readBrowserDraft, saveBrowserDraft, deleteBrowserDraft } from "./draft-storage";
import { PlaceSearch } from "./place-search";
import { VenueLink } from "./venue-link";
import { AnorInvitation } from "@/templates/anor";
import { isMarxabaTemplate, MarxabaInvitation } from "@/templates/marxaba";
import { isInvitateTemplate, InvitateInvitation } from "@/templates/invitate";
import { VelvetRoyaleInvitation } from "@/templates/baxmal-saroy/renderer";
import { OliveManorInvitation } from "@/templates/zaytun/renderer";
import { IslamicEditionInvitation } from "@/templates/islomiy/renderer";
import { MonochromeEditorialInvitation } from "@/templates/oq-qora-lavha/renderer";
import { XatnaEditionInvitation } from "@/templates/xatna/renderer";
import { GulliDarvozaInvitation } from "@/templates/onlinetaklifnoma/gulli-darvoza";
import { OltinDarvozaInvitation } from "@/templates/onlinetaklifnoma/baxt-darvozasi";
import { MingBirKechaInvitation } from "@/templates/onlinetaklifnoma/ming-bir-kecha";
import { ZarrinDoppiInvitation } from "@/templates/onlinetaklifnoma/zarrin-doppi";
import { AndalusDarvozasiInvitation } from "@/templates/onlinetaklifnoma/andalus-darvozasi";
import { SamarqandPeshtoqInvitation } from "@/templates/onlinetaklifnoma/samarqand-peshtoqi";
import { ShishaBogInvitation } from "@/templates/onlinetaklifnoma/shisha-bog";
import { KapadokiyaTongiInvitation } from "@/templates/onlinetaklifnoma/kapadokiya-tongi";
import { BuxoroRavoqInvitation } from "@/templates/onlinetaklifnoma/buxoro-ravogi";
import { JannatBogiInvitation } from "@/templates/onlinetaklifnoma/jannat-bogi";
import { TojmahalOltinDarvozasiInvitation } from "@/templates/onlinetaklifnoma/tojmahal-darvozasi";
import { WedivoPulauSehati } from "@/templates/kongillar-oroli/renderer";
import { TakliflaAsalari } from "@/templates/asalari/renderer";
import { TungiSaroyInvitation } from "@/templates/tungi-saroy/renderer";
import { TakliflaTovus } from "@/templates/tovus/renderer";
import { TakliflaTortFasl } from "@/templates/tort-fasl/renderer";
import { TakliflaFayzliXonadonInvitation } from "@/templates/fayzli-xonadon/renderer";
import { TakliflaErtak } from "@/templates/ertak/renderer";
import { TakliflaGulbog } from "@/templates/gulbog/renderer";
import { TakliflaZarrinGullar } from "@/templates/zarrin-gullar/renderer";
import { ToglarBagridaInvitation } from "@/templates/toglar-bagrida/renderer";
import { TakliflaOltinYol } from "@/templates/oltin-yol/renderer";
import { TakliflaOsmonInvitation } from "@/templates/osmon/renderer";
import { TakliflaParilarErtagiInvitation } from "@/templates/parilar-ertagi/renderer";
import { TakliflaQogozErtagiInvitation } from "@/templates/qogoz-ertagi/renderer";
import { SakuraGuliInvitation } from "@/templates/sakura-guli/renderer";
import { TakliflaSharlarInvitation } from "@/templates/sharlar/renderer";
import { TakliflaYulduzliTun } from "@/templates/yulduzli-tun/renderer";
import { TakliflaTerracottaInvitation } from "@/templates/terrakota/renderer";
import { TakliflaYubileySahifasi } from "@/templates/umr-bahori/renderer";
import { TakliflaBarakali } from "@/templates/baraka/renderer";
import { TakliflaZarhalSahifaInvitation } from "@/templates/zarhal-sahifa/renderer";
import { MuhrliMaktubInvitation } from "@/templates/muhrli-maktub/renderer";
import { isChorloveTemplate, ChorloveInvitation } from "@/templates/chorlove";
import { createStudioPreviewInvitation } from "./preview-invitation";
import { CATALOG_MUSIC_CREDIT, CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import { orderEventTemplates } from "@/modules/catalog/template-order";
import { PublishedLink } from "@/components/published-link";
import { openCheckout } from "@/modules/payments/open-checkout";
import { paymentStateLabels, type PaymentOrderView } from "@taklifnoma/contracts/payment";
import {
  publicationIssues,
  type PublicationIssue,
} from "@taklifnoma/contracts/publication";

const sections = [
  {
    icon: LayoutTemplate,
    title: "Dizayn tanlash",
    short: "Dizayn",
    note: "Tadbir va dizayn",
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
    title: "Tadbir tafsilotlari",
    short: "Tafsilotlar",
    note: "Sana, joy va dastur",
    description: "Sana, manzil, dastur va kiyinish uslubini belgilang.",
  },
  {
    icon: Settings2,
    title: "Yakunlash",
    short: "Yakunlash",
    note: "Yakuniy tekshiruv",
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
  icon,
  hint,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  hint?: string;
  children: React.ReactNode;
}) {
  if (
    isValidElement(children) &&
    (children.type === SoftSelect ||
      children.type === PlaceSearch ||
      children.type === DateTimePicker ||
      children.type === TimePicker)
  )
    return (
      <div className={styles.field}>
        <span className={icon ? styles.fieldLabel : undefined}>{icon}{label}</span>
        {children}
        {hint && <small>{hint}</small>}
      </div>
    );
  return (
    <label className={styles.field}>
      <span className={icon ? styles.fieldLabel : undefined}>{icon}{label}</span>
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
  disabled = false,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className={styles.toggle}>
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <input
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className={styles.switch} aria-hidden="true" />
    </label>
  );
}

export function Studio({
  initialInvitation,
  initialEditAccess,
  adminContext,
}: {
  initialInvitation?: Invitation;
  initialEditAccess?: InvitationEditAccess;
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
  const [invitation, setInvitationState] = useState<Invitation | null>(null);
  const [singleContactType, setSingleContactType] = useState("phone");
  useEffect(() => {
    if (invitation) setSingleContactType(invitation.contacts.telegramUsername.trim() ? "telegram" : "phone");
  }, [invitation?.id, invitation?.templateId]);
  const [editAccess, setEditAccess] = useState<InvitationEditAccess | null>(initialEditAccess ?? null);
  const [clockNow, setClockNow] = useState(() => new Date());
  useEffect(() => {
    const tick = () => setClockNow(new Date());
    const timer = window.setInterval(tick, 15000);
    window.addEventListener("focus", tick);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", tick); };
  }, []);
  useEffect(() => {
    if (!invitation || (!invitation.imageExportedAt && invitation.status !== "published" && !initialEditAccess?.locked)) return;
    let active = true;
    const refresh = () => studioFetch(`/api/invitations/${invitation.id}`, { cache: "no-store" })
      .then(async response => { if (response.ok) { const data = await response.json(); if (active) setEditAccess(data.editAccess); } })
      .catch(() => { /* Preserve authoritative metadata on transient errors. */ });
    void refresh();
    window.addEventListener("focus", refresh);
    return () => { active = false; window.removeEventListener("focus", refresh); };
  }, [invitation?.id, invitation?.status, invitation?.imageExportedAt]);
  const setInvitation = useCallback((action: SetStateAction<Invitation | null>) => {
    setInvitationState((current) => {
      const next = typeof action === "function" ? action(current) : action;
      return next;
    });
  }, []);
  const previewInvitation = useMemo(
    () => invitation ? applyOptionalFeatureVisibility({
      ...normalizeInvitation(createStudioPreviewInvitation(invitation)),
      // Preview projection only: keep the creator's saved soundtrack selected,
      // but never send playable audio to an automatically opened Studio frame.
      music: { ...invitation.music, enabled: false, url: "" },
    }) : null,
    [invitation],
  );
  const [locale, setLocale] = useState<Locale>(
    initialInvitation?.defaultLocale ?? "uz-Latn",
  );
  const [section, setSection] = useState(0);
  const [chosenFormat, setChosenFormat] = useState<TemplateFormat | null>(null);
  const editorScroll = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    // Reset after the next step is committed, before focus/scroll anchoring.
    editorScroll.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [section]);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishingMode, setPublishingMode] = useState("free");
  const [paidInvitationId, setPaidInvitationId] = useState("");
  const [paymentOrder, setPaymentOrder] = useState<PaymentOrderView | null>(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [manualPaymentLink, setManualPaymentLink] = useState(false);
  const [paymentLinkNotice, setPaymentLinkNotice] = useState("");
  const [publishIssues, setPublishIssues] = useState<PublicationIssue[]>([]);
  const [publicUrl, setPublicUrl] = useState<string>();
  const pendingAction = useRef<"save" | "publish" | "download">("save");
  const operationInFlight = useRef(false);
  const paymentCheckInFlight = useRef(false);
  const [auth, setAuth] = useState<{
    loginUrl: string;
    requestId: string;
  } | null>(null);
  const [authIdentity, setAuthIdentity] = useState<{
    displayName: string;
  } | null>(null);
  const [authStatus, setAuthStatus] = useState("");
  const [savedMusic, setSavedMusic] = useState<
    Array<{
      id: string; assetId: string | null; url: string; filename: string;
      composer?: string; performer?: string; instrument?: string;
      durationSeconds?: number | null; license?: string; attribution?: string;
      sourceUrl?: string; licenseUrl?: string;
    }>
  >([]);
  const [musicLibrarySearch, setMusicLibrarySearch] = useState("");
  const [musicLibraryOpen, setMusicLibraryOpen] = useState(false);
  const [musicPreviewUrl, setMusicPreviewUrl] = useState("");
  const [musicPreviewPlaying, setMusicPreviewPlaying] = useState(false);
  const [musicPreviewTime, setMusicPreviewTime] = useState(0);
  const [musicPreviewDuration, setMusicPreviewDuration] = useState(0);
  const musicPickerRef = useRef<HTMLDivElement>(null);
  const musicPreviewRef = useRef<HTMLAudioElement>(null);
  const [musicLibraryLoading, setMusicLibraryLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [catalogVersion, setCatalogVersion] = useState(0);
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
  const cloudInvitation = useRef<Invitation | null>(initialInvitation ?? null);
  const ownerId = useRef<string | null>(
    initialInvitation ? "unavailable-private-owner" : null,
  );
  const dressCodeDefaultsApplied = useRef(new Set<string>());
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  invitationRef.current = invitation;
  const libraryTracks = savedMusic.map((track) =>
    track.id === CATALOG_PREVIEW_MUSIC.id
      ? {
          ...track,
          composer: "Fotiha kutubxonasi",
          performer: CATALOG_MUSIC_CREDIT.creator,
          instrument: "Piano",
          license: CATALOG_MUSIC_CREDIT.license,
          licenseUrl: CATALOG_MUSIC_CREDIT.licenseUrl,
          sourceUrl: CATALOG_MUSIC_CREDIT.source,
        }
      : track,
  );
  const selectedMusicTrack = libraryTracks.find((track) =>
    invitation?.music.assetId
      ? track.assetId === invitation.music.assetId
      : track.url === invitation?.music.url,
  );
  const selectedMusicPreviewPlaying = !!selectedMusicTrack && musicPreviewUrl === selectedMusicTrack.url && musicPreviewPlaying;
  const selectedMusicDuration = musicPreviewDuration || selectedMusicTrack?.durationSeconds || 0;
  const filteredLibraryTracks = libraryTracks.filter((track) =>
    `${track.filename} ${track.composer} ${track.performer} ${track.instrument}`
      .toLocaleLowerCase()
      .includes(musicLibrarySearch.trim().toLocaleLowerCase()),
  );

  function toggleMusicPreview(url: string) {
    const audio = musicPreviewRef.current;
    if (!audio) return;
    if (musicPreviewUrl === url && musicPreviewPlaying) {
      audio.pause();
      setMusicPreviewPlaying(false);
      return;
    }
    if (musicPreviewUrl !== url) {
      audio.src = url;
      audio.currentTime = 0;
      setMusicPreviewTime(0);
      setMusicPreviewDuration(0);
      setMusicPreviewUrl(url);
    }
    void audio.play().then(
      () => setMusicPreviewPlaying(true),
      () => setMusicPreviewPlaying(false),
    );
  }

  useEffect(() => {
    if (!musicLibraryOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!musicPickerRef.current?.contains(event.target as Node)) {
        setMusicLibraryOpen(false);
        if (musicPreviewUrl !== invitation?.music.url) {
          musicPreviewRef.current?.pause();
          setMusicPreviewPlaying(false);
        }
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [invitation?.music.url, musicLibraryOpen, musicPreviewUrl]);

  function formatMusicTime(seconds: number) {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    return `${Math.floor(safeSeconds / 60)}:${String(safeSeconds % 60).padStart(2, "0")}`;
  }

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
              assetId: string | null;
              url: string;
              filename: string;
              composer?: string; performer?: string; instrument?: string;
              durationSeconds?: number | null; license?: string; attribution?: string;
              sourceUrl?: string; licenseUrl?: string;
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
      .then(([catalogTracks, assets]) => {
        if (controller.signal.aborted) return;
        setSavedMusic([
          {
            id: CATALOG_PREVIEW_MUSIC.id,
            assetId: null,
            url: CATALOG_PREVIEW_MUSIC.url,
            filename: CATALOG_PREVIEW_MUSIC.filename,
          },
          ...catalogTracks.map((track) => ({ ...track })),
          ...assets.map((asset) => ({ ...asset, assetId: asset.id })),
        ]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setMusicLibraryLoading(false);
      });
    return () => controller.abort();
  }, [invitation?.id, invitation?.music.enabled]);

  useEffect(() => {
    const invitationId = invitation?.id;
    if (!invitationId || adminContext) return;
    const controller = new AbortController();
    setPaymentOrder(null);
    setManualPaymentLink(false);
    setPaymentLinkNotice("");
    void studioFetch(
      `/api/invitations/${encodeURIComponent(invitationId)}/payment`,
      { cache: "no-store", signal: controller.signal },
    )
      .then(async (response) => (response.ok ? response.json() : null))
      .then((result) => {
        if (controller.signal.aborted || result?.invitation?.id !== invitationId)
          return;
        const order = result.order as PaymentOrderView | null;
        setPaymentOrder(order);
        if (order?.status === "SUCCEEDED") setPaidInvitationId(invitationId);
      })
      .catch(() => {
        // Checkout state is optional here; publishing rechecks payment server-side.
      });
    return () => controller.abort();
  }, [invitation?.id, adminContext]);

  const refreshPayment = useCallback(
    async (orderId: string, signal?: AbortSignal) => {
      if (paymentCheckInFlight.current) return;
      paymentCheckInFlight.current = true;
      setCheckingPayment(true);
      try {
        const response = await studioFetch(
          `/api/payments/${encodeURIComponent(orderId)}/refresh`,
          { method: "POST", signal },
        );
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.error?.message ?? "To‘lovni tekshirib bo‘lmadi.");
        if (signal?.aborted) return;
        const order = result.order as PaymentOrderView;
        setPaymentOrder(order);
        if (order.status === "SUCCEEDED" && invitation?.id === order.invitationId)
          setPaidInvitationId(order.invitationId);
        if (order.url) setPublicUrl(order.url);
      } catch (cause) {
        if (!signal?.aborted)
          setError(cause instanceof Error ? cause.message : "Ulanishni tekshiring.");
      } finally {
        paymentCheckInFlight.current = false;
        if (!signal?.aborted) setCheckingPayment(false);
      }
    },
    [invitation?.id],
  );

  useEffect(() => {
    if (
      !paymentOrder ||
      !["CREATED", "PENDING", "PROCESSING", "REJECTED"].includes(paymentOrder.status)
    )
      return;
    const controller = new AbortController();
    const checkWhenVisible = () => {
      if (!document.hidden) void refreshPayment(paymentOrder.id, controller.signal);
    };
    const timer = window.setInterval(checkWhenVisible, 15000);
    window.addEventListener("focus", checkWhenVisible);
    document.addEventListener("visibilitychange", checkWhenVisible);
    return () => {
      controller.abort();
      window.clearInterval(timer);
      window.removeEventListener("focus", checkWhenVisible);
      document.removeEventListener("visibilitychange", checkWhenVisible);
    };
  }, [paymentOrder?.id, paymentOrder?.status, refreshPayment]);

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
          resolveTemplateId(query.get("useTemplate") ?? query.get("template") ?? ""),
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
      const selected = templateIdSchema.safeParse(resolveTemplateId(template ?? ""));
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
      const newInvitation = normalizeInvitation(created);
      setInvitation(newInvitation);
      try {
        saveBrowserDraft(newInvitation, true, ownerId.current);
      } catch {
        setError(
          "Brauzerga saqlash imkoni yo‘q. Zaxira uchun qoralamangizni yuklab oling.",
        );
      }
      bindDraftUrl(newInvitation.id);
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
    const refresh = () => setCatalogVersion((version) => version + 1);
    window.addEventListener("focus", refresh);
    fetch("/api/catalog", { cache: "no-store" })
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
      window.removeEventListener("focus", refresh);
    };
  }, [catalogVersion]);

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
          void refreshFavorites();
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

  if (!invitation || !previewInvitation)
    return (
      <div className={styles.loading}>
        <LoaderCircle size={24} className={styles.spinner} />
        <p>Taklifnomangiz tayyorlanmoqda…</p>
      </div>
    );
  const capabilities = templateCapabilities(invitation.templateId);
  const inputs = capabilities.inputs;
  const content = getContent(invitation, locale);
  // Placeholder copy follows the Uzbek Latin editor UI, independently of the
  // invitation language currently being authored.
  const selectedTemplate = templates.find(
    (item) => item.id === invitation.templateId,
  );
  const isImage = templateById(invitation.templateId)?.format === "image";
  const format = chosenFormat ?? (isImage ? "image" : "web");
  const formatTemplates = templates.filter(item => (item.format ?? "web") === format);
  const singleCelebrant = capabilities.people === 1 ||
    invitation.eventType === "sunnat-toyi" ||
    invitation.eventType === "beshik-toyi" ||
    invitation.templateId === "beshik" ||
    invitation.templateId === "nahor" ||
    invitation.eventType === "bitiruv" ||
    invitation.eventType === "korporativ" ||
    invitation.templateId === "bitiruv" ||
    invitation.templateId === "anjuman" ||
    invitation.eventType === "yangi-uy" ||
    invitation.templateId === "yangi-uy";
  const singleCelebrantLabel =
    invitation.eventType === "birthday" ? "Bayram sohibining ismi" :
    invitation.templateId === "nahor"
      ? "Mezbon yoki oila nomi"
      : invitation.eventType === "bitiruv"
        ? "Bitiruvchining ismi"
        : invitation.eventType === "korporativ" ||
            invitation.templateId === "anjuman"
          ? "Tashkilot yoki shaxs nomi"
          : invitation.eventType === "yangi-uy" ||
              invitation.templateId === "yangi-uy"
            ? "Xonadon yoki oila nomi"
            : invitation.templateId === "bitiruv"
              ? "Nishonlanuvchi ismi"
              : "Bola ismi";
  const singleCelebrantPlaceholder =
    invitation.eventType === "birthday" ? "Ismni kiriting" :
    invitation.templateId === "nahor"
      ? "Masalan, Rahmonovlar oilasi"
      : invitation.eventType === "bitiruv"
        ? "Bitiruvchining ismi"
        : invitation.eventType === "korporativ" ||
            invitation.templateId === "anjuman"
          ? "Tashkilot yoki shaxs nomi"
          : invitation.eventType === "yangi-uy" ||
              invitation.templateId === "yangi-uy"
            ? "Masalan, Rahmonovlar xonadoni"
            : invitation.templateId === "bitiruv"
              ? "Nishonlanuvchining ismi"
              : "Bolaning ismi";
  const personFields = Array.from(
    { length: Math.min(capabilities.people, Math.max(content.people.length, singleCelebrant ? 1 : 2)) },
    (_, index) => content.people[index] ?? "",
  );
  const compatibleTemplates = orderEventTemplates(
    formatTemplates,
    invitation.eventType,
  );
  const readiness = publicationIssues(normalizeInvitation(invitation));
  const startsAtIssue = readiness.find((issue) => issue.path === "startsAt");
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
            ? ""
            : "Saqlanmoqda…";
  const identityLocked = invitation.status !== "draft" || !!invitation.imageExportedAt || !!editAccess?.locked;
  const publishedInvitation = invitation.status === "published" && !!invitation.slug;
  let earliestDraftEventDate: string | undefined;
  if (!identityLocked) {
    try {
      earliestDraftEventDate = eventDay(clockNow, invitation.timezone);
    } catch {
      // The timezone validation issue will ask the creator to correct it.
    }
  }
  const staticLocked = isImage && identityLocked;
  const contentExpired = identityLocked && (!editAccess || editingClosed({ ...editAccess, locked: true }, clockNow));
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
    invitation.templateData["kongillar-oroli"] ?? {},
  );
  function updatePulauData(patch: Partial<typeof pulauData>) {
    setInvitation((current) =>
      current
        ? {
            ...current,
            templateData: {
              ...current.templateData,
              "kongillar-oroli": { ...pulauData, ...patch },
            },
          }
        : current,
    );
  }
  const terracottaData=terracottaDataSchema.parse(invitation.templateData["terrakota"] ?? {});
  function updateTerracottaNote(key:keyof typeof terracottaData,value:string){setInvitation(current=>current?{...current,templateData:{...current.templateData,"terrakota":{...terracottaData,[key]:{...terracottaData[key],[locale]:value}}}}:current);}
  const starryData=starryDataSchema.parse(invitation.templateData["yulduzli-tun"] ?? {});
  function updateStarryNote(key:keyof typeof starryData,value:string){setInvitation(current=>current?{...current,templateData:{...current.templateData,"yulduzli-tun":{...starryData,[key]:{...starryData[key],[locale]:value}}}}:current);}
  const sharlarData=sharlarDataSchema.parse(invitation.templateData["sharlar"] ?? {});
  const sakuraData=sakuraDataSchema.parse(invitation.templateData["sakura-guli"] ?? {});
  function updateSakuraNote(key:keyof typeof sakuraData,value:string){setInvitation(current=>current?{...current,templateData:{...current.templateData,"sakura-guli":{...sakuraData,[key]:{...sakuraData[key],[locale]:value}}}}:current);}
  const qogozData=qogozDataSchema.parse(invitation.templateData["qogoz-ertagi"] ?? {});
  function updateQogozNote(key:keyof typeof qogozData,value:string){setInvitation(current=>current?{...current,templateData:{...current.templateData,"qogoz-ertagi":{...qogozData,[key]:{...qogozData[key],[locale]:value}}}}:current);}
  const pariData=pariDataSchema.parse(invitation.templateData["parilar-ertagi"] ?? {});
  function updatePariDetail(value:string,id?:string){setInvitation(current=>current?{...current,templateData:{...current.templateData,"parilar-ertagi":id?{...pariData,programLabels:{...pariData.programLabels,[id]:{...pariData.programLabels[id],[locale]:value}}}:{...pariData,arrivalNote:{...pariData.arrivalNote,[locale]:value}}}}:current);}
  const osmonData=osmonDataSchema.parse(invitation.templateData["osmon"] ?? {});
  function updateOsmonNote(key:keyof typeof osmonData,value:string){setInvitation(current=>current?{...current,templateData:{...current.templateData,"osmon":{...osmonData,[key]:{...osmonData[key],[locale]:value}}}}:current);}
  const oltinYolData=oltinYolDataSchema.parse(invitation.templateData["oltin-yol"] ?? {});
  function updateOltinNote(key:keyof typeof oltinYolData,value:string){setInvitation(current=>current?{...current,templateData:{...current.templateData,"oltin-yol":{...oltinYolData,[key]:{...oltinYolData[key],[locale]:value}}}}:current);}
  const mountainData=mountainDataSchema.parse(invitation.templateData["toglar-bagrida"] ?? {});
  function updateMountainTime(key:"ceremonyTime"|"celebrationTime",value:string){setInvitation(current=>current?{...current,templateData:{...current.templateData,"toglar-bagrida":{...mountainData,[key]:value}}}:current);}
  const zarrinData=zarrinDataSchema.parse(invitation.templateData["zarrin-gullar"] ?? {});
  function updateZarrinField(key:"brideFamily"|"groomFamily"|"stayText"|"footerNote"|"hashtag",value:string){setInvitation(current=>current?{...current,templateData:{...current.templateData,"zarrin-gullar":{...zarrinData,[key]:key==="hashtag"?value:{...zarrinData[key],[locale]:value}}}}:current);}
  const gulbogData=gulbogDataSchema.parse(invitation.templateData["gulbog"] ?? {});
  function updateGulbogField(key:keyof typeof gulbogData,value:string){setInvitation(current=>current?{...current,templateData:{...current.templateData,"gulbog":{...gulbogData,[key]:{...gulbogData[key],[locale]:value}}}}:current);}
  const xonadonData=fayzliXonadonDataSchema.parse(invitation.templateData["fayzli-xonadon"] ?? {});
  function updateXonadonMenu(menu: typeof xonadonData.menu) {setInvitation(current=>current?{...current,templateData:{...current.templateData,"fayzli-xonadon":{menu}}}:current);}
  const yubileyData = yubileySahifasiDataSchema.parse(invitation.templateData["umr-bahori"] ?? {});
  function updateYubileyData(next: typeof yubileyData) {
    setInvitation(current=>current ? {...current,templateData:{...current.templateData,"umr-bahori":next}} : current);
  }
  const muhrliMaktubData = muhrliMaktubDataSchema.parse(
    invitation.templateData["muhrli-maktub"] ?? {},
  );
  function updateMuhrliMaktubFlowersNote(value: string) {
    setInvitation((current) => {
      if (!current) return current;
      const data = muhrliMaktubDataSchema.parse(
        current.templateData["muhrli-maktub"] ?? {},
      );
      return {
        ...current,
        templateData: {
          ...current.templateData,
          "muhrli-maktub": {
            ...data,
            flowersNote: { ...data.flowersNote, [locale]: value },
          },
        },
      };
    });
  }
  function changeEventType(value: string) {
    const eventType = value as Invitation["eventType"];
    setNotice("");
    setInvitation((current) => {
      if (!current) return current;
      const next = switchEventType(current, eventType);
      const selected = templates.find((item) => item.id === current.templateId) ??
        templateById(current.templateId);
      return selected && !selected.supportedEventTypes.includes(eventType)
        ? { ...next, templateId: "" }
        : next;
    });
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
  async function saveOrPublish(action: "save" | "publish" | "download") {
    const current = invitationRef.current;
    if (!current || operationInFlight.current || uploading) return;
    let checkoutWindow: Window | null = null;
    setPublishIssues([]);
    const repeatSavedDownload = action === "download" && !!current.imageExportedAt &&
      (contentExpired || JSON.stringify(current) === lastCloudSnapshot.current);
    if (action === "publish" || (action === "download" && !repeatSavedDownload)) {
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
    const paymentAlreadyVerified =
      paidInvitationId === current.id ||
      (paymentOrder?.invitationId === current.id &&
        paymentOrder.status === "SUCCEEDED");
    if (
      action === "publish" &&
      publishingMode === "paid" &&
      !adminContext &&
      !paymentAlreadyVerified
    )
      checkoutWindow = window.open("about:blank", "_blank");
    pendingAction.current = action;
    operationInFlight.current = true;
    setBusy(true);
    setPublishing(action !== "save");
    setError("");
    setNotice("");
    try {
      if (repeatSavedDownload) {
        const response = await studioFetch(`/api/invitations/${current.id}`, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || "Taklifnoma yuklanmadi.");
        await downloadInvitationImage(data.invitation, locale, studioFetch);
        setNotice("Hisobdagi saqlangan PNG rasm qayta yuklab olindi.");
        return;
      }
      const sessionResponse = await studioFetch("/api/auth/session", {
        cache: "no-store",
      });
      if (!sessionResponse.ok)
        throw new Error(
          "Hisobni tekshirib bo‘lmadi. Qoralamangiz brauzerda saqlanmoqda.",
        );
      const session: SessionResponse = await sessionResponse.json();
      window.dispatchEvent(new CustomEvent("session-changed", { detail: { userId: session.user?.id ?? null } }));
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
            result.error?.code === "INVALID_ORIGIN"
              ? "Sayt manzili sozlamasi mos kelmadi. Iltimos, qo‘llab-quvvatlash xizmatiga xabar bering."
              : "Telegram orqali kirishni boshlab bo‘lmadi. Qayta urinib ko‘ring.",
          );
        setAuth(result);
        setAuthIdentity(null);
        setAuthStatus(
          "Telegram botida kirishni tasdiqlang. Keyin saytga qayting.",
        );
        return;
      }
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
      const payload = studioSavePayload(current, cloudInvitation.current);
      const response = await studioFetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitation: payload }),
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
        cloudInvitation.current = result.invitation;
        // Unsaved fields hidden by a switch remain recoverable in this browser.
        // Previously saved hidden fields already round-trip through the server.
        const localSaved = { ...current, ...result.invitation,
          ...Object.fromEntries(Object.keys(current).filter(key =>
            JSON.stringify(current[key as keyof Invitation]) !== JSON.stringify(payload[key as keyof Invitation]),
          ).map(key => [key, current[key as keyof Invitation]])),
        } as Invitation;
        lastCloudSnapshot.current = JSON.stringify(result.invitation);
        const changedDuringSave =
          JSON.stringify(invitationRef.current) !== JSON.stringify(current);
        if (!changedDuringSave) setInvitation(localSaved);
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
                : localSaved,
              changedDuringSave || JSON.stringify(localSaved) !== lastCloudSnapshot.current,
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
      if (action === "download") {
        const saved = invitationSchema.parse(result.invitation);
        const imageExportedAt = await downloadInvitationImage(saved, locale, studioFetch);
        const finalized = { ...saved, imageExportedAt };
        lastCloudSnapshot.current = JSON.stringify(finalized);
        setInvitation(finalized);
        if (!adminContext) saveBrowserDraft(finalized, false, ownerId.current);
        setNotice("PNG rasm yuklab olindi. Taklifnomangiz “Taklifnomalarim”da saqlangan.");
        return;
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
          const order = result.order as PaymentOrderView;
          setPaymentOrder(order);
          setManualPaymentLink(false);
          setPaymentLinkNotice("");
          if (order.status === "SUCCEEDED") setPaidInvitationId(saved.id);
          if (order.checkoutUrl) {
            openCheckout(order.checkoutUrl, checkoutWindow);
            checkoutWindow = null;
            setNotice("To‘lov oynasi ochildi. Holat shu sahifada tekshiriladi.");
          } else {
            checkoutWindow?.close();
            checkoutWindow = null;
          }
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
        JSON.stringify(current) !== JSON.stringify(payload)
          ? "Tanlangan dizayn maydonlari hisobingizga saqlandi. Boshqa dizaynga tegishli yangi ma’lumotlar shu brauzerdagi qoralamada saqlanadi."
          : "Taklifnomangiz hisobingizga saqlandi. Uni “Taklifnomalarim” bo‘limidan topasiz.",
      );
    } catch (cause) {
      checkoutWindow?.close();
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
      checkoutWindow?.close();
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
          "Kirish yakunlanmadi. Telegram botidagi tasdiqlashni tekshiring.",
        );
      void refreshFavorites();
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
        const section = document.querySelector<HTMLElement>(
          `main section[data-preview-target="${target}"]`,
        );
        const disclosure = section?.querySelector<HTMLButtonElement>(
          "button[aria-controls]",
        );
        if (!section || !disclosure) return;
        if (disclosure.getAttribute("aria-expanded") !== "true")
          disclosure.click();
        setPreviewTarget(target);
        section.scrollIntoView({ block: "center", behavior: "instant" });
        requestAnimationFrame(() => {
          const contentId = disclosure.getAttribute("aria-controls");
          document
            .getElementById(contentId ?? "")
            ?.querySelector<HTMLElement>("input, select, textarea, button")
            ?.focus({ preventScroll: true });
        });
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
        {publishedInvitation ? (
          <div className={styles.publishedToolbar}>
            <div className={styles.publishedReady}>
              <span className={styles.readyIcon}>
                <CheckCircle2 size={17} />
              </span>
              <span>
                <strong>Taklifnomangiz tayyor</strong>
                <small>Havolani mehmonlaringizga yuborishingiz mumkin.</small>
              </span>
            </div>
            <PublishedLink slug={invitation.slug!} canonicalUrl={publicUrl} compact />
            <div className={styles.publishedStatus}>
              <span>
                <i /> Nashr qilingan
              </span>
              {editAccess?.deadlineAt && (
                <small>
                  Tahrirlash muddati: {eventTimestamp(editAccess.deadlineAt, invitation.timezone)} · {invitation.timezone}
                </small>
              )}
            </div>
            {!adminContext && (
              <InvitationCorrections
                invitationId={invitation.id}
                onRefresh={() => {
                  if (
                    currentSnapshot !== lastCloudSnapshot.current &&
                    !window.confirm(
                      "Saqlanmagan o‘zgarishlar bor. Tasdiqlangan nusxani ochasizmi?",
                    )
                  )
                    return;
                  try {
                    deleteBrowserDraft(invitation.id);
                  } catch {
                    setError(
                      "Brauzerdagi qoralamani yangilab bo‘lmadi. Qayta urinib ko‘ring.",
                    );
                    return;
                  }
                  window.location.reload();
                }}
              />
            )}
          </div>
        ) : (
          <div className={styles.toolbarPreview}>
            {invitation.templateId && (
              <Link
                className={styles.fullPreviewLink}
                href={`/preview?template=${encodeURIComponent(publicTemplateId(invitation.templateId))}&draft=${encodeURIComponent(invitation.id)}`}
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
                <Eye size={14} /> {isImage ? "Rasmni ko‘rish" : "Mehmon sifatida ko‘rish"}
              </Link>
            )}
          </div>
        )}
        <div className={styles.toolbarSave}>
          {saveStatus && (
            <span className={styles.saveStatus} role="status">
              {saveStatus}
            </span>
          )}
          <button
            className={styles.saveButton}
            onClick={cloudSave}
            disabled={busy || uploading || !!auth || contentExpired}
          >
            <Save size={16} />
            {busy
              ? publishing
                ? isImage ? "Rasm tayyorlanmoqda…" : "Nashr qilinmoqda…"
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
        className={`${styles.workspace} ${section < sections.length - 1 ? styles.hasSelectionActions : ""}`}
      >
        <aside
          className={`${styles.sidebar} ${mobilePreview ? styles.mobileHidden : ""}`}
          aria-label="Tahrirlash bo‘limlari"
        >
          <Link href="/dashboard" className={styles.studioBrand}>
            {BRAND_NAME}<span>Yaratish studiyasi</span>
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
              </button>
            ))}
          </nav>
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
            <div className={styles.editorScroll} ref={editorScroll}>
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
            {!publishedInvitation && invitation.status === "published" && invitation.slug && (
              <PublishedLink slug={invitation.slug} canonicalUrl={publicUrl} />
            )}
            {identityLocked && !publishedInvitation && <section className={styles.editPolicy} aria-label="Tahrirlash qoidalari">
              <strong>{contentExpired ? "Tahrirlash muddati tugagan" : isImage ? "Rasm yakunlangan" : "Taklifnoma nashr qilingan"}</strong>
              <p>{contentExpired ? "Ma’lumotlar faqat o‘qish uchun. Tuzatish so‘rovi ochiq." : isImage ? "Faqat manzil va sana/vaqt tahrirlanadi." : "Amaliy tafsilotlar va shu kundagi vaqt tahrirlanadi."}</p>
              <details className={styles.policyDetails}><summary>Qoidalar va muddat</summary>
                {editAccess?.deadlineAt && <small>Tahrirlash muddati: {eventTimestamp(editAccess.deadlineAt, invitation.timezone)} · {invitation.timezone}</small>}
                <p>{isImage ? "Sana tasdiqlangan kundan kech bo‘lmasligi kerak. Ismlar va matnlar himoyalangan. Oldin yuborilgan PNG fayllar yangilanmaydi." : "Ismlar va asosiy tadbir ma’lumotlari himoyalangan. Sana ko‘chishi va ism tuzatishi uchun so‘rov yuboring."}</p>
              </details>
              {isImage && <button type="button" className={styles.secondaryButton} disabled={busy || uploading} onClick={() => void saveOrPublish("download")}><Download size={16} />{contentExpired ? "Saqlangan PNG rasmni yuklab olish" : "PNG rasmni qayta yuklab olish"}</button>}
              {adminContext && <a href="/admin?view=requests">Tuzatish so‘rovlarini ko‘rib chiqish</a>}
            </section>}
            {identityLocked && !publishedInvitation && !adminContext && <InvitationCorrections invitationId={invitation.id} onRefresh={() => {
              if (currentSnapshot !== lastCloudSnapshot.current && !window.confirm("Saqlanmagan o‘zgarishlar bor. Tasdiqlangan nusxani ochasizmi?")) return;
              try { deleteBrowserDraft(invitation.id); } catch {
                setError("Brauzerdagi qoralamani yangilab bo‘lmadi. Qayta urinib ko‘ring.");
                return;
              }
              window.location.reload();
            }} />}
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
            <div key={section} className={styles.stepContent}>
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
              <fieldset className={styles.lockedFields} disabled={contentExpired}>
              {section === 1 && !isImage && (
                <section className={styles.languageSettings} aria-label="Taklifnoma tillari">
                  <div className={styles.languageHeading}><Globe2 size={16} /><strong>Taklifnoma tillari</strong></div>
                  <div className={styles.languageChoices}>
                    {LOCALES.map((item) => {
                      const enabled = invitation.enabledLocales.includes(item);
                      return <button key={item} type="button" aria-pressed={enabled}
                        aria-label={item === "uz-Latn" ? "O‘zbekcha" : item === "uz-Cyrl" ? "Ўзбекча" : item === "en" ? "English" : "Русский"}
                        disabled={identityLocked || (enabled && invitation.enabledLocales.length === 1)}
                        className={enabled ? styles.enabledLanguage : ""}
                        onClick={() => {
                          const next = enabled ? removeLanguage(invitation, item) : addInvitationLanguage(invitation, item);
                          setInvitation(next);
                          setLocale(enabled ? (next.enabledLocales.includes(locale) ? locale : next.defaultLocale) : item);
                        }}>
                        <span>{item === "uz-Latn" ? "O‘zbekcha" : item === "uz-Cyrl" ? "Ўзбекча" : item === "en" ? "English" : "Русский"}</span>
                        <Check size={14} aria-hidden="true" style={{opacity: enabled ? 1 : 0}} />
                      </button>;
                    })}
                  </div>
                  {invitation.enabledLocales.length > 1 && <div className={styles.languageEditor}>
                    <span>Matn tili</span>
                    <SoftSelect label="Tahrirlash tili" value={locale}
                      onChange={(value) => setLocale(value as Locale)}
                      options={invitation.enabledLocales.map((item) => ({value:item,label:LANGUAGE_NAMES[item]}))} />
                  </div>}
                </section>
              )}

            {section === 1 && capabilities.hasRenderer && (
              <div className={styles.scheduleSections}>
                <StudioSection id="studio-people-title" title="Tadbir egalari" description="Ismlar va taklif etuvchi mezbonlar." icon={Users}>
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
                      </div>
                    </Field>
                  ))}
                </div>
                {identityLocked && (
                  <p className={styles.help}>
                    {isImage ? "Birinchi yuklab olishdan keyin" : "Nashrdan keyin"} asosiy ismlar va tadbir turi o‘zgarmaydi.
                    Tuzatish uchun administratorga murojaat qiling.
                  </p>
                )}
                {invitation.eventType === "birthday" && capabilities.age && (
                  <Field label="Bayram sohibining yoshi" hint="Ixtiyoriy. Tug‘ilgan kun dizaynlarida ko‘rsatiladi.">
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={invitation.celebrantAge ?? ""}
                      disabled={identityLocked}
                      onChange={(event) => {
                        const value = event.target.value;
                        update({ celebrantAge: value === "" ? null : Math.min(120, Math.max(1, Number(value))) });
                      }}
                    />
                  </Field>
                )}
                {inputs.hosts && <Field label="Oila yoki mezbonlar" hint="Ixtiyoriy">
                  <input
                    value={content.hosts}
                    placeholder={placeholders.family}
                    maxLength={300}
                    disabled={identityLocked}
                    onChange={(event) =>
                      updateContent({ hosts: event.target.value })
                    }
                  />
                </Field>}
                {invitation.templateId === "kongillar-oroli" && (
                  <Field label="Birga taklif etuvchilar">
                    <textarea
                      value={pulauData.coInviters}
                      disabled={identityLocked}
                      maxLength={1000}
                      rows={2}
                      onChange={(event) =>
                        updatePulauData({ coInviters: event.target.value })
                      }
                    />
                  </Field>
                )}
                </StudioSection>
                <StudioSection id="studio-wording-title" title="Taklif matni" description="Mehmonlarga aytmoqchi bo‘lgan so‘zlaringiz." icon={FileText} disabled={staticLocked}>
                {inputs.eventLabel && <Field
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
                </Field>}
                {inputs.greeting && <Field label="Mehmonlarga salomlashish">
                  <input
                    value={content.greeting}
                    maxLength={300}
                    onChange={(event) =>
                      updateContent({ greeting: event.target.value })
                    }
                  />
                </Field>}
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
                </StudioSection>
                {capabilities.story > 0 && (
                  <StudioSection id="studio-story-title" title="Hikoyangiz" description="Har bir til uchun hikoya boblarini alohida kiriting." icon={BookOpen}>
                    <div className={styles.groupHeader}>
                      <button
                        className={styles.textButton}
                        disabled={invitation.story.length >= capabilities.story}
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
                    {invitation.story.slice(0, capabilities.story).map((chapter, index) => (
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
                        {invitation.templateId === "kongillar-oroli" && (
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
                  </StudioSection>
                )}
              </div>
            )}
            {invitation.templateId === "kongillar-oroli" && (
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
              <div className={styles.scheduleSections}>
                <section className={styles.scheduleCard} aria-labelledby="studio-date-title">
                <div className={styles.scheduleHeading}>
                  <span><CalendarDays size={19} /></span>
                  <div><h2 id="studio-date-title">Sana va vaqt</h2><p>Tadbir qachon boshlanadi?</p></div>
                  <small>Asosiy</small>
                </div>
                <Field label="Tadbir boshlanishi">
                  <DateTimePicker
                    value={invitation.startsAt}
                    disabled={contentExpired}
                    minDate={identityLocked ? isImage ? eventDay(clockNow, invitation.timezone) : invitation.startsAt.slice(0,10) : earliestDraftEventDate}
                    maxDate={identityLocked ? isImage ? editAccess?.approvedEventDate ?? invitation.startsAt.slice(0,10) : invitation.startsAt.slice(0,10) : undefined}
                    onChange={(startsAt) => {
                      setPublishIssues([]);
                      update({ startsAt });
                    }}
                  />
                  {startsAtIssue && (
                    <p className={styles.fieldError} role="alert">
                      {startsAtIssue.message}
                    </p>
                  )}
                </Field>
                {invitation.templateId === "kongillar-oroli" && (
                  <>
                    <div className={styles.divider} />
                    <Toggle
                      title="Ikkinchi marosim"
                      disabled={identityLocked}
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
                            disabled={identityLocked}
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
                        <VenueLink venue={{ latitude: pulauData.secondaryEvent.latitude ?? null, longitude: pulauData.secondaryEvent.longitude ?? null, mapUrl: pulauData.secondaryEvent.mapUrl, placeUri: pulauData.secondaryEvent.placeUri }}
                          nameInput={<Field label="Joy nomi">
                          <PlaceSearch value={pulauData.secondaryEvent.venueName} locale={locale} label="Qo‘shimcha tadbir joyi"
                            confirmed={hasVenuePoint({ latitude: pulauData.secondaryEvent.latitude ?? null, longitude: pulauData.secondaryEvent.longitude ?? null })}
                            onChange={venueName => updatePulauData({ secondaryEvent: { ...pulauData.secondaryEvent, venueName } })}
                            onSelect={place => updatePulauData({ secondaryEvent: { ...pulauData.secondaryEvent, venueName: place.name, address: place.address, mapUrl: place.mapUrl, placeUri: place.placeUri, latitude: place.latitude, longitude: place.longitude } })} />
                        </Field>}
                          name={pulauData.secondaryEvent.venueName} locale={locale}
                          onEdit={() => updatePulauData({ secondaryEvent: { ...pulauData.secondaryEvent, mapUrl: "", placeUri: undefined, latitude: null, longitude: null } })}
                          onResolve={place => updatePulauData({ secondaryEvent: { ...pulauData.secondaryEvent, venueName: pulauData.secondaryEvent.venueName.trim() || place.name, address: place.address, mapUrl: place.mapUrl, placeUri: place.placeUri, latitude: place.latitude, longitude: place.longitude } })}
                          onNameChange={venueName => updatePulauData({ secondaryEvent: { ...pulauData.secondaryEvent, venueName } })} />
                        <Field label="Manzil">
                          <textarea
                            value={pulauData.secondaryEvent.address}
                            maxLength={1000}
                            onChange={(event) =>
                              updatePulauData({
                                secondaryEvent: {
                                  ...pulauData.secondaryEvent,
                                  address: event.target.value,
                                  mapUrl: "", placeUri: undefined, latitude: null, longitude: null,
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
                    {isImage ? "Sanani tasdiqlangan kundan kechroqqa ko‘chirish uchun so‘rov yuboring." : "Shu kundagi vaqtni o‘zgartirish mumkin. Boshqa kunga ko‘chirish uchun so‘rov yuboring."}
                  </p>
                )}
                </section>
                {capabilities.maps && (<section className={styles.scheduleCard} aria-labelledby="studio-venue-title">
                <div className={styles.scheduleHeading}>
                  <span><MapPin size={19} /></span>
                  <div><h2 id="studio-venue-title">Manzil</h2><p>{isImage ? "Tanlangan Yandex manzili rasmga QR kod sifatida tushadi." : "Mehmonlar uchun joy va yo‘l-yo‘riq."}</p></div>
                  <small>Asosiy</small>
                </div>
                <VenueLink venue={invitation.venue} name={content.venueName} locale={locale}
                  nameInput={<Field
                  label="To‘yxona yoki joy nomi"
                >
                  <PlaceSearch
                    value={content.venueName}
                    locale={locale}
                    confirmed={hasVenuePoint(invitation.venue)}
                    onChange={(venueName) => updateContent({ venueName })}
                    onSelect={(place) => setInvitation(current => current ? {
                      ...current,
                      venue: { latitude: place.latitude, longitude: place.longitude, mapUrl: place.mapUrl, placeUri: place.placeUri },
                      content: Object.fromEntries(Object.entries(current.content).map(([language, text]) => [language, { ...text, venueName: place.name, address: place.address }])),
                    } : current)}
                  />
                </Field>}
                  onEdit={() => setInvitation(current => current ? { ...current, venue: { latitude: null, longitude: null, mapUrl: "" } } : current)}
                  onResolve={place => setInvitation(current => current ? {
                    ...current,
                    venue: { latitude: place.latitude, longitude: place.longitude, mapUrl: place.mapUrl, ...(place.placeUri ? { placeUri: place.placeUri } : {}) },
                    content: Object.fromEntries(Object.entries(current.content).map(([language, text]) => [language, { ...text, venueName: text.venueName.trim() || place.name, address: place.address }])),
                  } : current)}
                  onNameChange={venueName => updateContent({ venueName })} />
                <div className={styles.venueDetails}>
                <Field label="To‘liq manzil" icon={<MapPinned size={14} aria-hidden="true" />}>
                  <textarea value={content.address} rows={2} maxLength={1000}
                    onChange={event => setInvitation(current => current ? {
                      ...current, venue: { latitude: null, longitude: null, mapUrl: "" },
                      content: { ...current.content, [locale]: { ...getContent(current, locale), address: event.target.value } },
                    } : current)} />
                </Field>
                {(!capabilities.imageFields || capabilities.imageFields.includes("landmark")) && <Field label="Mo‘ljal va yo‘l-yo‘riq" icon={<Signpost size={14} aria-hidden="true" />}>
                  <textarea
                    value={content.landmark}
                    rows={2}
                    maxLength={1000}
                    onChange={(event) =>
                      updateContent({ landmark: event.target.value })
                    }
                    placeholder={placeholders.optional}
                  />
                </Field>}
                </div>
                {hasVenuePoint(invitation.venue) && <div className={styles.venueSelection}>
                  <iframe key={`${invitation.venue.latitude},${invitation.venue.longitude}`} title="Tanlangan joy — Yandex Maps"
                    src={`/maps/venue?latitude=${invitation.venue.latitude}&longitude=${invitation.venue.longitude}&lang=${locale}&destination=${encodeURIComponent(yandexMapUrl(invitation.venue))}`}
                    loading="lazy" />
                </div>}
                </section>)}
                {capabilities.program && (<section className={styles.scheduleCard} aria-labelledby="studio-program-title">
                <div className={styles.scheduleHeading}>
                  <span><ListOrdered size={19} /></span>
                  <div><h2 id="studio-program-title">Tadbir dasturi</h2><p>Kun tartibi va har bir bosqich vaqti.</p></div>
                  <small>Ixtiyoriy</small>
                </div>
                {inputs.programHeading && <Field label="Dastur sarlavhasi">
                  <input
                    value={content.programHeading}
                    maxLength={300}
                    onChange={(event) =>
                      updateContent({ programHeading: event.target.value })
                    }
                  />
                </Field>}
                {invitation.program.length === 0 && (
                  <section className={styles.programExample} aria-labelledby="studio-program-example-title">
                    <div className={styles.programExampleHeading}>
                      <Lightbulb size={24} aria-hidden="true" />
                      <div>
                        <span className={styles.programExampleBadge}>Namuna</span>
                        <h3 id="studio-program-example-title">Dastur bandlari qanday ko‘rinadi?</h3>
                        <p>Bu faqat namuna. O‘zingiz dastur bandlarini qo‘shmaguningizcha mehmonlarga ko‘rsatilmaydi.</p>
                      </div>
                    </div>
                    <ol className={styles.programExampleList}>
                      <li><time>18:00</time><span>Mehmonlarni kutib olish<small>Namuna</small></span></li>
                      <li><time>18:30</time><span>Tadbirning boshlanishi<small>Namuna</small></span></li>
                    </ol>
                  </section>
                )}
                {invitation.program.length > 0 && <div className={styles.program}>
                  {invitation.program.slice(0, capabilities.programLimit).map((item) => (
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
                        {inputs.programDescriptions && (
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
                </div>}
                <button
                  type="button"
                  className={styles.addButton}
                  disabled={invitation.program.length >= capabilities.programLimit}
                  onClick={() =>
                    setInvitation(addStarterProgramItem(invitation))
                  }
                >
                  <Plus size={17} />
                  {invitation.program.length ? "Dastur bandini qo‘shish" : "Birinchi dastur bandini qo‘shish"}
                </button>
                <p className={styles.programOptionalNote}><Info size={15} aria-hidden="true" />Dastur ixtiyoriy — bo‘sh qoldirsangiz ham davom etishingiz mumkin.</p>
                {invitation.program.length > 0 && <section
                  className={styles.programSectionPreview}
                  aria-label="Taklifnomadagi dastur ko‘rinishi"
                >
                  <span className={styles.programSectionPreviewEyebrow}>
                    Taklifnomada ko‘rinishi
                  </span>
                  <h3>{content.programHeading || "To‘y dasturi"}</h3>
                  <ol>
                      {invitation.program.slice(0, capabilities.programLimit).map((item) => (
                        <li key={item.id}>
                          <time>{item.time || "--:--"}</time>
                          <span>
                            {content.programTitles[item.id]?.trim() ||
                              placeholders.programItem}
                            {invitation.templateId === "gulchambar" &&
                              content.programDescriptions[item.id]?.trim() && (
                                <small>
                                  {content.programDescriptions[item.id]}
                                </small>
                              )}
                          </span>
                        </li>
                      ))}
                  </ol>
                </section>}
                </section>)}
                {capabilities.dressCode && (<section className={styles.scheduleCard} aria-labelledby="studio-dress-title">
                <div className={styles.scheduleHeading}>
                  <span><Shirt size={19} /></span>
                  <div><h2 id="studio-dress-title">Kiyinish uslubi</h2><p>Mehmonlarga uslub va ranglarni tavsiya qiling.</p></div>
                  <small>Ixtiyoriy</small>
                </div>
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
                    {inputs.dressStyle && <Field label="Kiyinish uslubi">
                      <input
                        value={invitation.dressCode.style[locale] ?? ""}
                        maxLength={300}
                        onChange={(event) =>
                          updateDressCodeText("style", event.target.value)
                        }
                      />
                    </Field>}
                    {inputs.dressText && <Field label="Mehmonlar uchun izoh">
                      <textarea
                        value={invitation.dressCode.text[locale] ?? ""}
                        maxLength={10000}
                        rows={3}
                        onChange={(event) =>
                          updateDressCodeText("text", event.target.value)
                        }
                      />
                    </Field>}
                    {inputs.dressNote && <Field label="Qo‘shimcha eslatma" hint="Ixtiyoriy">
                      <textarea
                        value={invitation.dressCode.note[locale] ?? ""}
                        maxLength={10000}
                        rows={2}
                        onChange={(event) =>
                          updateDressCodeText("note", event.target.value)
                        }
                      />
                    </Field>}
                    {(inputs.dressColorNames || inputs.dressColorHex) && <>
                    <div className={styles.sectionHeading}>
                      <strong>Ranglar palitrasi</strong>
                      <span>{invitation.dressCode.colors.length}/{capabilities.dressColorLimit}</span>
                    </div>
                    {invitation.dressCode.colors.slice(0, capabilities.dressColorLimit).map((color, index) => (
                      <div key={color.id} className={styles.twoColumns}>
                        {inputs.dressColorNames && <Field label={`${index + 1}-rang nomi`}>
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
                        </Field>}
                        {inputs.dressColorHex && <Field label="Rang kodi">
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
                        </Field>}
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
                      disabled={invitation.dressCode.colors.length >= capabilities.dressColorLimit}
                      onClick={() =>
                        updateDressCode({
                          colors: [
                            ...invitation.dressCode.colors,
                            {
                              id: crypto.randomUUID(),
                              name: { [locale]: "" },
                              hex: inputs.dressColorHex ? "#c9a55c" : "#000000",
                            },
                          ],
                        })
                      }
                    >
                      <Plus size={17} /> Rang qo‘shish
                    </button>
                    </>}
                  </div>
                )}
                </section>)}
              </div>
            )}

            {section === 0 && (
              <div className={styles.form}>
                <TemplateFormatSwitch value={format} disabled={identityLocked} onChange={next => {
                  setChosenFormat(next);
                  const available = templates.filter(item => (item.format ?? "web") === next);
                  const eventType = available.some(item => item.supportedEventTypes.includes(invitation.eventType))
                    ? invitation.eventType : available[0]?.previewEventType ?? available[0]?.supportedEventTypes[0] ?? invitation.eventType;
                  const sameFormat = (templateById(invitation.templateId)?.format ?? "web") === next;
                  changeEventType(eventType);
                  update({ templateId: sameFormat ? invitation.templateId : "" });
                  setLocale(invitation.defaultLocale);
                }} />
                <Field label="Tadbir turi">
                  <SoftSelect
                    label="Tadbir turi"
                    value={invitation.eventType}
                    disabled={identityLocked}
                    options={EVENT_TYPE_OPTIONS.filter(item => formatTemplates.some(template => template.supportedEventTypes.includes(item.id))).map((item) => ({
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
                  onOpen={() => setCatalogVersion((version) => version + 1)}
                  categories={categories}
                  disabled={identityLocked}
                  onSelect={(id) =>
                    setInvitation(switchTemplate(invitation, id))
                  }
                />
                {identityLocked && (
                  <p className={styles.help}>
                    {isImage ? "Yuklab olingan rasm taklifnomada dizaynni almashtirib bo‘lmaydi." : "Nashr qilingan taklifnomada dizaynni almashtirish hozircha mavjud emas."}
                  </p>
                )}
              </div>
            )}

            {section === 3 && (
              <div className={styles.finishingSections}>
                {(capabilities.gallery > 0) && (<OptionalSection
                  title="Rasmlar"
                  icon={ImagePlus}
                  summary={`${invitation.gallery.length} ta rasm`}
                  target="gallery"
                  enabled={invitation.optionalFeatures.gallery}
                  onEnabledChange={(gallery) => update({ optionalFeatures: { ...invitation.optionalFeatures, gallery } })}
                  onLeave={() => {
                    if (invitation.optionalFeatures.gallery && invitation.gallery.length === 0) {
                      update({ optionalFeatures: { ...invitation.optionalFeatures, gallery: false } });
                      return true;
                    }
                    return false;
                  }}
                >
                  <div className={styles.groupHeader}>
                    <h2>
                      <ImagePlus size={20} />
                      Xotiralaringiz
                    </h2>
                    <span className={styles.optional}>Ixtiyoriy</span>
                  </div>
                  <p className={styles.help}>
                    {capabilities.gallery === 1 ? "Bu dizayn uchun bitta portret yuklang." : "Qadrli lahzalaringizni rasm sifatida yuklang."}
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
                      disabled={uploading || invitation.gallery.length >= capabilities.gallery}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) void upload(file, "image");
                        event.target.value = "";
                      }}
                    />
                  </label>

                  {invitation.gallery.slice(0, capabilities.gallery).map((image, index) => (
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
                </OptionalSection>)}
                {capabilities.artists > 0 && (
                  <OptionalSection
                    title="San’atkorlar va boshlovchilar"
                    icon={Users}
                    summary={`${invitation.artistLineup.length} ta ishtirokchi`}
                    enabled={invitation.optionalFeatures.artists}
                    onEnabledChange={(artists) => update({ optionalFeatures: { ...invitation.optionalFeatures, artists } })}
                    onLeave={() => {
                      const hasNamedArtist = invitation.artistLineup.some((artist) =>
                        invitation.enabledLocales.some((item) => artist.name[item]?.trim()),
                      );
                      if (invitation.optionalFeatures.artists && !hasNamedArtist) {
                        update({ optionalFeatures: { ...invitation.optionalFeatures, artists: false } });
                        return true;
                      }
                      return false;
                    }}
                  >
                    <div className={styles.divider} />
                    <div className={styles.groupHeader}>
                      <h2>
                        <Users size={20} /> San’atkorlar va boshlovchilar
                      </h2>
                      <button
                        className={styles.textButton}
                        disabled={
                          invitation.artistLineup.length >= 50
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
                    {invitation.artistLineup.slice(0, capabilities.artists).map((artist, index) => (
                      <div className={styles.storyItem} key={artist.id}>
                        <div className={styles.twoColumns}>
                          <Field
                            label={`${index + 1}-san’atkor ismi · ${LANGUAGE_NAMES[locale]}`}
                          >
                            <input
                              value={artist.name[locale] ?? ""}
                              maxLength={300}
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
                              disabled={uploading}
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
                {(capabilities.music) && (<OptionalSection
                  title="Musiqa"
                  icon={Music2}
                  summary={
                    invitation.music.enabled
                      ? invitation.music.filename || "Yoqilgan"
                      : "O‘chirilgan"
                  }
                  target="music"
                  enabled={invitation.music.enabled}
                  onEnabledChange={(enabled) => {
                    if (!enabled) {
                      musicPreviewRef.current?.pause();
                      setMusicPreviewPlaying(false);
                    }
                    update({ music: { ...(enabled && !invitation.music.url ? DEFAULT_INVITATION_MUSIC : invitation.music), enabled } });
                  }}
                  onLeave={() => {
                    if (invitation.music.enabled && !invitation.music.url.trim()) {
                      update({ music: { ...invitation.music, enabled: false } });
                      return true;
                    }
                    return false;
                  }}
                >
                  <div className={`${styles.optionBody} ${styles.musicPickerBody}`}>
                      <div className={styles.classicalLibrary} ref={musicPickerRef}>
                        <div className={styles.musicSearch}>
                          <Search size={16} aria-hidden="true" />
                          <input
                            type="search"
                            aria-label="Musiqa qidirish"
                            value={musicLibrarySearch}
                            onFocus={() => setMusicLibraryOpen(true)}
                            onChange={(event) => {
                              setMusicLibrarySearch(event.target.value);
                              setMusicLibraryOpen(true);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Escape") {
                                setMusicLibraryOpen(false);
                                setMusicLibrarySearch("");
                              }
                            }}
                            placeholder="Kutubxonadan musiqa tanlang…"
                          />
                          {musicLibraryOpen && (
                            <button
                              type="button"
                              className={styles.clearMusicSearch}
                              aria-label={musicLibrarySearch ? "Qidiruvni tozalash" : "Musiqa ro‘yxatini yopish"}
                              onClick={() => {
                                if (musicLibrarySearch) {
                                  setMusicLibrarySearch("");
                                } else {
                                  setMusicLibraryOpen(false);
                                  if (musicPreviewUrl !== invitation.music.url) {
                                    musicPreviewRef.current?.pause();
                                    setMusicPreviewPlaying(false);
                                  }
                                }
                              }}
                            >
                              <X size={15} />
                            </button>
                          )}
                        </div>
                        <div
                          className={`${styles.classicalTrackList} ${musicLibraryOpen ? styles.classicalTrackListOpen : styles.classicalTrackListClosed}`}
                          aria-hidden={!musicLibraryOpen}
                        >
                            {filteredLibraryTracks.map((track) => {
                              const selected = invitation.music.assetId
                                ? track.assetId === invitation.music.assetId
                                : track.url === invitation.music.url;
                              const activePreview = musicPreviewUrl === track.url;
                              const playing = activePreview && musicPreviewPlaying;
                              const byline = track.composer && track.performer
                                ? `${track.composer} · ${track.performer}`
                                : "Yuklangan musiqa";
                              const trackDuration = activePreview && musicPreviewDuration
                                ? musicPreviewDuration
                                : track.durationSeconds ?? 0;
                              return (
                                <div
                                  key={track.id}
                                  className={`${styles.classicalTrack}${selected ? ` ${styles.classicalTrackSelected}` : ""}`}
                                >
                                  <button
                                    type="button"
                                    className={styles.musicPlayButton}
                                    aria-label={`${playing ? "To‘xtatish" : "Tinglash"}: ${track.filename}`}
                                    aria-pressed={playing}
                                    onClick={() => toggleMusicPreview(track.url)}
                                  >
                                    {playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
                                  </button>
                                  <div className={styles.classicalTrackInfo}>
                                    <button
                                      type="button"
                                      className={styles.classicalTrackChoose}
                                      aria-pressed={selected}
                                      onClick={() => {
                                        musicPreviewRef.current?.pause();
                                        setMusicPreviewPlaying(false);
                                        setMusicLibraryOpen(false);
                                        setMusicLibrarySearch("");
                                        update({ music: { enabled: true, assetId: track.assetId, url: track.url, filename: track.filename } });
                                      }}
                                    >
                                      <span className={styles.classicalTrackTitle}>
                                        <span>{track.filename}</span>
                                        {selected && <Check size={15} aria-label="Tanlangan" />}
                                      </span>
                                    </button>
                                    <div className={`${styles.classicalTrackSubline}${playing ? ` ${styles.classicalTrackSublinePlaying}` : ""}`}>
                                      <span className={styles.classicalTrackByline} aria-hidden={playing}>{byline}</span>
                                      <input
                                        className={styles.musicTrackScrubber}
                                        type="range"
                                        min="0"
                                        max={musicPreviewDuration || trackDuration || 1}
                                        step="0.1"
                                        value={Math.min(musicPreviewTime, musicPreviewDuration || trackDuration || 0)}
                                        aria-label={`${track.filename} musiqasidagi vaqt`}
                                        aria-hidden={!playing}
                                        tabIndex={playing ? 0 : -1}
                                        onChange={(event) => {
                                          const nextTime = Number(event.target.value);
                                          if (musicPreviewRef.current) musicPreviewRef.current.currentTime = nextTime;
                                          setMusicPreviewTime(nextTime);
                                        }}
                                      />
                                    </div>
                                    <span className={styles.classicalTrackDuration}>
                                      {formatMusicTime(activePreview ? musicPreviewTime : 0)} / {formatMusicTime(trackDuration)}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                            {!filteredLibraryTracks.length && (
                              <p className={styles.musicEmptyState}>
                                {musicLibraryLoading ? placeholders.musicLoading : "Mos musiqa topilmadi."}
                              </p>
                            )}
                        </div>
                        {selectedMusicTrack && !musicLibraryOpen ? (
                          <div className={`${styles.classicalTrack} ${styles.classicalTrackSelected}`}>
                            <button
                              type="button"
                              className={styles.musicPlayButton}
                              aria-label={`${selectedMusicPreviewPlaying ? "To‘xtatish" : "Tinglash"}: ${selectedMusicTrack.filename}`}
                              aria-pressed={selectedMusicPreviewPlaying}
                              onClick={() => toggleMusicPreview(selectedMusicTrack.url)}
                            >
                              {selectedMusicPreviewPlaying
                                ? <Pause size={15} fill="currentColor" />
                                : <Play size={15} fill="currentColor" />}
                            </button>
                            <div className={styles.classicalTrackInfo}>
                              <span className={styles.classicalTrackTitle}><span>{selectedMusicTrack.filename}</span></span>
                              <div className={`${styles.classicalTrackSubline}${selectedMusicPreviewPlaying ? ` ${styles.classicalTrackSublinePlaying}` : ""}`}>
                                <span className={styles.classicalTrackByline} aria-hidden={selectedMusicPreviewPlaying}>
                                  {selectedMusicTrack.composer && selectedMusicTrack.performer
                                    ? `${selectedMusicTrack.composer} · ${selectedMusicTrack.performer}`
                                    : "Yuklangan musiqa"}
                                </span>
                                <input
                                  className={styles.musicTrackScrubber}
                                  type="range"
                                  min="0"
                                  max={selectedMusicDuration || 1}
                                  step="0.1"
                                  value={Math.min(musicPreviewTime, selectedMusicDuration || 0)}
                                  aria-label={`${selectedMusicTrack.filename} musiqasidagi vaqt`}
                                  aria-hidden={!selectedMusicPreviewPlaying}
                                  tabIndex={selectedMusicPreviewPlaying ? 0 : -1}
                                  onChange={(event) => {
                                    const nextTime = Number(event.target.value);
                                    if (musicPreviewRef.current) musicPreviewRef.current.currentTime = nextTime;
                                    setMusicPreviewTime(nextTime);
                                  }}
                                />
                              </div>
                              <span className={styles.classicalTrackDuration}>
                                {formatMusicTime(musicPreviewUrl === selectedMusicTrack.url ? musicPreviewTime : 0)} / {formatMusicTime(selectedMusicDuration)}
                              </span>
                            </div>
                          </div>
                        ) : !selectedMusicTrack && !musicLibraryOpen ? (
                          <p className={styles.musicEmptyState}>
                            {musicLibraryLoading ? placeholders.musicLoading : "Musiqa tanlanmagan."}
                          </p>
                        ) : null}
                      </div>
                      <label className={`${styles.audioUpload} ${styles.musicAudioUpload}`}>
                        <Music2 size={20} />
                        <span>
                          {uploading ? "Yuklanmoqda…" : "O‘z musiqangizni yuklang"}
                          <small>MP3, WAV yoki M4A · 15 MB gacha</small>
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
                      <audio
                        ref={musicPreviewRef}
                        className={styles.hiddenAudioPreview}
                        preload="none"
                        loop
                        onEnded={() => setMusicPreviewPlaying(false)}
                        onPause={() => setMusicPreviewPlaying(false)}
                        onTimeUpdate={(event) => setMusicPreviewTime(event.currentTarget.currentTime)}
                        onLoadedMetadata={(event) => setMusicPreviewDuration(event.currentTarget.duration)}
                      />

                  </div>
                </OptionalSection>)}
                <div className={styles.divider} />
                {(capabilities.gift) && (<OptionalSection
                  title="To‘yona"
                  icon={Gift}
                  summary={invitation.gift.enabled ? "Yoqilgan" : "O‘chirilgan"}
                  target="gift"
                  enabled={invitation.gift.enabled}
                  onEnabledChange={(enabled) =>
                    update({ gift: { ...invitation.gift, enabled, receiptUploadEnabled: enabled && invitation.gift.receiptUploadEnabled } })
                  }
                  onLeave={() => {
                    if (invitation.gift.enabled && (!invitation.gift.cardNumber.trim() || !invitation.gift.cardHolder.trim())) {
                      update({ gift: { ...invitation.gift, enabled: false, receiptUploadEnabled: false } });
                      return true;
                    }
                    return false;
                  }}
                >
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
                    {invitation.gift.enabled && capabilities.receipts && (
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
                    )}
                  </div>
                </OptionalSection>)}
                <div className={styles.divider} />
                {invitation.templateId === "terrakota" && <div className={styles.formGrid}>{(["infoNote","footerNote"] as const).map(key=><Field key={key} label={`${key === "infoNote" ? "Mehmonlarga eslatma" : "Yakuniy izoh"} · ${LANGUAGE_NAMES[locale]}`}><textarea maxLength={4000} rows={3} value={terracottaData[key][locale] || ""} onChange={e=>updateTerracottaNote(key,e.target.value)} /></Field>)}</div>}
                {invitation.templateId === "yulduzli-tun" && <div className={styles.formGrid}>{(["infoNote","footerNote"] as const).map(key=><Field key={key} label={`${key === "infoNote" ? "Mehmonlarga eslatma" : "Yakuniy izoh"} · ${LANGUAGE_NAMES[locale]}`}><textarea maxLength={4000} rows={3} value={starryData[key][locale] || ""} onChange={e=>updateStarryNote(key,e.target.value)} /></Field>)}</div>}
                {invitation.templateId === "sharlar" && <Field label="Eshiklar ochilish vaqti"><input type="time" value={sharlarData.doorsAt} onChange={e=>{const doorsAt=e.target.value;setInvitation(current=>current?{...current,templateData:{...current.templateData,"sharlar":{doorsAt}}}:current);}} /></Field>}
                {invitation.templateId === "sakura-guli" && <div className={styles.formGrid}>{(["contactNote","infoNote","footerNote"] as const).map(key=><Field key={key} label={`${({contactNote:"Aloqa haqida izoh",infoNote:"Mehmonlarga eslatma",footerNote:"Yakuniy izoh"})[key]} · ${LANGUAGE_NAMES[locale]}`}><textarea maxLength={4000} rows={3} value={sakuraData[key][locale] || ""} onChange={e=>updateSakuraNote(key,e.target.value)} /></Field>)}</div>}
                {invitation.templateId === "qogoz-ertagi" && <div className={styles.formGrid}>{(["contactNote","footerNote"] as const).map(key=><Field key={key} label={`${key === "contactNote" ? "Aloqa haqida izoh" : "Yakuniy izoh"} · ${LANGUAGE_NAMES[locale]}`}><textarea maxLength={4000} rows={3} value={qogozData[key][locale] || ""} onChange={e=>updateQogozNote(key,e.target.value)} /></Field>)}</div>}
                {invitation.templateId === "parilar-ertagi" && <div className={styles.formGrid}><Field label={`Kelish haqida · ${LANGUAGE_NAMES[locale]}`}><textarea maxLength={4000} rows={3} value={pariData.arrivalNote[locale] || ""} onChange={e=>updatePariDetail(e.target.value)} /></Field>{invitation.program.map(item=><Field key={item.id} label={`${item.time} · Qisqa dastur yorlig‘i · ${LANGUAGE_NAMES[locale]}`}><input maxLength={300} value={pariData.programLabels[item.id]?.[locale] || ""} onChange={e=>updatePariDetail(e.target.value,item.id)} /></Field>)}</div>}
                {invitation.templateId === "osmon" && <div className={styles.formGrid}>{(["rsvpNote","giftNote"] as const).map(key=><Field key={key} label={`${key === "rsvpNote" ? "Ishtirok haqida izoh" : "Sovg‘alar haqida izoh"} · ${LANGUAGE_NAMES[locale]}`}><textarea maxLength={4000} rows={3} value={osmonData[key][locale] || ""} onChange={e=>updateOsmonNote(key,e.target.value)} /></Field>)}</div>}
                {invitation.templateId === "oltin-yol" && <div className={styles.formGrid}>{(["arrivalNote","giftNote","contactNote","footerNote"] as const).map(key=><Field key={key} label={`${({arrivalNote:"Kelish haqida",giftNote:"Sovg‘alar haqida izoh",contactNote:"Mas’ul shaxs haqida",footerNote:"Yakuniy izoh"})[key]} · ${LANGUAGE_NAMES[locale]}`}><textarea maxLength={4000} rows={3} value={oltinYolData[key][locale] || ""} onChange={e=>updateOltinNote(key,e.target.value)} /></Field>)}</div>}
                {invitation.templateId === "toglar-bagrida" && <div className={styles.formGrid}>{(["ceremonyTime","celebrationTime"] as const).map(key=><Field key={key} label={key === "ceremonyTime" ? "Marosim vaqti" : "Ziyofat vaqti"}><input maxLength={80} value={mountainData[key]} placeholder="Asosiy tadbir vaqti" onChange={e=>updateMountainTime(key,e.target.value)} /></Field>)}</div>}
                {invitation.templateId === "zarrin-gullar" && <div className={styles.formGrid}>
                  {(["brideFamily","groomFamily","stayText","footerNote","hashtag"] as const).map(key=><Field key={key} label={`${({brideFamily:"Kelin oilasi",groomFamily:"Kuyov oilasi",stayText:"Turar joy haqida",footerNote:"Yakuniy izoh",hashtag:"Heshteg"})[key]} · ${LANGUAGE_NAMES[locale]}`}><textarea maxLength={key==="hashtag"?100:4000} rows={2} disabled={identityLocked && (key==="brideFamily" || key==="groomFamily")} value={key==="hashtag"?zarrinData.hashtag:zarrinData[key][locale] || ""} onChange={e=>updateZarrinField(key,e.target.value)}/></Field>)}
                </div>}
                {invitation.templateId === "gulbog" && <div className={styles.formGrid}>
                  {(["brideFamily","reminderTitle","reminderText","footerNote"] as const).map(key=><Field key={key} label={`${({brideFamily:"Kelin oilasi satri",reminderTitle:"Eslatma sarlavhasi",reminderText:"Mehmonlarga eslatma",footerNote:"Yakuniy izoh"})[key]} · ${LANGUAGE_NAMES[locale]}`}><textarea maxLength={key==="reminderTitle"?300:4000} rows={3} disabled={identityLocked && key==="brideFamily"} value={gulbogData[key][locale] || ""} onChange={e=>updateGulbogField(key,e.target.value)}/></Field>)}
                </div>}
                {invitation.templateId === "fayzli-xonadon" && <div className={styles.formGrid}>
                  {xonadonData.menu.map((item,index)=><div key={item.id}>
                    {(["label","name","description"] as const).map(key=><Field key={key} label={`${({label:"Taom turi",name:"Taom",description:"Izoh"})[key]} · ${LANGUAGE_NAMES[locale]}`}><textarea maxLength={key==="description"?4000:300} rows={2} value={item[key][locale] || ""} onChange={e=>updateXonadonMenu(xonadonData.menu.map((s,i)=>i===index?{...s,[key]:{...s[key],[locale]:e.target.value}}:s))}/></Field>)}
                    <button type="button" onClick={()=>updateXonadonMenu(xonadonData.menu.filter(s=>s.id!==item.id))}>O‘chirish</button>
                  </div>)}
                  {xonadonData.menu.length<12 && <button type="button" onClick={()=>updateXonadonMenu([...xonadonData.menu,{id:crypto.randomUUID(),label:{},name:{},description:{}}])}>Taom qo‘shish</button>}
                </div>}
                {invitation.templateId === "umr-bahori" && <div className={styles.formGrid}>
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
                {invitation.templateId === "muhrli-maktub" && (
                  <Field
                    label={`Gullar o‘rniga izoh · ${LANGUAGE_NAMES[locale]}`}
                    hint="Mehmonlarga ko‘rinadi. Bo‘sh qoldirsangiz, dizaynning boshlang‘ich matni ishlatiladi."
                  >
                    <textarea
                      value={muhrliMaktubData.flowersNote?.[locale] ?? ""}
                      maxLength={1000}
                      rows={3}
                      placeholder="Masalan, gullar o‘rniga samimiy tilaklaringizni qoldiring."
                      onChange={(event) =>
                        updateMuhrliMaktubFlowersNote(event.target.value)
                      }
                    />
                  </Field>
                )}
                {(capabilities.rsvp !== "none") && (<OptionalSection
                  title="Mehmonlar javobi"
                  icon={UserCheck}
                  summary={invitation.rsvp.enabled ? "Yoqilgan" : "O‘chirilgan"}
                  target="rsvp"
                  enabled={invitation.rsvp.enabled}
                  onEnabledChange={(enabled) => update({ rsvp: { ...invitation.rsvp, enabled } })}
                  onLeave={() => {
                    const missingDeadline =
                      capabilities.rsvp === "deadline" && !invitation.rsvp.deadline.trim();
                    const missingPhoneResponse =
                      capabilities.rsvp === "phone" &&
                      (!invitation.contacts.phoneNumber.trim() || !invitation.optionalFeatures.contacts);
                    if (invitation.rsvp.enabled && (missingDeadline || missingPhoneResponse)) {
                      update({ rsvp: { ...invitation.rsvp, enabled: false } });
                      return true;
                    }
                    return false;
                  }}
                >
                  {capabilities.rsvp === "phone" && (
                    <p className={styles.help}>
                      Javoblar telefon orqali qabul qilinadi. Bog‘lanish bo‘limida telefon raqamini kiriting va yoqing.
                    </p>
                  )}
                  {invitation.rsvp.enabled && (capabilities.rsvpDeadline || capabilities.rsvp === "deadline") && (
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

                    </div>
                  )}
                </OptionalSection>)}
                <div className={styles.divider} />
                {(capabilities.wishes) && (<OptionalSection
                  title="Mehmonlar tilaklari"
                  icon={MessageSquare}
                  summary={
                    invitation.wishes.enabled ? "Yoqilgan" : "O‘chirilgan"
                  }
                  target="rsvp"
                  enabled={invitation.wishes.enabled}
                  onEnabledChange={(enabled) => update({ wishes: { ...invitation.wishes, enabled } })}
                >
                  <p className={styles.help}>Tilaklar faqat siz tasdiqlaganingizdan keyin ko‘rinadi.</p>
                </OptionalSection>)}
                <div className={styles.divider} />
                {(capabilities.phone || capabilities.telegram) && (<OptionalSection
                  title="Bog‘lanish"
                  icon={Phone}
                  summary={
                    [
                      invitation.contacts.phoneNumber,
                      invitation.contacts.telegramUsername,
                    ].filter(Boolean).length
                      ? "Kiritilgan"
                      : "Ixtiyoriy"
                  }
                  target="contacts"
                  enabled={invitation.optionalFeatures.contacts}
                  onEnabledChange={(contacts) => update({ optionalFeatures: { ...invitation.optionalFeatures, contacts } })}
                  onLeave={() => {
                    const hasContact = [
                      invitation.contacts.phoneNumber,
                      invitation.contacts.telegramUsername,
                      invitation.contacts.instagramUrl,
                    ].some((value) => value.trim());
                    if (invitation.optionalFeatures.contacts && !hasContact) {
                      update({ optionalFeatures: { ...invitation.optionalFeatures, contacts: false } });
                      return true;
                    }
                    return false;
                  }}
                >
                  <div className={styles.groupHeader}>
                    <h2>Bog‘lanish</h2>
                  </div>
                  {capabilities.contactLimit === 1 && capabilities.phone && capabilities.telegram && <Field label="Aloqa usuli" hint="Bu dizaynda bitta aloqa ko‘rsatiladi.">
                    <SoftSelect label="Aloqa usuli" value={singleContactType}
                      options={[{ value: "phone", label: "Telefon" }, { value: "telegram", label: "Telegram" }]}
                      onChange={value => {
                        setSingleContactType(value);
                        update({ contacts: { ...invitation.contacts,
                          phoneNumber: value === "phone" ? invitation.contacts.phoneNumber : "",
                          telegramUsername: value === "telegram" ? invitation.contacts.telegramUsername : "",
                        } });
                      }} />
                  </Field>}
                  <div className={styles.twoColumns}>
                    {capabilities.phone && (capabilities.contactLimit !== 1 || singleContactType === "phone") && (<Field label="Telefon raqami">
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
                    </Field>)}
                    {capabilities.telegram && (capabilities.contactLimit !== 1 || singleContactType === "telegram") && (<Field label="Telegram nomi">
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
                    </Field>)}
                  </div>{" "}
                </OptionalSection>)}
              </div>
            )}
            {section === sections.length - 1 &&
              invitation.status === "draft" && !invitation.imageExportedAt && (
                <section className={styles.publishPanel}>
                  <div>
                    <h2>
                      <CheckCircle2 size={22} aria-hidden="true" />
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
                          startsAtIssue?.message ??
                            (readiness.some((issue) => issue.path === "startsAt")
                              ? "Kiritilmagan"
                            : new Intl.DateTimeFormat("uz-UZ", {
                                dateStyle: "long",
                                timeStyle: "short",
                                timeZone: "UTC",
                              }).format(new Date(`${invitation.startsAt}Z`))),
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
                      {!isImage && <div>
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
                      </div>}
                      <div>
                        <dt>
                          {paymentOrder?.invitationId === invitation.id && paymentOrder.url
                            ? "Nashr holati"
                            : isImage
                              ? "Rasm formati"
                              : "Nashr narxi"}
                        </dt>
                        <dd>
                          {paymentOrder?.invitationId === invitation.id && paymentOrder.url
                            ? "Nashr qilingan"
                            : isImage
                              ? "PNG · 1500 × 2100"
                              : paidInvitationId === invitation.id
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
                      <ReadinessChecklist issues={readiness} onSelect={goToIssue} />
                    )}
                    {isImage ? <ul className={styles.publicationTerms}>
                      <li>5:7 rasm suv belgisiz PNG sifatida yuklab olinadi.</li>
                      <li>Birinchi yuklab olishdan keyin ismlar, matnlar, tadbir turi va dizayn qulflanadi.</li>
                      <li>Faqat manzil va sana/vaqt tahrirlanadi; sana tasdiqlangan kundan kech bo‘la olmaydi. Tahrirlash muddati o‘zgarmaydi.</li>
                    </ul> : <ul className={styles.publicationTerms}>
                      {paymentOrder?.invitationId === invitation.id && paymentOrder.url ? (
                        <li>To‘lov qabul qilindi va taklifnoma nashr qilindi.</li>
                      ) : paidInvitationId === invitation.id ? (
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
                        Nashrdan so‘ng ismlar, mezbon, tadbir turi va dizayn himoyalanadi. Sana ko‘chishi uchun so‘rov yuboring; shu kundagi vaqt tahrirlanadi.
                      </li>
                      <li>
                        Matn, manzil va boshqa tafsilotlarni tadbir kuni
                        tugaguncha tahrirlashingiz mumkin.
                      </li>
                    </ul>}
                  </div>
                  {paymentOrder?.invitationId === invitation.id && (
                    <div
                      className={styles.paymentStatusPanel}
                      data-success={paymentOrder.status === "SUCCEEDED"}
                      aria-live="polite"
                    >
                      <div className={styles.paymentStatusTop}>
                        <div>
                          <span>To‘lov holati</span>
                          <strong>{paymentStateLabels[paymentOrder.status]}</strong>
                        </div>
                        <b>{formatPrice(paymentOrder.amountMinor)}</b>
                      </div>
                      {paymentOrder.status === "SUCCEEDED" ? (
                        <p>
                          {paymentOrder.url
                            ? "To‘lov qabul qilindi va taklifnomangiz nashr qilindi."
                            : "To‘lov tasdiqlandi. Nashr hali yakunlanmagan; pastdagi tugma orqali davom eting."}
                        </p>
                      ) : ["CREATED", "PENDING", "PROCESSING", "REJECTED"].includes(paymentOrder.status) ? (
                        <>
                          <p>Click’da to‘lovni yakunlang. Holat avtomatik tekshiriladi.</p>
                          <div className={styles.paymentActions}>
                            {paymentOrder.checkoutUrl && (
                              <button
                                type="button"
                                className={styles.openPaymentButton}
                                onClick={() => {
                                  try {
                                    openCheckout(paymentOrder.checkoutUrl!);
                                    setPaymentLinkNotice("Click ochildi.");
                                  } catch {
                                    setPaymentLinkNotice(
                                      "Click ochilmadi. Havolani nusxalab Chrome’da oching.",
                                    );
                                  }
                                }}
                              >
                                Click’da to‘lash
                              </button>
                            )}
                            <button
                              type="button"
                              className={styles.paymentCheckButton}
                              disabled={checkingPayment}
                              onClick={() => void refreshPayment(paymentOrder.id)}
                            >
                              {checkingPayment ? "Tekshirilmoqda…" : "Holatni tekshirish"}
                            </button>
                          </div>
                          <small>To‘lagan bo‘lsangiz, qayta to‘lamang.</small>
                          {paymentOrder.checkoutUrl && (
                            <details className={styles.paymentHelp}>
                              <summary>Click ochilmayaptimi?</summary>
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    await navigator.clipboard.writeText(paymentOrder.checkoutUrl!);
                                    setManualPaymentLink(false);
                                    setPaymentLinkNotice("To‘lov havolasi nusxalandi.");
                                  } catch {
                                    setManualPaymentLink(true);
                                    setPaymentLinkNotice("Havolani quyidagi maydondan nusxalang.");
                                  }
                                }}
                              >
                                Havolani nusxalash
                              </button>
                              {manualPaymentLink && (
                                <input
                                  aria-label="To‘lov havolasi"
                                  readOnly
                                  value={paymentOrder.checkoutUrl}
                                  onFocus={(event) => event.currentTarget.select()}
                                />
                              )}
                              <p>Telegram yoki brauzer menyusidan “Brauzerda ochish”ni tanlang, yoki shu havolani Chrome’da oching.</p>
                            </details>
                          )}
                          {paymentLinkNotice && <small role="status">{paymentLinkNotice}</small>}
                        </>
                      ) : (
                        <p>Bu urinish yakunlanmadi. Pastdagi tugma orqali qayta urinib ko‘rishingiz mumkin.</p>
                      )}
                      {paymentOrder.publicationError && (
                        <p role="alert">{paymentOrder.publicationError}</p>
                      )}
                    </div>
                  )}
                  {paymentOrder?.invitationId === invitation.id && paymentOrder.url ? (
                    <Link
                      className={styles.saveButton}
                      href={paymentOrder.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Eye size={16} /> Nashr qilingan taklifnomani ochish
                    </Link>
                  ) : (
                  <button
                    type="button"
                    className={styles.saveButton}
                    onClick={() => void saveOrPublish(isImage ? "download" : "publish")}
                    disabled={
                      busy || uploading || !!auth || readiness.length > 0 ||
                      (paymentOrder?.invitationId === invitation.id &&
                        ["CREATED", "PENDING", "PROCESSING", "REJECTED"].includes(paymentOrder.status))
                    }
                  >
                    <Send size={16} />
                    {publishing
                      ? "Tayyorlanmoqda…"
                      : isImage ? "PNG yuklab olish · Bepul" : paidInvitationId === invitation.id
                        ? "Nashrni yakunlash"
                        : paymentOrder?.invitationId === invitation.id &&
                            ["CREATED", "PENDING", "PROCESSING", "REJECTED"].includes(paymentOrder.status)
                          ? "To‘lov kutilmoqda"
                          : publishingMode === "paid"
                          ? `To‘lash va nashr qilish${selectedTemplate ? ` · ${formatPrice(selectedTemplate.priceMinor)}` : ""}`
                          : "Nashr qilish"}
                  </button>
                  )}
                </section>
              )}
              </fieldset>
            </div>
            </div>
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
          <div className={styles.realPreview} ref={previewHost} key={invitation.templateId} data-format={isImage ? "image" : undefined}>
            {isImage ? <StaticImagePreview invitation={previewInvitation} locale={locale} /> : invitation.templateId === "baxt-darvozasi" ? (
              <OltinDarvozaInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={false}
                sampleWishes={false}
              />
            ) : invitation.templateId === "ming-bir-kecha" ? (
              <MingBirKechaInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={false}
                sampleWishes={false}
              />
            ) : invitation.templateId === "samarqand-peshtoqi" ? (
              <SamarqandPeshtoqInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={false}
                sampleWishes={false}
              />
            ) : invitation.templateId === "shisha-bog" ? (
              <ShishaBogInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={false}
                sampleWishes={false}
              />
            ) : invitation.templateId === "kapadokiya-tongi" ? (
              <KapadokiyaTongiInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={false}
                sampleWishes={false}
              />
            ) : invitation.templateId === "buxoro-ravogi" ? (
              <BuxoroRavoqInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={false}
                sampleWishes={false}
              />
            ) : invitation.templateId === "jannat-bogi" ? (
              <JannatBogiInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={false}
                sampleWishes={false}
              />
            ) : invitation.templateId === "tojmahal-darvozasi" ? (
              <TojmahalOltinDarvozasiInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={false}
                sampleWishes={false}
              />
            ) : invitation.templateId === "andalus-darvozasi" ? (
              <AndalusDarvozasiInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={false}
                sampleWishes={false}
              />
            ) : invitation.templateId === "zarrin-doppi" ? (
              <ZarrinDoppiInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={false}
                sampleWishes={false}
              />
            ) : invitation.templateId === "gulli-darvoza" ? (
              <GulliDarvozaInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={false}
                sampleWishes={false}
              />
            ) : invitation.templateId === "kongillar-oroli" ? (
              <WedivoPulauSehati
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                fullPreview
                catalogMusic={false}
                sampleWishes={false}
              />
            ) : invitation.templateId === "anor" ? (
              <AnorInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                fullPreview
                catalogMusic={false}
                sampleWishes={false}
              />
            ) : invitation.templateId === "baxmal-saroy" ? (
              <VelvetRoyaleInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={false}
                sampleWishes={false}
              />
            ) : invitation.templateId === "zaytun" ? (
              <OliveManorInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={false}
                sampleWishes={false}
              />
            ) : invitation.templateId === "islomiy" ? (
              <IslamicEditionInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={false}
                sampleWishes={false}
              />
            ) : invitation.templateId === "oq-qora-lavha" ? (
              <MonochromeEditorialInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={false}
              />
            ) : invitation.templateId === "xatna" ? (
              <XatnaEditionInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                catalogMusic={false}
              />
            ) : invitation.templateId === "fayzli-xonadon" ? (
              <TakliflaFayzliXonadonInvitation invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={false} silentPlayback />
            ) : invitation.templateId === "ertak" ? (
              <TakliflaErtak invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={false} silentPlayback />
            ) : invitation.templateId === "gulbog" ? (
              <TakliflaGulbog invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={false} silentPlayback />
            ) : invitation.templateId === "zarrin-gullar" ? (
              <TakliflaZarrinGullar invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={false} silentPlayback />
            ) : invitation.templateId === "toglar-bagrida" ? (
              <ToglarBagridaInvitation invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={false} silentPlayback />
            ) : invitation.templateId === "oltin-yol" ? (
              <TakliflaOltinYol invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={false} silentPlayback />
            ) : invitation.templateId === "osmon" ? (
              <TakliflaOsmonInvitation invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={false} silentPlayback />
            ) : invitation.templateId === "parilar-ertagi" ? (
              <TakliflaParilarErtagiInvitation invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={false} silentPlayback />
            ) : invitation.templateId === "qogoz-ertagi" ? (
              <TakliflaQogozErtagiInvitation invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={false} silentPlayback />
            ) : invitation.templateId === "sakura-guli" ? (
              <SakuraGuliInvitation invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={false} silentPlayback />
            ) : invitation.templateId === "sharlar" ? (
              <TakliflaSharlarInvitation invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={false} silentPlayback />
            ) : invitation.templateId === "yulduzli-tun" ? (
              <TakliflaYulduzliTun invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={false} silentPlayback />
            ) : invitation.templateId === "terrakota" ? (
              <TakliflaTerracottaInvitation invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={false} silentPlayback />
            ) : invitation.templateId === "umr-bahori" ? (
              <TakliflaYubileySahifasi invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={false} silentPlayback />
            ) : invitation.templateId === "baraka" ? (
              <TakliflaBarakali invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={false} sampleWishes={false} silentPlayback />
            ) : invitation.templateId === "zarhal-sahifa" ? (
              <TakliflaZarhalSahifaInvitation invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={false} sampleWishes={false} silentPlayback />
            ) : invitation.templateId === "tungi-saroy" ? (
              <TungiSaroyInvitation invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={false} silentPlayback />
            ) : invitation.templateId === "tovus" ? (
              <TakliflaTovus invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={false} silentPlayback />
            ) : invitation.templateId === "tort-fasl" ? (
              <TakliflaTortFasl invitation={previewInvitation} invitationId={invitation.id} locale={locale} preview fullPreview catalogMusic={false} silentPlayback />
            ) : invitation.templateId === "asalari" ? (
              <TakliflaAsalari
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                sampleWishes={false}
                silentPlayback
              />
            ) : invitation.templateId === "muhrli-maktub" ? (
              <MuhrliMaktubInvitation
                sampleWishes={false}
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                fullPreview
                catalogMusic={false}
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
                catalogMusic={false}
                sampleWishes={false}
              />
            ) : invitation.templateId &&
              isInvitateTemplate(invitation.templateId) ? (
              <InvitateInvitation
                invitation={previewInvitation}
                invitationId={invitation.id}
                locale={locale}
                preview
                fullPreview
                catalogMusic={false}
                sampleWishes={false}
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
                catalogMusic={false}
                sampleWishes={false}
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
