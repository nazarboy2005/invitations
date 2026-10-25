module.exports = [
(()=>{"use strict";return[
"[project]/apps/web/src/modules/catalog/catalog-music.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CATALOG_MUSIC_CREDIT",
    ()=>CATALOG_MUSIC_CREDIT,
    "CATALOG_PREVIEW_MUSIC",
    ()=>CATALOG_PREVIEW_MUSIC
]);
const CATALOG_PREVIEW_MUSIC = {
    id: "catalog-emotional-piano",
    url: "/music/catalog/emotional-piano.wav",
    filename: "Emotional piano — default preview music"
};
const CATALOG_MUSIC_CREDIT = {
    title: "Emotional Piano",
    creator: "triangelx",
    source: "https://freesound.org/people/triangelx/sounds/189175/",
    commons: "https://commons.wikimedia.org/wiki/File:Emotional_piano.wav",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/"
};
}),
"[project]/apps/web/src/templates/anor/renderer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AnorInvitation",
    ()=>AnorInvitation,
    "makeLegacyData",
    ()=>makeLegacyData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/contracts/src/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/date-format.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$template$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/anor/template.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$catalog$2d$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/modules/catalog/catalog-music.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$preview$2d$sample$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/modules/catalog/preview-sample.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$use$2d$invitation$2d$extras$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/use-invitation-extras.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
