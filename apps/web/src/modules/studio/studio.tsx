"use client";

import { isValidElement, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Eye,
  Flower2,
  Globe2,
  Heart,
  ImagePlus,
  LayoutTemplate,
  LoaderCircle,
  MapPin,
  Music2,
  Plus,
  Search,
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
import { SoftSelect } from "@/components/soft-select";
import { DateTimePicker, TimePicker } from "@/components/date-time-picker";
import { readBrowserDraft, saveBrowserDraft } from "./draft-storage";
import { AnorInvitation } from "@/templates/anor";
import { isMarxabaTemplate, MarxabaInvitation } from "@/templates/marxaba";
import { isInvitateTemplate, InvitateInvitation } from "@/templates/invitate";
import {
  createTemplatePreviewSample,
  hasAuthoredInvitationContent,
} from "@/modules/catalog/preview-sample";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import { matchesTemplateSearch } from "@/modules/catalog/template-search";
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
    description:
      "Kuningizga mos birinchi taassurot. Tadbir turini va ko‘nglingizga yaqin dizaynni tanlang.",
  },
  {
    icon: Users,
    title: "Asosiy ma’lumotlar",
    short: "Ma’lumotlar",
    note: "Ismlar va taklif matni",
    description:
      "Eng chiroyli taklif o‘z so‘zlaringizdan boshlanadi. Bu sahifaga o‘z hikoyangizni qo‘shing.",
  },
  {
    icon: MapPin,
    title: "Dastur va manzil",
    short: "Manzil",
    note: "Qachon va qayerda",
    description:
      "Mehmonlaringiz barcha kerakli ma’lumotni bir joyda topsin. Sana, manzil va dasturini belgilang.",
  },
  {
    icon: Settings2,
    title: "Qo‘shimcha",
    short: "Qo‘shimcha",
    note: "Qo‘shimcha imkoniyatlar",
    description:
      "Kichik detallar, katta taassurot. Faqat o‘zingizga kerakli imkoniyatlarni yoqing.",
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
}: {
  initialInvitation?: Invitation;
}) {
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
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [templateSearch, setTemplateSearch] = useState("");
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
      fetch("/api/music", { signal: controller.signal })
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
      fetch("/api/uploads", { signal: controller.signal })
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
        const query = new URLSearchParams(window.location.search);
        const requestedTemplate = templateIdSchema.safeParse(
          query.get("useTemplate") ?? query.get("template"),
        );
        const stored = fresh
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
    if (!invitation) return;
    const timer = window.setTimeout(() => {
      try {
        saveBrowserDraft(
          invitation,
          JSON.stringify(invitation) !== lastCloudSnapshot.current,
          ownerId.current,
        );
      } catch {
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
          const complete = await fetch("/api/auth/telegram/complete", {
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
  const compatibleTemplates = templates.filter(
    (template) =>
      template.published &&
      template.supportedEventTypes.includes(invitation.eventType),
  );
  const availableCategories = categories.filter((category) =>
    compatibleTemplates.some((template) =>
      template.categoryIds.includes(category.id),
    ),
  );
  const activeCategoryFilter = availableCategories.some(
    (category) => category.id === categoryFilter,
  )
    ? categoryFilter
    : "all";
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
    const selected = templates.find(
      (item) => item.id === currentInvitation.templateId,
    );
    if (selected && !selected.supportedEventTypes.includes(eventType)) {
      update({ eventType, templateId: "", ...contentPatch });
      setNotice(
        "Avvalgi dizayn bu tadbir turini qo‘llamaydi. Shu sahifada mos dizaynni tanlang.",
      );
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
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitation: current }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        if (result.error?.code === "STALE_REVISION")
          throw new Error(
            "Taklifnoma boshqa oynada o‘zgartirilgan. Sizning o‘zgartirishlaringiz shu brauzerda saqlandi. Sahifani qayta yuklashdan oldin qoralamangizni yuklab oling va yangilangan taklifnoma bilan solishtiring.",
          );
        throw new Error(
          result.error?.message ??
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
        // Reopening/reloading now loads the authoritative account record.
        window.history.replaceState(
          window.history.state,
          "",
          `/studio/${current.id}`,
        );
      }
      if (action === "publish") {
        const saved = invitationSchema.parse(result.invitation);
        const publish = () =>
          fetch(`/api/invitations/${saved.id}/publish`, {
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
        if (!publishedResponse.ok) {
          // Another tab may already have published this same saved draft.
          const latestResponse = await fetch(`/api/invitations/${saved.id}`, {
            cache: "no-store",
          });
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
      await saveOrPublish(pendingAction.current);
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
      const response = await fetch("/api/uploads", {
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
    setMobilePreview(false);
    // Avoid opening the next step halfway down a long form.
    window.scrollTo({ top: 0, behavior: "instant" });
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
          <div>
            <span className={styles.documentTitle}>
              {content.people.filter((name) => name.trim()).join(" & ") ||
                "Yangi taklifnoma"}
            </span>
            <small>
              <span className={styles.statusDot} />
              {invitation.status === "published"
                ? "Nashr qilingan"
                : "Shaxsiy qoralama"}
            </small>
          </div>
        </div>
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
      <div className={`${styles.workspace} ${section === 0 && invitation.templateId ? styles.hasSelectionActions : ""}`}>
        <aside
          className={`${styles.sidebar} ${mobilePreview ? styles.mobileHidden : ""}`}
          aria-label="Tahrirlash bo‘limlari"
        >
          <div className={styles.sidebarIntro}>
            <Flower2 size={28} strokeWidth={1.1} aria-hidden="true" />
            <p>Yaratish studiyasi</p>
            <h2>
              Mehr bilan
              <br />
              <em>yarating.</em>
            </h2>
          </div>
          <p className={styles.sidebarTitle}>To‘rt oddiy qadam</p>
          <nav>
            {sections.map((item, index) => (
              <button
                key={item.title}
                className={`${styles.sectionButton} ${section === index ? styles.activeSection : ""}`}
                onClick={() => goToSection(index)}
                aria-current={section === index ? "step" : undefined}
              >
                <span className={styles.sectionNumber}>{index + 1}</span>
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
          <p className={styles.sidebarNote}>
            <CheckCircle2 size={15} strokeWidth={1.3} />
            <span>Qoralamangiz shu brauzerda avtomatik saqlanadi.</span>
          </p>
        </aside>
        <main
          id="main"
          className={`${styles.editor} ${mobilePreview ? styles.mobileHidden : ""}`}
        >
          <fieldset className={styles.editorFields} disabled={busy}>
            {invitation.status === "published" && invitation.slug && (
              <PublishedLink slug={invitation.slug} canonicalUrl={publicUrl} />
            )}
            {publishIssues.length > 0 && (
              <div className={styles.publicationErrors} role="alert">
                <strong>Nashr qilishdan oldin to‘ldiring</strong>
                <ul>
                  {publishIssues.map((issue) => (
                    <li key={issue.path}>
                      <button
                        type="button"
                        onClick={() => {
                          goToSection(issue.section);
                          if (issue.locale) setLocale(issue.locale);
                        }}
                      >
                        {issue.message}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className={styles.editorIntro}>
              <div className={styles.introTop}>
                <span className={styles.step}>
                  O‘z taklifnomangizni yarating
                </span>
                <span className={styles.stepCount}>
                  0{section + 1} <span>/ 04</span>
                </span>
              </div>
              <h1>{sections[section].title}</h1>
              <p>{sections[section].description}</p>
              <div className={styles.stepProgress} aria-hidden="true">
                {sections.map((item, index) => (
                  <span
                    key={item.short}
                    className={index <= section ? styles.reachedStep : ""}
                  />
                ))}
              </div>
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
              <div className={styles.languages}>
                <Globe2 size={16} />
                <div className={styles.languageTabs}>
                  {invitation.enabledLocales.map((item) => (
                    <span className={styles.languageItem} key={item}>
                      <button
                        className={locale === item ? styles.activeLanguage : ""}
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
                      {item !== invitation.defaultLocale && !identityLocked && (
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
                        setInvitation(addInvitationLanguage(invitation, next));
                        setLocale(next);
                      }}
                    />
                  </div>
                )}
              </div>
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
                      </div>
                    ))}
                  </>
                )}
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
                    placeholder={placeholders.venueName}
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
                {compatibleTemplates.length > 0 && (
                  <label className={styles.templateSearch}>
                    <Search size={16} aria-hidden="true" />
                    <input
                      type="search"
                      value={templateSearch}
                      onChange={(event) =>
                        setTemplateSearch(event.target.value)
                      }
                      placeholder="Dizayn qidirish"
                      aria-label="Dizayn qidirish"
                    />
                  </label>
                )}
                {invitation.templateId &&
                  !templates.some(
                    (item) =>
                      item.id === invitation.templateId &&
                      item.published &&
                      item.supportedEventTypes.includes(invitation.eventType),
                  ) && (
                    <div className={styles.notice}>
                      Bu dizayn tanlangan tadbir turini qo‘llamaydi. Tadbir
                      turini o‘zgartiring yoki mos dizaynni tanlang.
                    </div>
                  )}
                {compatibleTemplates.length === 0 && (
                  <div className={styles.designNotice}>
                    <CheckCircle2 size={20} />
                    <p>
                      Hozircha tayyor dizaynlar qo‘shilmagan. Ma’lumotlaringizni
                      qoralama sifatida saqlashingiz va dizaynlar paydo bo‘lgach
                      tanlashingiz mumkin.
                    </p>
                  </div>
                )}
                {compatibleTemplates.length > 0 && (
                  <div
                    className={styles.categoryFilters}
                    role="group"
                    aria-label="Dizayn kategoriyalari"
                  >
                    <button
                      aria-pressed={activeCategoryFilter === "all"}
                      className={
                        activeCategoryFilter === "all"
                          ? styles.selectedCategory
                          : ""
                      }
                      onClick={() => setCategoryFilter("all")}
                    >
                      Barchasi
                      <span>{compatibleTemplates.length}</span>
                    </button>
                    {availableCategories.map((category) => (
                      <button
                        key={category.id}
                        aria-pressed={activeCategoryFilter === category.id}
                        className={
                          activeCategoryFilter === category.id
                            ? styles.selectedCategory
                            : ""
                        }
                        onClick={() => setCategoryFilter(category.id)}
                      >
                        {category.name}
                        <span>
                          {
                            compatibleTemplates.filter((template) =>
                              template.categoryIds.includes(category.id),
                            ).length
                          }
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                <div className={styles.templateGrid}>
                  {compatibleTemplates
                    .filter(
                      (template) =>
                        (activeCategoryFilter === "all" ||
                          template.categoryIds.includes(
                            activeCategoryFilter,
                          )) &&
                        matchesTemplateSearch(
                          template,
                          categories,
                          templateSearch,
                        ),
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
                            setInvitation(
                              switchTemplate(invitation, template.id),
                            )
                          }
                        >
                          <div
                            className={styles.templateArt}
                            style={{
                              backgroundImage: `url(${template.previewImage?.startsWith("/") ? template.previewImage : `/templates/${template.id}/${template.previewImage ?? "stage.webp"}`})`,
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
                {!compatibleTemplates.some(
                  (template) =>
                    (activeCategoryFilter === "all" ||
                      template.categoryIds.includes(activeCategoryFilter)) &&
                    matchesTemplateSearch(template, categories, templateSearch),
                ) && (
                  <div className={styles.categoryEmpty}>
                    <LayoutTemplate size={24} />
                    <p>
                      {templateSearch.trim()
                        ? "Qidiruv bo‘yicha dizayn topilmadi."
                        : "Hozircha tanlash uchun dizayn yo‘q."}
                    </p>
                    <small>
                      Qoralamangiz saqlanadi va keyin dizayn tanlashingiz
                      mumkin.
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
                      Hozirgi bosqichda nashr qilish uchun to‘lov talab
                      qilinmaydi.
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
                      Kutubxonadagi tayyor musiqani tanlang yoki o‘zingiznikini
                      yuklang.
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
                    <Toggle
                      title="Chek yuborishga ruxsat"
                      description="Chek faqat sizga ko‘rinadi. AI tekshiruvi yo‘q; pul tushganini o‘zingiz tekshirasiz."
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
                  <Field label="Telegram username">
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
                </div>
              </div>
            )}
            {invitation.status === "draft" && (
              <section className={styles.publishPanel}>
                <div>
                  <span>MEHMONLARGA ULASHISH</span>
                  <h2>Tayyor bo‘ldimi?</h2>
                  <p>
                    Hozir nashr qilish bepul. Nashrdan so‘ng ismlar, mezbon,
                    tadbir turi, sana va dizayn qulflanadi. Matn, manzil va
                    boshqa tafsilotlarni tadbir kuni tugaguncha yangilashingiz
                    mumkin.
                  </p>
                </div>
                <button
                  type="button"
                  className={styles.saveButton}
                  onClick={() => void saveOrPublish("publish")}
                  disabled={busy || uploading || !!auth}
                >
                  <Send size={16} />
                  {publishing ? "Nashr qilinmoqda…" : "Nashr qilish"}
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
              ) : (
                <button
                  className={styles.saveButton}
                  onClick={cloudSave}
                  disabled={busy || uploading || !!auth}
                >
                  <Save size={16} />
                  Saqlash
                </button>
              )}
            </footer>
          </fieldset>
        </main>
        <aside
          className={`${styles.previewPanel} ${!mobilePreview ? styles.previewMobileHidden : ""}`}
          aria-label="Taklifnoma ko‘rinishi"
        >
          <div className={styles.previewHeading}>
            <div className={styles.previewTitle}>
              <span>
                <span className={styles.statusDot} /> Jonli ko‘rinish
              </span>
              <strong>
                {selectedTemplate?.name ?? "Sizning taklifnomangiz"}
              </strong>
            </div>
            <span className={styles.previewLocale}>
              {LANGUAGE_NAMES[locale]}
            </span>
            {invitation.templateId &&
              (invitation.templateId === "anor" ||
                isInvitateTemplate(invitation.templateId) ||
                isMarxabaTemplate(invitation.templateId)) && (
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
                sampleWishes={section === 0 && !authoredPreview}
              />
            ) : invitation.templateId && isInvitateTemplate(invitation.templateId) ? (
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
                sampleWishes={section === 0 && !authoredPreview}
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
            {section === 0 && !authoredPreview
              ? "Namuna ma’lumotlari faqat dizayn tanlashda ko‘rsatiladi."
              : "Siz kiritgan ma’lumotlar taklifnomada shunday ko‘rinadi."}
          </p>
        </aside>
      </div>
      {section === 0 && invitation.templateId && (
        <div className={styles.mobileSelectionActions}>
          <Link className={styles.secondaryButton} href="/dashboard">
            <ArrowLeft size={16} /> Orqaga
          </Link>
          <button
            type="button"
            className={styles.saveButton}
            onClick={() => goToSection(1)}
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
