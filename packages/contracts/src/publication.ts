import { LANGUAGE_NAMES, type Invitation, type Locale } from "./index";

export type PublicationIssue = {
  path: string;
  message: string;
  section: number;
  locale?: Locale;
};

// Drafts may be incomplete. These requirements apply only to public content.
export function publicationIssues(invitation: Invitation): PublicationIssue[] {
  const issues: PublicationIssue[] = [];
  const add = (
    path: string,
    message: string,
    section: number,
    locale?: Locale,
  ) => issues.push({ path, message, section, ...(locale ? { locale } : {}) });
  if (!invitation.templateId) add("templateId", "Avval dizaynni tanlang.", 0);
  const start = invitation.startsAt;
  const parsed = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(
    start,
  );
  const date = new Date(`${start.length === 16 ? start + ":00" : start}Z`);
  if (
    !parsed ||
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 19) !==
      `${start.length === 16 ? start + ":00" : start}`
  )
    add("startsAt", "Tadbir sanasi va vaqtini to‘liq kiriting.", 2);
  try {
    if (!invitation.timezone) throw new Error();
    new Intl.DateTimeFormat("en", { timeZone: invitation.timezone }).format();
  } catch {
    add("timezone", "Vaqt mintaqasini to‘g‘ri tanlang.", 2);
  }
  const minimumPeople = ["wedding", "fotiha"].includes(invitation.eventType)
    ? 2
    : 1;
  for (const locale of invitation.enabledLocales) {
    const content = invitation.content[locale];
    const label = LANGUAGE_NAMES[locale];
    if (
      !content ||
      content.people.length < minimumPeople ||
      content.people.slice(0, minimumPeople).some((name) => !name.trim())
    )
      add(
        `content.${locale}.people`,
        `${label}: ${minimumPeople === 2 ? "ikkala ismni" : "ism yoki mezbon nomini"} kiriting.`,
        1,
        locale,
      );
    if (!content?.eventLabel.trim())
      add(
        `content.${locale}.eventLabel`,
        `${label}: tadbir nomini kiriting.`,
        1,
        locale,
      );
    if (!content?.message.trim())
      add(
        `content.${locale}.message`,
        `${label}: taklif matnini kiriting.`,
        1,
        locale,
      );
    if (!content?.venueName.trim())
      add(
        `content.${locale}.venueName`,
        `${label}: tadbir joyi nomini kiriting.`,
        2,
        locale,
      );
    if (
      !content?.address.trim() &&
      !invitation.venue.mapUrl &&
      (invitation.venue.latitude === null ||
        invitation.venue.longitude === null)
    )
      add(
        `content.${locale}.address`,
        `${label}: manzil yoki xarita joylashuvini kiriting.`,
        2,
        locale,
      );
  }
  if (
    invitation.gift.enabled &&
    (!invitation.gift.cardNumber.trim() || !invitation.gift.cardHolder.trim())
  )
    add(
      "gift",
      "To‘yona uchun karta raqami va egasini kiriting yoki imkoniyatni o‘chiring.",
      3,
    );
  else if (
    invitation.gift.enabled &&
    !/^\d{16}(?:\d{3})?$/.test(invitation.gift.cardNumber.replace(/[\s-]/g, ""))
  )
    add(
      "gift.cardNumber",
      "Karta raqami 16 yoki 19 ta raqamdan iborat bo‘lishi kerak.",
      3,
    );
  if (invitation.music.enabled && !invitation.music.url)
    add("music", "Musiqani tanlang yoki fon musiqasini o‘chiring.", 3);
  const phone = invitation.contacts.phoneNumber.trim();
  if (
    phone &&
    (!/^\+?[\d\s()-]+$/.test(phone) ||
      !/^\d{7,15}$/.test(phone.replace(/\D/g, "")))
  )
    add(
      "contacts.phoneNumber",
      "Telefon raqamini tekshiring, masalan: +998 90 123 45 67.",
      3,
    );
  if (
    invitation.contacts.telegramUsername.trim() &&
    !/^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(
      invitation.contacts.telegramUsername.trim(),
    )
  )
    add(
      "contacts.telegramUsername",
      "Telegram foydalanuvchi nomini @username shaklida kiriting.",
      3,
    );
  if (invitation.venue.mapUrl) {
    try {
      const url = new URL(invitation.venue.mapUrl);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    } catch {
      add(
        "venue.mapUrl",
        "Xarita havolasi https:// bilan boshlanishi kerak.",
        2,
      );
    }
  }
  if (
    (invitation.venue.latitude === null) !==
    (invitation.venue.longitude === null)
  )
    add("venue", "Xarita uchun kenglik va uzunlikni birga kiriting.", 2);
  if (invitation.rsvp.enabled && invitation.rsvp.deadline) {
    const deadline = invitation.rsvp.deadline;
    const day = new Date(`${deadline}T00:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(deadline) ||
      !Number.isFinite(day.getTime()) ||
      day.toISOString().slice(0, 10) !== deadline
    )
      add("rsvp.deadline", "Javob berish muddatini to‘g‘ri kiriting.", 3);
  }
  for (const [index, item] of invitation.program.entries()) {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(item.time))
      add(
        `program.${index}.time`,
        `${index + 1}-dastur bandining vaqtini kiriting yoki bandni olib tashlang.`,
        2,
      );
    for (const locale of invitation.enabledLocales)
      if (!invitation.content[locale]?.programTitles[item.id]?.trim())
        add(
          `content.${locale}.programTitles.${item.id}`,
          `${LANGUAGE_NAMES[locale]}: ${index + 1}-dastur bandi nomini kiriting yoki bandni olib tashlang.`,
          2,
          locale,
        );
  }
  if (
    new Set(invitation.program.map((item) => item.id)).size !==
    invitation.program.length
  )
    add(
      "program",
      "Dastur bandlari takrorlangan. Takroriy bandni olib tashlang.",
      2,
    );
  for (const [index, image] of invitation.gallery.entries()) {
    if (/^https?:\/\//i.test(image.url)) {
      try {
        const url = new URL(image.url);
        if (!url.hostname) throw new Error();
      } catch {
        add(
          `gallery.${index}.url`,
          `${index + 1}-rasmning to‘liq havolasini kiriting yoki rasmni olib tashlang.`,
          3,
        );
      }
    }
  }
  return issues;
}