const eventLabels = {
    "uz-Latn": {
        wedding: "Nikoh to‘yi",
        birthday: "Tug‘ilgan kun",
        yubiley: "Yubiley",
        osh: "Nahorgi osh",
        iftorlik: "Iftorlik",
        "qiz-bazmi": "Qiz bazmi",
        fotiha: "Fotiha",
        "qiz-uzatish": "Qiz uzatish",
        "sunnat-toyi": "Sunnat to‘yi",
        "beshik-toyi": "Beshik to‘yi",
        bitiruv: "Bitiruv kechasi",
        korporativ: "Korporativ tadbir",
        "yangi-uy": "Yangi uy to‘yi",
        other: "Tadbir"
    },
    "uz-Cyrl": {
        wedding: "Никоҳ тўйи",
        birthday: "Туғилган кун",
        yubiley: "Юбилей",
        osh: "Наҳорги ош",
        iftorlik: "Ифторлик",
        "qiz-bazmi": "Қиз базми",
        fotiha: "Фотиҳа",
        "qiz-uzatish": "Қиз узатиш",
        "sunnat-toyi": "Суннат тўйи",
        "beshik-toyi": "Бешик тўйи",
        bitiruv: "Битирув кечаси",
        korporativ: "Корпоратив тадбир",
        "yangi-uy": "Янги уй тўйи",
        other: "Тадбир"
    },
    en: {
        wedding: "Wedding",
        birthday: "Birthday",
        yubiley: "Anniversary",
        osh: "Morning osh",
        iftorlik: "Iftar gathering",
        "qiz-bazmi": "Bride’s celebration",
        fotiha: "Engagement ceremony",
        "qiz-uzatish": "Bride send-off",
        "sunnat-toyi": "Circumcision celebration",
        "beshik-toyi": "Cradle celebration",
        bitiruv: "Graduation celebration",
        korporativ: "Corporate event",
        "yangi-uy": "Housewarming celebration",
        other: "Celebration"
    },
    ru: {
        wedding: "Свадьба",
        birthday: "День рождения",
        yubiley: "Юбилей",
        osh: "Утренний ош",
        iftorlik: "Ифтар",
        "qiz-bazmi": "Праздник невесты",
        fotiha: "Помолвка",
        "qiz-uzatish": "Проводы невесты",
        "sunnat-toyi": "Суннат-той",
        "beshik-toyi": "Праздник в честь колыбели",
        bitiruv: "Выпускной вечер",
        korporativ: "Корпоративное мероприятие",
        "yangi-uy": "Новоселье",
        other: "Праздник"
    }
};
const hostsLabels = {
    "uz-Latn": "Hurmat bilan",
    "uz-Cyrl": "Ҳурмат билан",
    en: "With love from",
    ru: "С уважением"
};
const footerLabels = {
    "uz-Latn": "Marxaba bilan yaratildi",
    "uz-Cyrl": "Marxaba билан яратилди",
    en: "Made with Marxaba",
    ru: "Создано с Marxaba"
};
function makeLegacyData(invitation, locale, guestName, sampleWishes = false) {
    const content = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getContent"])(invitation, locale);
    const people = content.people.filter(Boolean);
    const eventAt = invitation.startsAt ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["eventInstant"])(invitation.startsAt, invitation.timezone) : null;
    const wallDate = invitation.startsAt ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["eventWallDate"])(invitation.startsAt, invitation.timezone) : null;
    const date = wallDate ? {
        weekday: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(invitation.startsAt, locale, invitation.timezone, {
            weekday: "long"
        }),
        weekdayShort: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(invitation.startsAt, locale, invitation.timezone, {
            weekday: "short"
        }),
        day: wallDate.getUTCDate(),
        month: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(invitation.startsAt, locale, invitation.timezone, {
            month: "long"
        }),
        monthNumber: wallDate.getUTCMonth() + 1,
        year: wallDate.getUTCFullYear(),
        time: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(invitation.startsAt, locale, invitation.timezone, {
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23"
        }),
        long: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(invitation.startsAt, locale, invitation.timezone, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }),
        short: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(invitation.startsAt, locale, invitation.timezone, {
            day: "numeric",
            month: "long",
            year: "numeric"
        })
    } : {
        weekday: "",
        weekdayShort: "",
        day: "",
        month: "",
        monthNumber: "",
        year: "",
        time: "",
        long: "",
        short: ""
    };
    const personalGreeting = guestName ? content.personalGreeting.replaceAll("{name}", guestName) : "";
    const greeting = personalGreeting || content.greeting;
    return {
        title: content.title,
        footer: footerLabels[locale],
        groom: people[0] ?? "",
        bride: people[1] ?? "",
        hosts: content.hosts,
        hostsLabel: hostsLabels[locale],
        greeting,
        monogram: `${people[0]?.trim().charAt(0) ?? ""} & ${people[1]?.trim().charAt(0) ?? ""}`,
        eventType: content.eventLabel || eventLabels[locale][invitation.eventType],
        message: content.message,
        programHeading: content.programHeading || ({
            "uz-Latn": "To‘y dasturi",
            "uz-Cyrl": "Тўй дастури",
            en: "The evening",
            ru: "Программа вечера"
        })[locale],
        dateTime: eventAt?.toISOString() ?? "",
        date,
        venue: {
            name: content.venueName,
            address: [
                content.address,
                content.landmark
            ].filter(Boolean).join(" · "),
            lat: invitation.venue.latitude,
            lng: invitation.venue.longitude,
            mapUrl: invitation.venue.mapUrl
        },
        program: invitation.program.map((item)=>({
                id: item.id,
                time: item.time,
                title: content.programTitles[item.id] ?? ""
            })),
        story: invitation.story.map((chapter)=>({
                id: chapter.id,
                title: chapter.title[locale] ?? "",
                text: chapter.text[locale] ?? ""
            })).filter((chapter)=>chapter.title.trim() || chapter.text.trim()),
        gallery: invitation.gallery.map((item)=>({
                id: item.id,
                src: item.url,
                alt: item.alt || item.caption,
                caption: item.caption
            })),
        contacts: [
            ...invitation.contacts.phoneNumber.trim() ? [
                {
                    label: locale === "en" ? "Phone" : locale === "ru" || locale === "uz-Cyrl" ? "Телефон" : "Telefon",
                    value: invitation.contacts.phoneNumber.trim(),
                    type: "phone",
                    href: `tel:${invitation.contacts.phoneNumber.replace(/[^+\d]/g, "")}`
                }
            ] : [],
            ...invitation.contacts.telegramUsername.trim() ? [
                {
                    label: "Telegram",
                    value: invitation.contacts.telegramUsername.trim().startsWith("@") ? invitation.contacts.telegramUsername.trim() : `@${invitation.contacts.telegramUsername.trim()}`,
                    type: "telegram",
                    href: `https://t.me/${invitation.contacts.telegramUsername.trim().replace(/^@/, "")}`
                }
            ] : [],
            ...invitation.contacts.instagramUrl.trim() ? [
                {
                    label: "Instagram",
                    value: invitation.contacts.instagramUrl.trim(),
                    type: "instagram",
                    href: /^https?:\/\//i.test(invitation.contacts.instagramUrl.trim()) ? invitation.contacts.instagramUrl.trim() : `https://www.instagram.com/${encodeURIComponent(invitation.contacts.instagramUrl.trim().replace(/^@/, ""))}/`
                }
            ] : []
        ],
        rsvp: invitation.rsvp,
        wishesEnabled: invitation.wishes.enabled,
        wishes: sampleWishes ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$preview$2d$sample$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTemplatePreviewWishes"])(locale) : [],
        toyona: {
            enabled: invitation.gift.enabled,
            cardNumber: invitation.gift.cardNumber,
            cardHolder: invitation.gift.cardHolder,
            note: ""
        },
        music: {
            enabled: invitation.music.enabled,
            url: invitation.music.url
        },
        dressCode: {
            enabled: invitation.dressCode.enabled,
            style: invitation.dressCode.enabled ? invitation.dressCode.style[locale] ?? "" : "",
            text: invitation.dressCode.enabled ? invitation.dressCode.text[locale] ?? "" : "",
            note: invitation.dressCode.enabled ? invitation.dressCode.note[locale] ?? "" : "",
            colors: invitation.dressCode.enabled ? invitation.dressCode.colors.map((color)=>({
                    id: color.id,
                    name: color.name[locale] ?? "",
                    hex: color.hex
                })) : []
        },
        timezone: invitation.timezone
    };
}
function AnorInvitation({ invitation, invitationId, locale, guestName = "", guestToken = "", preview = false, fullPreview = false, catalogMusic = false, sampleWishes = false }) {
    const frame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [frameLocale, setFrameLocale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(locale);
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const mapped = makeLegacyData(invitation, frameLocale, guestName, sampleWishes);
        const hasCreatorPhotos = invitation.gallery.some((photo)=>photo.url.trim());
        if (preview && sampleWishes && !hasCreatorPhotos) {
            const sourceImages = [
                [
                    "stage.webp",
                    "Nikoh sahnasi"
                ],
                [
                    "hero-sky.webp",
                    "Osmon manzarasi"
                ],
                [
                    "hero-front.webp",
                    "Gul bezaklari"
                ],
                [
                    "hero-branches.webp",
                    "Shox va gullar"
                ],
                [
                    "finale.webp",
                    "Yakuniy gul bezagi"
                ],
                [
                    "fruit.webp",
                    "Anor bezagi"
                ]
            ];
            mapped.gallery = sourceImages.map(([file, alt], index)=>({
                    id: `anor-source-preview-${index + 1}`,
                    src: `/templates/anor/source/art/${file}`,
                    alt,
                    caption: alt
                }));
        }
        return mapped;
    }, [
        invitation,
        frameLocale,
        guestName,
        preview,
        sampleWishes
    ]);
    const sendExtras = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$use$2d$invitation$2d$extras$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useInvitationExtras"])(frame, invitation, data, frameLocale, invitationId, guestToken, preview);
    const rendererData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>catalogMusic ? {
            ...data,
            music: {
                enabled: true,
                url: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$catalog$2d$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATALOG_PREVIEW_MUSIC"].url
            }
        } : data, [
        catalogMusic,
        data
    ]);
    const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            type: "taklifnoma:initialize",
            payload: {
                data: rendererData,
                locale: frameLocale,
                enabledLocales: invitation.enabledLocales,
                invitationId,
                guestName,
                guestToken,
                preview,
                catalogMusic
            }
        }), [
        catalogMusic,
        frameLocale,
        invitation.enabledLocales,
        invitationId,
        guestName,
        guestToken,
        preview,
        rendererData
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>setFrameLocale(locale), [
        locale
    ]);
    const sendData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        frame.current?.contentWindow?.postMessage(payload, window.location.origin);
        sendExtras();
    }, [
        payload,
        sendExtras
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // On public SSR pages the iframe can load before hydration attaches onLoad.
        // Sending on mount also initializes that already-loaded frame. If it is
        // still loading, onLoad below delivers the same current authored content.
        sendData();
    }, [
        sendData
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const onMessage = (event)=>{
            if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow || event.data?.type !== "anor:language") return;
            const next = event.data.locale;
            if (invitation.enabledLocales.includes(next)) {
                setFrameLocale(next);
            }
        };
        window.addEventListener("message", onMessage);
        return ()=>window.removeEventListener("message", onMessage);
    }, [
        invitation.enabledLocales
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: fullPreview ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$template$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sourceFullPreview : preview ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$template$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sourcePreview : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$template$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sourcePublic,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
            ref: frame,
            title: `${data.title || data.eventType} invitation`,
            src: `/templates/anor/source/index.html?locale=${encodeURIComponent(frameLocale)}`,
            onLoad: sendData,
            allow: "autoplay; fullscreen",
            loading: "eager"
        }, frameLocale, false, {
            fileName: "[project]/apps/web/src/templates/anor/renderer.tsx",
            lineNumber: 476,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/templates/anor/renderer.tsx",
        lineNumber: 467,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/templates/date-format.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calendarWeekdays",
    ()=>calendarWeekdays,
    "eventDate",
    ()=>eventDate,
    "eventInstant",
    ()=>eventInstant,
    "eventWallDate",
    ()=>eventWallDate,
    "formatDate",
    ()=>formatDate,
    "intlLocale",
    ()=>intlLocale
]);
const intlLocale = {
    "uz-Latn": "uz-UZ",
    "uz-Cyrl": "uz-Cyrl-UZ",
    en: "en-GB",
    ru: "ru-RU"
};
function capitalizeWeekday(value, locale) {
    if (!value) return value;
    const [first, ...rest] = Array.from(value);
    return `${first.toLocaleUpperCase(intlLocale[locale])}${rest.join("")}`;
}
const uzbek = {
    "uz-Latn": {
        months: [
            "yanvar",
            "fevral",
            "mart",
            "aprel",
            "may",
            "iyun",
            "iyul",
            "avgust",
            "sentabr",
            "oktabr",
            "noyabr",
            "dekabr"
        ],
        weekdays: [
            "yakshanba",
            "dushanba",
            "seshanba",
            "chorshanba",
            "payshanba",
            "juma",
            "shanba"
        ],
        shortWeekdays: [
            "Ya",
            "Du",
            "Se",
            "Ch",
            "Pa",
            "Ju",
            "Sh"
        ]
    },
    "uz-Cyrl": {
        months: [
            "январ",
            "феврал",
            "март",
            "апрел",
            "май",
            "июн",
            "июл",
            "август",
            "сентябр",
            "октябр",
            "ноябр",
            "декабр"
        ],
        weekdays: [
            "якшанба",
            "душанба",
            "сешанба",
            "чоршанба",
            "пайшанба",
            "жума",
            "шанба"
        ],
        shortWeekdays: [
            "Як",
            "Ду",
            "Се",
            "Чо",
            "Па",
            "Жу",
            "Ша"
        ]
    }
};
function eventDate(value, timezone) {
    if (!value) return null;
    const zoned = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value);
    const date = new Date(zoned ? value : `${value.length === 10 ? `${value}T00:00` : value}Z`);
    if (!Number.isFinite(date.getTime())) return null;
    let zone = zoned ? timezone : "UTC";
    try {
        new Intl.DateTimeFormat("en", {
            timeZone: zone
        }).format(date);
    } catch  {
        zone = "UTC";
    }
    return {
        date,
        zone
    };
}
function eventInstant(value, timezone) {
    if (!value) return null;
    const raw = value.length === 10 ? `${value}T00:00` : value;
    if (/(?:Z|[+-]\d{2}:?\d{2})$/i.test(raw)) {
        const date = new Date(raw);
        return Number.isFinite(date.getTime()) ? date : null;
    }
    const wall = new Date(`${raw}Z`);
    if (!Number.isFinite(wall.getTime())) return null;
    try {
        const parts = new Intl.DateTimeFormat("en-GB", {
            timeZone: timezone,
            calendar: "gregory",
            numberingSystem: "latn",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hourCycle: "h23"
        }).formatToParts(wall);
        const n = (type)=>Number(parts.find((part)=>part.type === type)?.value);
        const represented = Date.UTC(n("year"), n("month") - 1, n("day"), n("hour"), n("minute"), n("second"));
        return new Date(wall.getTime() - (represented - wall.getTime()));
    } catch  {
        return wall;
    }
}
function eventWallDate(value, timezone) {
    const info = eventDate(value, timezone);
    if (!info) return null;
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: info.zone,
        calendar: "gregory",
        numberingSystem: "latn",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(info.date);
    const n = (type)=>Number(parts.find((part)=>part.type === type)?.value);
    return new Date(Date.UTC(n("year"), n("month") - 1, n("day"), 12));
}
function formatDate(value, locale, timezone, options) {
    const info = eventDate(value, timezone);
    if (!info) return "";
    if (locale !== "uz-Latn" && locale !== "uz-Cyrl") {
        const formatted = new Intl.DateTimeFormat(intlLocale[locale], {
            ...options,
            timeZone: info.zone
        }).format(info.date);
        return options.weekday ? capitalizeWeekday(formatted, locale) : formatted;
    }
    // Some browsers ship incomplete Uzbek ICU data (for example "M12" as the
    // month name). Author Uzbek wording explicitly; use Intl only for numeric
    // Gregorian parts in the already-resolved event timezone.
    const wording = uzbek[locale];
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: info.zone,
        calendar: "gregory",
        numberingSystem: "latn",
        day: "numeric",
        month: "numeric",
        year: "numeric"
    }).formatToParts(info.date);
    const number = (type)=>Number(parts.find((part)=>part.type === type)?.value);
    const year = number("year"), month = number("month"), day = number("day");
    const tokens = [];
    if (options.weekday) {
        const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
        tokens.push(capitalizeWeekday(options.weekday === "long" ? wording.weekdays[weekday] : wording.shortWeekdays[weekday], locale));
    }
    const dateTokens = [];
    if (options.day) dateTokens.push(options.day === "2-digit" ? String(day).padStart(2, "0") : String(day));
    if (options.month) {
        const monthName = wording.months[month - 1];
        dateTokens.push(options.month === "2-digit" ? String(month).padStart(2, "0") : options.month === "numeric" ? String(month) : options.month === "short" ? monthName.slice(0, 3) : options.month === "narrow" ? monthName[0] : monthName);
    }
    if (options.year) dateTokens.push(options.year === "2-digit" ? String(year).slice(-2) : String(year));
    if (dateTokens.length) tokens.push(dateTokens.join(options.month === "numeric" || options.month === "2-digit" ? "." : " "));
    if (options.hour || options.minute) tokens.push(new Intl.DateTimeFormat("en-GB", {
        hour: options.hour,
        minute: options.minute,
        hour12: options.hour12 ?? false,
        timeZone: info.zone
    }).format(info.date));
    return tokens.join(", ");
}
function calendarWeekdays(locale) {
    if (locale === "uz-Latn" || locale === "uz-Cyrl") return [
        ...uzbek[locale].shortWeekdays.slice(1),
        uzbek[locale].shortWeekdays[0]
    ];
    return Array.from({
        length: 7
    }, (_, index)=>new Intl.DateTimeFormat(intlLocale[locale], {
            weekday: "short",
            timeZone: "UTC"
        }).format(new Date(Date.UTC(2026, 0, 5 + index))));
}
}),
"[project]/apps/web/src/templates/onlinetaklifnoma/andalus-darvozasi/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AndalusDarvozasiInvitation",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$onlinetaklifnoma$2f$andalus$2d$darvozasi$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AndalusDarvozasiInvitation"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$onlinetaklifnoma$2f$andalus$2d$darvozasi$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/templates/onlinetaklifnoma/andalus-darvozasi/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$onlinetaklifnoma$2f$andalus$2d$darvozasi$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/onlinetaklifnoma/andalus-darvozasi/renderer.tsx [app-ssr] (ecmascript)");
}),
"[project]/apps/web/src/templates/onlinetaklifnoma/andalus-darvozasi/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$onlinetaklifnoma$2f$andalus$2d$darvozasi$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/onlinetaklifnoma/andalus-darvozasi/renderer.tsx [app-ssr] (ecmascript)");
;
}),
"[project]/apps/web/src/templates/onlinetaklifnoma/andalus-darvozasi/renderer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AndalusDarvozasiInvitation",
    ()=>AndalusDarvozasiInvitation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/anor/renderer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$catalog$2d$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/modules/catalog/catalog-music.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$onlinetaklifnoma$2f$andalus$2d$darvozasi$2f$renderer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/onlinetaklifnoma/andalus-darvozasi/renderer.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
