import type { Invitation, Locale } from "@taklifnoma/contracts";
import { getContent } from "@taklifnoma/contracts";
import { makeLegacyData } from "@/templates/anor/renderer";
import { eventInstant, formatDate } from "../date-format";

const ui: Record<Locale, Record<string, string>> = {
  "uz-Latn": {
    and: "va",
    program: "To‘y dasturi",
    location: "Manzil",
    dress: "Kiyim uslubi",
    details: "Tafsilotlar",
    photos: "Suratlar",
    rsvp: "Javobingiz",
    countdown: "To‘yimizga qoldi",
    name: "Ism-familiyangiz",
    attendance: "Kela olasizmi?",
    yes: "Ha, mamnuniyat bilan kelaman",
    no: "Afsuski, kela olmayman",
    maybe: "Keyinroq xabar beraman",
    song: "Sevimli qo‘shig‘ingiz",
    send: "Javob yuborish",
    map: "Xaritani ko‘rish",
    days: "kun",
    hours: "soat",
    minutes: "daqiqa",
    seconds: "soniya",
  },
  "uz-Cyrl": {
    and: "ва",
    program: "Тўй дастури",
    location: "Манзил",
    dress: "Кийиниш услуби",
    details: "Тафсилотлар",
    photos: "Суратлар",
    rsvp: "Жавобингиз",
    countdown: "Тўйимизга қолди",
    name: "Исм-фамилиянгиз",
    attendance: "Кела оласизми?",
    yes: "Ҳа, мамнуният билан келаман",
    no: "Афсуски, кела олмайман",
    maybe: "Кейинроқ хабар бераман",
    song: "Севимли қўшиғингиз",
    send: "Жавоб юбориш",
    map: "Харитани кўриш",
    days: "кун",
    hours: "соат",
    minutes: "дақиқа",
    seconds: "сония",
  },
  en: {
    and: "and",
    program: "The day’s program",
    location: "Location",
    dress: "Dress code",
    details: "Details",
    photos: "Photos",
    rsvp: "Your response",
    countdown: "Until our celebration",
    name: "Your full name",
    attendance: "Will you attend?",
    yes: "Yes, with pleasure",
    no: "Sorry, I cannot attend",
    maybe: "I will let you know",
    song: "Song request",
    send: "Send response",
    map: "Open map",
    days: "days",
    hours: "hours",
    minutes: "minutes",
    seconds: "seconds",
  },
  ru: {
    and: "и",
    program: "Программа дня",
    location: "Место проведения",
    dress: "Дресс-код",
    details: "Подробности",
    photos: "Фотографии",
    rsvp: "Ваш ответ",
    countdown: "До нашей свадьбы",
    name: "Ваше имя и фамилия",
    attendance: "Сможете прийти?",
    yes: "Да, с удовольствием",
    no: "К сожалению, не смогу",
    maybe: "Сообщу позднее",
    song: "Любимая песня",
    send: "Отправить ответ",
    map: "Открыть карту",
    days: "дней",
    hours: "часов",
    minutes: "минут",
    seconds: "секунд",
  },
};

export function makeVelvetData(
  invitation: Invitation,
  locale: Locale,
  guestName: string,
  guestToken: string,
  invitationId: string,
  preview: boolean,
  catalogMusic = false,
  silentPlayback = false,
) {
  const data = makeLegacyData(invitation, locale, guestName);
  const content = getContent(invitation, locale);
  const text = ui[locale];
  const date = invitation.startsAt
    ? eventInstant(invitation.startsAt, invitation.timezone)
    : null;
  return {
    ...data,
    ui: text,
    locale,
    people: content.people,
    greeting: guestName
      ? content.personalGreeting.replaceAll("{name}", guestName) ||
        content.greeting
      : content.greeting,
    message: content.message,
    dateTime: date && !Number.isNaN(date.getTime()) ? date.toISOString() : "",
    dateLabel: date
      ? formatDate(invitation.startsAt, locale, invitation.timezone, {
          month: "long",
          year: "numeric",
        })
      : "",
    eventDateLabel: date
      ? formatDate(invitation.startsAt, locale, invitation.timezone, {
          dateStyle: "long",
        })
      : "",
    eventDay: date
      ? Number(
          formatDate(invitation.startsAt, "en", invitation.timezone, {
            day: "numeric",
          }),
        )
      : 0,
    eventMonth: date
      ? Number(
          formatDate(invitation.startsAt, "en", invitation.timezone, {
            month: "numeric",
          }),
        ) - 1
      : 0,
    eventYear: date
      ? Number(
          formatDate(invitation.startsAt, "en", invitation.timezone, {
            year: "numeric",
          }),
        )
      : 0,
    venueName: content.venueName,
    venueAddress: [content.address, content.landmark]
      .filter(Boolean)
      .join(" · "),
    mapUrl: invitation.venue.mapUrl,
    programHeading: content.programHeading || text.program,
    program: invitation.program.map((item) => ({
      id: item.id,
      time: item.time,
      title: content.programTitles[item.id] ?? "",
    })),
    dressCode: invitation.dressCode.enabled
      ? invitation.dressCode.text[locale]
      : "",
    giftNote: invitation.gift.enabled
      ? [invitation.gift.cardNumber, invitation.gift.cardHolder]
          .filter(Boolean)
          .join(" · ")
      : "",
    photoLink: invitation.contacts.telegramUsername.trim()
      ? `https://t.me/${invitation.contacts.telegramUsername.trim().replace(/^@/, "")}`
      : "",
    rsvpEnabled: invitation.rsvp.enabled,
    wishesEnabled: invitation.wishes.enabled,
    guestName,
    guestToken,
    apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`,
    preview,
    music: invitation.music.enabled
      ? invitation.music.url
      : preview && catalogMusic
        ? "/music/catalog/emotional-piano.wav"
        : "",
    silentPlayback: preview && silentPlayback,
    startsAt: date?.toISOString() ?? "",
    enabledLocales: invitation.enabledLocales,
  };
}