;
function AndalusDarvozasiInvitation({ invitation, invitationId, locale, guestName = "", guestToken = "", preview = false, fullPreview = false, catalogMusic = false, sampleWishes = false, silentPlayback = false }) {
    const frame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [frameLocale, setFrameLocale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(locale);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>setFrameLocale(locale), [
        locale
    ]);
    const message = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const source = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLegacyData"])(invitation, frameLocale, guestName, sampleWishes);
        const musicUrl = preview && catalogMusic ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$catalog$2d$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATALOG_PREVIEW_MUSIC"].url : source.music.enabled ? source.music.url : "";
        return {
            ...source,
            locale: frameLocale,
            languages: invitation.enabledLocales,
            guestName,
            guestToken,
            music: {
                ...source.music,
                url: musicUrl
            },
            preview,
            slug: preview ? "" : invitation.slug ?? "",
            apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`,
            rsvp: invitation.rsvp,
            wishesEnabled: invitation.wishes.enabled
        };
    }, [
        catalogMusic,
        frameLocale,
        guestName,
        guestToken,
        invitation,
        invitationId,
        preview,
        sampleWishes
    ]);
    const latest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(message);
    latest.current = message;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const onMessage = (event)=>{
            if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow || event.data?.type !== "andalus-darvozasi:language") return;
            const next = invitation.enabledLocales.find((enabled)=>enabled === event.data.locale);
            if (next) setFrameLocale(next);
        };
        window.addEventListener("message", onMessage);
        return ()=>window.removeEventListener("message", onMessage);
    }, [
        invitation.enabledLocales
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        frame.current?.contentWindow?.postMessage({
            type: "andalus-darvozasi:update",
            payload: message
        }, window.location.origin);
    }, [
        message
    ]);
    const frameUrl = `/templates/onlinetaklifnoma-andalus-darvozasi/index.html${preview && silentPlayback ? "?qaSilent=1" : ""}`;
    const mode = fullPreview ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$onlinetaklifnoma$2f$andalus$2d$darvozasi$2f$renderer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].full : preview ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$onlinetaklifnoma$2f$andalus$2d$darvozasi$2f$renderer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].preview : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$onlinetaklifnoma$2f$andalus$2d$darvozasi$2f$renderer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].public;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: mode,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
            ref: frame,
            title: `${message.groom} & ${message.bride} invitation`,
            src: frameUrl,
            onLoad: ()=>{
                const target = frame.current?.contentWindow;
                if (!target) return;
                target.name = JSON.stringify(latest.current);
                target.postMessage({
                    type: "andalus-darvozasi:update",
                    payload: latest.current
                }, window.location.origin);
            },
            allow: "autoplay; fullscreen; clipboard-write",
            loading: "eager"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/templates/onlinetaklifnoma/andalus-darvozasi/renderer.tsx",
            lineNumber: 79,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/templates/onlinetaklifnoma/andalus-darvozasi/renderer.tsx",
        lineNumber: 78,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/templates/use-invitation-extras.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useInvitationExtras",
    ()=>useInvitationExtras
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
function useInvitationExtras(frame, invitation, data, locale, invitationId, guestToken, preview, enabled = true, sectionPolicy = {}) {
    const serialized = JSON.stringify({
        data,
        locale,
        invitationId,
        guestToken,
        preview,
        receiptUploadEnabled: invitation.gift.enabled && invitation.gift.receiptUploadEnabled,
        extraPeople: (invitation.content[locale]?.people ?? []).slice(2).filter((name)=>name.trim()),
        sectionPolicy
    });
    const send = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!enabled) return;
        const target = frame.current?.contentWindow;
        const document = frame.current?.contentDocument;
        if (!target || !document?.body) return;
        const payload = JSON.parse(serialized);
        target.__taklifnomaExtras = payload;
        if (!document.querySelector("script[data-editor-sections]")) {
            const script = document.createElement("script");
            script.dataset.editorSections = "";
            script.src = "/templates/shared/editor-sections.js";
            document.body.append(script);
        }
        target.postMessage({
            type: "taklifnoma:editor-sections",
            payload
        }, window.location.origin);
    }, [
        enabled,
        frame,
        serialized
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(send, [
        send
    ]);
    return send;
}
}),
]})(),
"[project]/apps/web/src/templates/anor/template.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "sourceFullPreview": "template-module__2IWp4W__sourceFullPreview",
  "sourcePreview": "template-module__2IWp4W__sourcePreview",
  "sourcePublic": "template-module__2IWp4W__sourcePublic",
});
}),
"[project]/apps/web/src/templates/onlinetaklifnoma/andalus-darvozasi/index.ts [app-ssr] (ecmascript, next/dynamic entry)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/web/src/templates/onlinetaklifnoma/andalus-darvozasi/index.ts [app-ssr] (ecmascript)"));
}),
"[project]/apps/web/src/templates/onlinetaklifnoma/andalus-darvozasi/renderer.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "full": "renderer-module__hkuTWW__full",
  "preview": "renderer-module__hkuTWW__preview",
  "public": "renderer-module__hkuTWW__public",
});
}),
];

//# sourceMappingURL=apps_web_src_0mm4xf-uwappb._.js.map