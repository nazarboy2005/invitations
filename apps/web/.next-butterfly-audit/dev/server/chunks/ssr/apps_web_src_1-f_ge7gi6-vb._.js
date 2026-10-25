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
"[project]/apps/web/src/templates/invitate/bloom-adapter.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "makeBloomData",
    ()=>makeBloomData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/contracts/src/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/date-format.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/anor/renderer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$catalog$2d$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/modules/catalog/catalog-music.ts [app-ssr] (ecmascript)");
;
;
;
;
const localeNames = {
    "uz-Latn": "uz-Latn",
    "uz-Cyrl": "uz-Cyrl",
    en: "en",
    ru: "ru"
};
function makeBloomData(invitation, locale, guestName, guestToken, invitationId, preview, catalogMusic, silentPlayback) {
    const content = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getContent"])(invitation, locale);
    const legacy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLegacyData"])(invitation, locale, guestName);
    const instant = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["eventInstant"])(invitation.startsAt, invitation.timezone);
    return {
        ...legacy,
        locale: localeNames[locale],
        eventType: content.eventLabel,
        dateTime: instant?.toISOString() ?? "",
        date: {
            short: instant ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(invitation.startsAt, locale, invitation.timezone, {
                day: "numeric",
                month: "long",
                year: "numeric"
            }) : "",
            long: instant ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(invitation.startsAt, locale, invitation.timezone, {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }) : ""
        },
        venue: {
            name: content.venueName,
            address: content.address,
            landmark: content.landmark,
            mapUrl: invitation.venue.mapUrl,
            lat: invitation.venue.latitude,
            lng: invitation.venue.longitude
        },
        programHeading: content.programHeading,
        program: invitation.program.map((entry)=>({
                id: entry.id,
                time: entry.time,
                title: content.programTitles[entry.id] ?? ""
            })),
        dressCode: {
            enabled: invitation.dressCode.enabled,
            style: invitation.dressCode.style[locale] ?? "",
            text: invitation.dressCode.text[locale] ?? ""
        },
        gallery: preview ? [
            {
                url: "/templates/bloom/source/assets/previews/template/bloom/pink.png",
                alt: "",
                caption: ""
            }
        ] : invitation.gallery.map((photo)=>({
                url: photo.url,
                alt: photo.alt,
                caption: photo.caption
            })),
        music: invitation.music.enabled ? invitation.music.url : preview && catalogMusic ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$catalog$2d$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATALOG_PREVIEW_MUSIC"].url : "",
        rsvpEnabled: invitation.rsvp.enabled,
        guestName,
        guestToken,
        preview,
        silentPlayback: preview && silentPlayback,
        apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`
    };
}
}),
"[project]/apps/web/src/templates/invitate/golden-hour/adapter.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "makeGoldenHourData",
    ()=>makeGoldenHourData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/contracts/src/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/anor/renderer.tsx [app-ssr] (ecmascript)");
;
;
function makeGoldenHourData(invitation, locale, guestName, guestToken, invitationId, preview, catalogPreview) {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLegacyData"])(invitation, locale, guestName, catalogPreview);
    const content = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getContent"])(invitation, locale);
    const hasCreatorPhotos = invitation.gallery.some((photo)=>photo.url.trim());
    if (catalogPreview && !hasCreatorPhotos) {
        data.gallery = [
            {
                id: "golden-hour-source-preview-1",
                src: "/templates/golden-hour/assets/images/golden-hour/pink.png",
                alt: "",
                caption: ""
            },
            {
                id: "golden-hour-source-preview-2",
                src: "/templates/golden-hour/assets/images/golden-hour/flowers.png",
                alt: "",
                caption: ""
            },
            {
                id: "golden-hour-source-preview-3",
                src: "/templates/golden-hour/assets/images/golden-hour/flocake.png",
                alt: "",
                caption: ""
            },
            {
                id: "golden-hour-source-preview-4",
                src: "/templates/golden-hour/assets/images/golden-hour/location.png",
                alt: "",
                caption: ""
            },
            {
                id: "golden-hour-source-preview-5",
                src: "/templates/golden-hour/assets/images/golden-hour/footerimage.png",
                alt: "",
                caption: ""
            }
        ];
    }
    return {
        ...data,
        title: content.title,
        eventType: content.eventLabel,
        greeting: guestName ? content.personalGreeting.replaceAll("{name}", guestName) || content.greeting : content.greeting,
        message: content.message,
        hosts: content.hosts,
        dateTime: data.dateTime,
        timezone: invitation.timezone,
        programHeading: content.programHeading || data.programHeading,
        program: invitation.program.map((item)=>({
                id: item.id,
                time: item.time,
                title: content.programTitles[item.id] ?? ""
            })),
        venue: {
            ...data.venue,
            name: content.venueName,
            address: [
                content.address,
                content.landmark
            ].filter(Boolean).join(" · "),
            lat: invitation.venue.latitude,
            lng: invitation.venue.longitude,
            mapUrl: invitation.venue.mapUrl
        },
        dressCode: {
            enabled: invitation.dressCode.enabled,
            style: invitation.dressCode.style[locale] ?? "",
            text: invitation.dressCode.text[locale] ?? "",
            note: invitation.dressCode.note[locale] ?? "",
            colors: invitation.dressCode.colors.map((color)=>({
                    id: color.id,
                    hex: color.hex,
                    name: color.name[locale] ?? ""
                }))
        },
        gift: invitation.gift,
        rsvp: invitation.rsvp,
        wishesEnabled: invitation.wishes.enabled,
        locale,
        guestName,
        guestToken,
        preview,
        catalogPreview,
        apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`
    };
}
}),
"[project]/apps/web/src/templates/invitate/nahorgi-osh-adapter.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "makeNahorgiOshData",
    ()=>makeNahorgiOshData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/contracts/src/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/date-format.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/anor/renderer.tsx [app-ssr] (ecmascript)");
;
;
;
const sourceLocale = {
    "uz-Latn": "uz",
    "uz-Cyrl": "uz-Cyrl",
    en: "en",
    ru: "ru"
};
function makeNahorgiOshData(invitation, locale, guestName, guestToken, invitationId, preview, sampleWishes) {
    const source = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLegacyData"])(invitation, locale, guestName, sampleWishes);
    const content = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getContent"])(invitation, locale);
    const instant = invitation.startsAt ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["eventInstant"])(invitation.startsAt, invitation.timezone) : null;
    const wall = invitation.startsAt ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["eventWallDate"])(invitation.startsAt, invitation.timezone) : null;
    const dateText = (options)=>instant ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(invitation.startsAt, locale, invitation.timezone, options) : "";
    const wallParts = wall ? {
        year: wall.getUTCFullYear(),
        monthNumber: wall.getUTCMonth() + 1,
        day: wall.getUTCDate()
    } : {};
    const personalized = guestName ? content.personalGreeting.replaceAll("{name}", guestName) || content.greeting : content.greeting;
    return {
        ...source,
        locale: sourceLocale[locale],
        languages: invitation.enabledLocales.map((item)=>sourceLocale[item]),
        guestName,
        guestToken,
        people: content.people,
        greeting: personalized,
        message: content.message,
        hosts: content.hosts,
        eventType: content.eventLabel,
        dateTime: instant?.toISOString() ?? "",
        date: {
            ...source.date,
            ...wallParts,
            day: wallParts.day ?? "",
            time: dateText({
                hour: "2-digit",
                minute: "2-digit",
                hourCycle: "h23"
            }),
            short: dateText({
                day: "numeric",
                month: "long",
                year: "numeric"
            }),
            long: dateText({
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            })
        },
        venue: {
            ...source.venue,
            name: content.venueName,
            address: content.address,
            landmark: content.landmark,
            lat: invitation.venue.latitude,
            lng: invitation.venue.longitude,
            mapUrl: invitation.venue.mapUrl
        },
        contacts: source.contacts,
        rsvp: invitation.rsvp,
        preview,
        apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`
    };
}
}),
"[project]/apps/web/src/templates/invitate/renderer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InvitateInvitation",
    ()=>InvitateInvitation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/anor/renderer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/contracts/src/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$preview$2d$sample$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/modules/catalog/preview-sample.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/date-format.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$catalog$2d$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/modules/catalog/catalog-music.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$invitate$2f$nahorgi$2d$osh$2d$adapter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/invitate/nahorgi-osh-adapter.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$invitate$2f$renderer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/invitate/renderer.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$invitate$2f$bloom$2d$adapter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/invitate/bloom-adapter.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$invitate$2f$velvet$2d$adapter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/invitate/velvet-adapter.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$invitate$2f$wedding$2d$adapter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/invitate/wedding-adapter.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$invitate$2f$golden$2d$hour$2f$adapter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/invitate/golden-hour/adapter.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$use$2d$invitation$2d$extras$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/use-invitation-extras.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$invitate$2f$safir$2d$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/invitate/safir-renderer.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const sourceLocale = {
    "uz-Latn": "uz",
    "uz-Cyrl": "uz-Cyrl",
    en: "en",
    ru: "ru"
};
function InvitateInvitation({ invitation, invitationId, locale, guestName = "", guestToken = "", preview = false, fullPreview = false, catalogMusic = false, sampleWishes = false, silentPlayback = false, qaReducedMotion = false }) {
    const frame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [frameLocale, setFrameLocale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(locale);
    const templateId = invitation.templateId;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>setFrameLocale(locale), [
        locale
    ]);
    const message = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const source = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLegacyData"])(invitation, frameLocale, guestName, sampleWishes);
        const hasCreatorPhotos = invitation.gallery.some((photo)=>photo.url.trim());
        if (preview && sampleWishes && !hasCreatorPhotos && templateId === "evelina") {
            source.gallery = [
                {
                    id: "evelina-source-preview",
                    src: "/templates/evelina/assets/previews/template/evelina/hero.png",
                    alt: "Evelina manba fotosurati",
                    caption: "Evelina manba fotosurati"
                }
            ];
        }
        if (preview && sampleWishes && !hasCreatorPhotos && templateId === "swan") {
            source.gallery = [
                {
                    id: "swan-source-preview",
                    src: "/templates/swan/assets/images/0310/1.png",
                    alt: "Swan source preview photo",
                    caption: "Swan source preview photo"
                }
            ];
        }
        const languages = invitation.enabledLocales.map((item)=>sourceLocale[item]);
        const music = source.music.enabled ? source.music.url : preview && catalogMusic ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$catalog$2d$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATALOG_PREVIEW_MUSIC"].url : "";
        return {
            ...source,
            platformPreview: preview,
            catalogPreview: preview && sampleWishes,
            locale: sourceLocale[frameLocale],
            defaultLang: sourceLocale[frameLocale],
            languages,
            guestName,
            guestToken,
            music,
            preview,
            silentPlayback: preview && silentPlayback,
            apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`
        };
    }, [
        catalogMusic,
        frameLocale,
        guestName,
        guestToken,
        invitation,
        invitationId,
        preview,
        sampleWishes,
        silentPlayback
    ]);
    const estelleMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const source = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLegacyData"])(invitation, frameLocale, guestName, sampleWishes);
        const content = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getContent"])(invitation, frameLocale);
        const when = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["eventInstant"])(invitation.startsAt, invitation.timezone);
        const date = when ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(invitation.startsAt, frameLocale, invitation.timezone, {
            day: "numeric",
            month: "long",
            year: "numeric"
        }) : "";
        return {
            ...source,
            eventType: content.eventLabel,
            greeting: guestName ? content.personalGreeting.replaceAll("{name}", guestName) || content.greeting : content.greeting,
            dateTime: when?.toISOString() ?? "",
            timezone: invitation.timezone,
            date: {
                short: date
            },
            venue: {
                ...source.venue,
                name: content.venueName,
                address: content.address,
                landmark: content.landmark,
                lat: invitation.venue.latitude,
                lng: invitation.venue.longitude,
                mapUrl: invitation.venue.mapUrl
            },
            programHeading: content.programHeading,
            program: invitation.program.map((entry)=>({
                    id: entry.id,
                    time: entry.time,
                    title: content.programTitles[entry.id] ?? ""
                })),
            dressCode: {
                enabled: invitation.dressCode.enabled,
                style: invitation.dressCode.style[frameLocale] ?? "",
                text: invitation.dressCode.text[frameLocale] ?? "",
                note: invitation.dressCode.note[frameLocale] ?? "",
                colors: invitation.dressCode.colors.map((color)=>({
                        hex: color.hex,
                        name: color.name[frameLocale] ?? ""
                    }))
            },
            wishesEnabled: invitation.wishes.enabled,
            rsvpIntro: content.message,
            rsvp: invitation.rsvp,
            hosts: content.hosts,
            gift: invitation.gift,
            preview: preview && sampleWishes,
            locale: sourceLocale[frameLocale],
            languages: invitation.enabledLocales.map((item)=>sourceLocale[item]),
            guestName,
            guestToken,
            music: invitation.music.enabled ? invitation.music.url : preview && catalogMusic ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$catalog$2d$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATALOG_PREVIEW_MUSIC"].url : "",
            apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`,
            contacts: source.contacts,
            qaReducedMotion: preview && qaReducedMotion
        };
    }, [
        catalogMusic,
        frameLocale,
        guestName,
        guestToken,
        invitation,
        invitationId,
        preview,
        qaReducedMotion,
        sampleWishes
    ]);
    const veloraMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const source = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLegacyData"])(invitation, frameLocale, guestName, sampleWishes);
        const content = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getContent"])(invitation, frameLocale);
        const when = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["eventInstant"])(invitation.startsAt, invitation.timezone);
        return {
            ...source,
            locale: sourceLocale[frameLocale],
            languages: invitation.enabledLocales.map((item)=>sourceLocale[item]),
            eventType: content.eventLabel,
            greeting: guestName ? content.personalGreeting.replaceAll("{name}", guestName) || content.greeting : content.greeting,
            invitationText: content.message,
            welcome: content.greeting,
            dateTime: when?.toISOString() ?? "",
            timezone: invitation.timezone,
            venue: {
                ...source.venue,
                name: content.venueName,
                address: content.address,
                landmark: content.landmark,
                lat: invitation.venue.latitude,
                lng: invitation.venue.longitude,
                mapUrl: invitation.venue.mapUrl
            },
            programHeading: content.programHeading,
            program: invitation.program.map((entry)=>({
                    id: entry.id,
                    time: entry.time,
                    title: content.programTitles[entry.id] ?? ""
                })),
            dressCode: {
                enabled: invitation.dressCode.enabled,
                style: invitation.dressCode.style[frameLocale] ?? "",
                text: invitation.dressCode.text[frameLocale] ?? "",
                note: invitation.dressCode.note[frameLocale] ?? "",
                colors: invitation.dressCode.colors.map((color)=>({
                        hex: color.hex,
                        name: color.name[frameLocale] ?? ""
                    }))
            },
            rsvp: invitation.rsvp,
            music: invitation.music.enabled ? invitation.music.url : preview && catalogMusic ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$catalog$2d$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATALOG_PREVIEW_MUSIC"].url : "",
            guestName,
            guestToken,
            apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`,
            contacts: source.contacts,
            preview: preview && sampleWishes
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
    const velvetMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$invitate$2f$velvet$2d$adapter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeVelvetData"])(invitation, frameLocale, guestName, guestToken, invitationId, preview, catalogMusic, silentPlayback, qaReducedMotion), [
        catalogMusic,
        frameLocale,
        guestName,
        guestToken,
        invitation,
        invitationId,
        preview,
        qaReducedMotion,
        silentPlayback
    ]);
    const nahorgiOshMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$invitate$2f$nahorgi$2d$osh$2d$adapter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeNahorgiOshData"])(invitation, frameLocale, guestName, guestToken, invitationId, preview, sampleWishes), [
        frameLocale,
        guestName,
        guestToken,
        invitation,
        invitationId,
        preview,
        sampleWishes
    ]);
    const goldenHourMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const message = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$invitate$2f$golden$2d$hour$2f$adapter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeGoldenHourData"])(invitation, frameLocale, guestName, guestToken, invitationId, preview, preview && sampleWishes);
        if (!message.music.enabled && preview && catalogMusic) message.music = {
            enabled: true,
            url: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$catalog$2d$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATALOG_PREVIEW_MUSIC"].url
        };
        return message;
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
    const whitelessMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const source = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLegacyData"])(invitation, frameLocale, guestName, preview && sampleWishes);
        const content = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getContent"])(invitation, frameLocale);
        const when = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["eventInstant"])(invitation.startsAt, invitation.timezone);
        return {
            ...source,
            locale: sourceLocale[frameLocale],
            languages: invitation.enabledLocales.map((item)=>sourceLocale[item]),
            title: content.title,
            eventType: content.eventLabel,
            message: content.message,
            dateTime: when?.toISOString() ?? "",
            timezone: invitation.timezone,
            venue: {
                ...source.venue,
                name: content.venueName,
                address: [
                    content.address,
                    content.landmark
                ].filter(Boolean).join(", "),
                mapUrl: invitation.venue.mapUrl
            },
            rsvp: invitation.rsvp,
            rsvpEnabled: invitation.rsvp.enabled,
            wishesEnabled: invitation.wishes.enabled,
            receiptUploadEnabled: invitation.gift.enabled && invitation.gift.receiptUploadEnabled,
            gallery: invitation.gallery.filter((item)=>item.url.trim()).map((item)=>({
                    id: item.id,
                    src: item.url,
                    alt: item.alt || item.caption,
                    caption: item.caption
                })),
            music: invitation.music.enabled ? invitation.music.url : "",
            guestToken,
            preview,
            apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`
        };
    }, [
        frameLocale,
        guestName,
        guestToken,
        invitation,
        invitationId,
        preview,
        sampleWishes
    ]);
    const sendGoldenHourExtras = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$use$2d$invitation$2d$extras$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useInvitationExtras"])(frame, invitation, goldenHourMessage, frameLocale, invitationId, guestToken, preview, templateId === "golden-hour");
    const bloomMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$invitate$2f$bloom$2d$adapter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeBloomData"])(invitation, frameLocale, guestName, guestToken, invitationId, preview, catalogMusic, silentPlayback), [
        catalogMusic,
        frameLocale,
        guestName,
        guestToken,
        invitation,
        invitationId,
        preview,
        silentPlayback
    ]);
    const weddingMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$invitate$2f$wedding$2d$adapter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeWeddingData"])(invitation, frameLocale, guestName, guestToken, invitationId, preview && sampleWishes, qaReducedMotion), [
        frameLocale,
        guestName,
        guestToken,
        invitation,
        invitationId,
        preview,
        qaReducedMotion,
        sampleWishes
    ]);
    const activeMessage = templateId === "girlsparty" ? {
        ...message,
        wishes: preview && sampleWishes ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$preview$2d$sample$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTemplatePreviewWishes"])(frameLocale).map((item)=>({
                name: item.name,
                text: item.text
            })) : [],
        title: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getContent"])(invitation, frameLocale).title,
        greeting: guestName ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getContent"])(invitation, frameLocale).personalGreeting.replaceAll("{name}", guestName) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getContent"])(invitation, frameLocale).greeting : (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getContent"])(invitation, frameLocale).greeting,
        message: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getContent"])(invitation, frameLocale).message,
        dateTime: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["eventInstant"])(invitation.startsAt, invitation.timezone)?.toISOString() ?? "",
        timezone: invitation.timezone,
        preview,
        rsvp: invitation.rsvp,
        wishesEnabled: invitation.wishes.enabled
    } : templateId === "invitate-wedding" ? weddingMessage : templateId === "bloom" ? bloomMessage : templateId === "estelle" ? estelleMessage : templateId === "velora" ? veloraMessage : templateId === "velvet" ? velvetMessage : templateId === "invitate-nahorgi-osh" ? nahorgiOshMessage : templateId === "golden-hour" ? goldenHourMessage : templateId === "whiteless" ? whitelessMessage : message;
    const latest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(activeMessage);
    latest.current = activeMessage;
    const frameUrl = `/templates/${templateId}/index.html?lang=${sourceLocale[locale]}${preview && templateId === "estelle" && qaReducedMotion ? "&qaReducedMotion=1" : ""}`;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const onMessage = (event)=>{
            if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow || event.data?.type !== `${templateId}:language`) return;
            const next = invitation.enabledLocales.find((enabled)=>sourceLocale[enabled] === event.data.locale);
            if (next) setFrameLocale(next);
        };
        window.addEventListener("message", onMessage);
        return ()=>window.removeEventListener("message", onMessage);
    }, [
        invitation.enabledLocales,
        templateId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const target = frame.current?.contentWindow;
        if (!target) return;
        target.postMessage({
            type: `${templateId}:update`,
            payload: latest.current
        }, window.location.origin);
    }, [
        activeMessage,
        templateId
    ]);
    if (templateId === "safir") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$invitate$2f$safir$2d$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SafirInvitation"], {
        invitation: invitation,
        invitationId: invitationId,
        locale: locale,
        guestName: guestName,
        guestToken: guestToken,
        preview: preview,
        fullPreview: fullPreview,
        catalogMusic: catalogMusic,
        sampleWishes: sampleWishes,
        silentPlayback: silentPlayback
    }, void 0, false, {
        fileName: "[project]/apps/web/src/templates/invitate/renderer.tsx",
        lineNumber: 530,
        columnNumber: 7
    }, this);
    const classes = fullPreview ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$invitate$2f$renderer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].full : preview ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$invitate$2f$renderer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].preview : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$invitate$2f$renderer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].public;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: classes,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
            ref: frame,
            title: templateId === "golden-hour" ? `${activeMessage.title || activeMessage.eventType} invitation` : `${activeMessage.groom} & ${activeMessage.bride} invitation`,
            src: frameUrl,
            onLoad: ()=>{
                const target = frame.current?.contentWindow;
                if (!target) return;
                if (initialized.current !== templateId) {
                    target.name = JSON.stringify(latest.current);
                    target.location.replace(frameUrl);
                    initialized.current = templateId;
                } else {
                    target.postMessage({
                        type: `${templateId}:update`,
                        payload: latest.current
                    }, window.location.origin);
                }
                if (templateId === "golden-hour") sendGoldenHourExtras();
            },
            allow: "autoplay; fullscreen; clipboard-write",
            loading: "eager"
        }, templateId, false, {
            fileName: "[project]/apps/web/src/templates/invitate/renderer.tsx",
            lineNumber: 551,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/templates/invitate/renderer.tsx",
        lineNumber: 550,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/templates/invitate/safir-adapter.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "makeSafirData",
    ()=>makeSafirData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/contracts/src/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$catalog$2d$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/modules/catalog/catalog-music.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/anor/renderer.tsx [app-ssr] (ecmascript)");
;
;
;
const sourceLocale = {
    "uz-Latn": "uz",
    "uz-Cyrl": "uz-Cyrl",
    en: "en",
    ru: "ru"
};
function makeSafirData(invitation, locale, guestName, guestToken, invitationId, preview, sampleWishes, catalogMusic, silentPlayback) {
    const source = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLegacyData"])(invitation, locale, guestName, sampleWishes);
    const content = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getContent"])(invitation, locale);
    return {
        ...source,
        eventType: content.eventLabel,
        dateTime: source.dateTime,
        date: source.date,
        greeting: guestName ? content.personalGreeting.replaceAll("{name}", guestName) || content.greeting : content.greeting,
        venue: {
            ...source.venue,
            name: content.venueName,
            address: content.address,
            landmark: content.landmark,
            lat: invitation.venue.latitude,
            lng: invitation.venue.longitude,
            mapUrl: invitation.venue.mapUrl
        },
        programHeading: content.programHeading,
        program: invitation.program.map((entry)=>({
                id: entry.id,
                time: entry.time,
                title: content.programTitles[entry.id] ?? ""
            })),
        dressCode: {
            enabled: invitation.dressCode.enabled,
            style: invitation.dressCode.style[locale] ?? "",
            text: invitation.dressCode.text[locale] ?? "",
            note: invitation.dressCode.note[locale] ?? "",
            colors: invitation.dressCode.colors.map((color)=>({
                    hex: color.hex,
                    name: color.name[locale] ?? ""
                }))
        },
        rsvp: invitation.rsvp,
        wishesEnabled: invitation.wishes.enabled,
        rsvpIntro: content.message,
        locale: sourceLocale[locale],
        languages: invitation.enabledLocales.map((item)=>sourceLocale[item]),
        guestName,
        guestToken,
        music: invitation.music.enabled ? invitation.music.url : preview && catalogMusic ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$catalog$2d$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATALOG_PREVIEW_MUSIC"].url : "",
        silentPlayback: preview && silentPlayback,
        preview,
        apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`
    };
}
}),
"[project]/apps/web/src/templates/invitate/safir-renderer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SafirInvitation",
    ()=>SafirInvitation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$invitate$2f$renderer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/invitate/renderer.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$invitate$2f$safir$2d$adapter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/invitate/safir-adapter.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const sourceLocale = {
    "uz-Latn": "uz",
    "uz-Cyrl": "uz-Cyrl",
    en: "en",
    ru: "ru"
};
function SafirInvitation({ invitation, invitationId, locale, guestName = "", guestToken = "", preview = false, fullPreview = false, catalogMusic = false, sampleWishes = false, silentPlayback = false }) {
    const frame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [frameLocale, setFrameLocale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(locale);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>setFrameLocale(locale), [
        locale
    ]);
    const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$invitate$2f$safir$2d$adapter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeSafirData"])(invitation, frameLocale, guestName, guestToken, invitationId, preview, sampleWishes, catalogMusic, silentPlayback), [
        catalogMusic,
        frameLocale,
        guestName,
        guestToken,
        invitation,
        invitationId,
        preview,
        sampleWishes,
        silentPlayback
    ]);
    const latest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(payload);
    latest.current = payload;
    const frameUrl = `/templates/safir/index.html?lang=${sourceLocale[locale]}`;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const onMessage = (event)=>{
            if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow || event.data?.type !== "safir:language") return;
            const next = invitation.enabledLocales.find((enabled)=>sourceLocale[enabled] === event.data.locale);
            if (next) setFrameLocale(next);
        };
        window.addEventListener("message", onMessage);
        return ()=>window.removeEventListener("message", onMessage);
    }, [
        invitation.enabledLocales
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        frame.current?.contentWindow?.postMessage({
            type: "safir:update",
            payload: latest.current
        }, window.location.origin);
    }, [
        payload
    ]);
    const classes = fullPreview ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$invitate$2f$renderer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].full : preview ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$invitate$2f$renderer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].preview : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$invitate$2f$renderer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].public;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: classes,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
            ref: frame,
            title: `${payload.groom} & ${payload.bride} invitation`,
            src: frameUrl,
            onLoad: ()=>{
                const target = frame.current?.contentWindow;
                if (!target) return;
                if (!initialized.current) {
                    target.name = JSON.stringify(latest.current);
                    target.location.replace(frameUrl);
                    initialized.current = true;
                    return;
                }
                target.postMessage({
                    type: "safir:update",
                    payload: latest.current
                }, window.location.origin);
            },
            allow: "autoplay; fullscreen; clipboard-write",
            loading: "eager"
        }, "safir", false, {
            fileName: "[project]/apps/web/src/templates/invitate/safir-renderer.tsx",
            lineNumber: 105,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/templates/invitate/safir-renderer.tsx",
        lineNumber: 104,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/templates/invitate/velvet-adapter.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "makeVelvetData",
    ()=>makeVelvetData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/contracts/src/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/anor/renderer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/date-format.ts [app-ssr] (ecmascript)");
;
;
;
const ui = {
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
        seconds: "soniya"
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
        seconds: "сония"
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
        seconds: "seconds"
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
        seconds: "секунд"
    }
};
function makeVelvetData(invitation, locale, guestName, guestToken, invitationId, preview, catalogMusic = false, silentPlayback = false, qaReducedMotion = false) {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLegacyData"])(invitation, locale, guestName);
    const content = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getContent"])(invitation, locale);
    const text = ui[locale];
    const date = invitation.startsAt ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["eventInstant"])(invitation.startsAt, invitation.timezone) : null;
    return {
        ...data,
        ui: text,
        locale,
        people: content.people,
        greeting: guestName ? content.personalGreeting.replaceAll("{name}", guestName) || content.greeting : content.greeting,
        message: content.message,
        dateTime: date && !Number.isNaN(date.getTime()) ? date.toISOString() : "",
        dateLabel: date ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(invitation.startsAt, locale, invitation.timezone, {
            month: "long",
            year: "numeric"
        }) : "",
        eventDateLabel: date ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(invitation.startsAt, locale, invitation.timezone, {
            dateStyle: "long"
        }) : "",
        eventDay: date ? Number((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(invitation.startsAt, "en", invitation.timezone, {
            day: "numeric"
        })) : 0,
        eventMonth: date ? Number((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(invitation.startsAt, "en", invitation.timezone, {
            month: "numeric"
        })) - 1 : 0,
        eventYear: date ? Number((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(invitation.startsAt, "en", invitation.timezone, {
            year: "numeric"
        })) : 0,
        venueName: content.venueName,
        venueAddress: [
            content.address,
            content.landmark
        ].filter(Boolean).join(" · "),
        mapUrl: invitation.venue.mapUrl,
        programHeading: content.programHeading || text.program,
        program: invitation.program.map((item)=>({
                id: item.id,
                time: item.time,
                title: content.programTitles[item.id] ?? ""
            })),
        dressCode: invitation.dressCode.enabled ? invitation.dressCode.text[locale] : "",
        giftNote: invitation.gift.enabled ? [
            invitation.gift.cardNumber,
            invitation.gift.cardHolder
        ].filter(Boolean).join(" · ") : "",
        photoLink: invitation.contacts.telegramUsername.trim() ? `https://t.me/${invitation.contacts.telegramUsername.trim().replace(/^@/, "")}` : "",
        rsvpEnabled: invitation.rsvp.enabled,
        wishesEnabled: invitation.wishes.enabled,
        guestName,
        guestToken,
        apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`,
        preview,
        music: invitation.music.enabled ? invitation.music.url : preview && catalogMusic ? "/music/catalog/emotional-piano.wav" : "",
        silentPlayback: preview && silentPlayback,
        qaReducedMotion: preview && qaReducedMotion,
        startsAt: date?.toISOString() ?? "",
        enabledLocales: invitation.enabledLocales
    };
}
}),
"[project]/apps/web/src/templates/invitate/wedding-adapter.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "makeWeddingData",
    ()=>makeWeddingData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/contracts/src/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/anor/renderer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/date-format.ts [app-ssr] (ecmascript)");
;
;
;
const locale = {
    "uz-Latn": "uz",
    "uz-Cyrl": "uz-Cyrl",
    en: "en",
    ru: "ru"
};
function makeWeddingData(invitation, activeLocale, guestName, guestToken, invitationId, preview, reducedMotion = false) {
    const content = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getContent"])(invitation, activeLocale);
    const base = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLegacyData"])(invitation, activeLocale, guestName, preview);
    const gallery = invitation.gallery.filter((photo)=>photo.url.trim()).map((photo)=>({
            id: photo.id,
            src: photo.url,
            alt: photo.alt || photo.caption,
            caption: photo.caption
        }));
    if (preview && gallery.length === 0) {
        gallery.push(...Array.from({
            length: 6
        }, (_, index)=>({
                id: `wedding-preview-${index + 1}`,
                src: `/templates/invitate-wedding/assets/captured/${[
                    "7419a394e8fcdc1a.jpg",
                    "9df50deadd54b10f.jpg",
                    "508106ed635af865.jpg",
                    "9c6e060d31968064.jpg",
                    "739da402a4d1adf7.jpg",
                    "fbefe685d0037622.jpg"
                ][index]}`,
                alt: "",
                caption: ""
            })));
    }
    return {
        ...base,
        locale: locale[activeLocale],
        languages: invitation.enabledLocales.map((item)=>locale[item]),
        people: content.people,
        greeting: guestName ? content.personalGreeting.replaceAll("{name}", guestName) || content.greeting : content.greeting,
        message: content.message,
        dateTime: base.dateTime,
        venueName: content.venueName,
        venueAddress: [
            content.address,
            content.landmark
        ].filter(Boolean).join(" · "),
        mapUrl: invitation.venue.mapUrl,
        phoneNumber: invitation.contacts.phoneNumber,
        telegramUsername: invitation.contacts.telegramUsername,
        programHeading: content.programHeading || base.programHeading,
        program: invitation.program.map((item)=>({
                id: item.id,
                time: item.time,
                title: content.programTitles[item.id] ?? ""
            })),
        gallery,
        dressCode: invitation.dressCode.enabled ? {
            enabled: true,
            style: invitation.dressCode.style[activeLocale] ?? "",
            text: invitation.dressCode.text[activeLocale] ?? "",
            note: invitation.dressCode.note[activeLocale] ?? "",
            colors: invitation.dressCode.colors.map((item)=>({
                    id: item.id,
                    name: item.name[activeLocale] ?? "",
                    hex: item.hex
                }))
        } : {
            enabled: false,
            style: "",
            text: "",
            note: "",
            colors: []
        },
        rsvpEnabled: invitation.rsvp.enabled,
        rsvpDeadline: invitation.rsvp.deadline ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$date$2d$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(invitation.rsvp.deadline, activeLocale, invitation.timezone, {
            dateStyle: "long"
        }) : "",
        guestName,
        guestToken,
        apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`,
        preview,
        reducedMotion: preview && reducedMotion,
        music: invitation.music.enabled ? {
            enabled: true,
            url: invitation.music.url
        } : {
            enabled: false,
            url: ""
        }
    };
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
"[project]/apps/web/src/templates/invitate/renderer.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "full": "renderer-module__r6fhSW__full",
  "preview": "renderer-module__r6fhSW__preview",
  "public": "renderer-module__r6fhSW__public",
});
}),
"[project]/apps/web/src/templates/invitate/renderer.tsx [app-ssr] (ecmascript, next/dynamic entry)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/web/src/templates/invitate/renderer.tsx [app-ssr] (ecmascript)"));
}),
];

//# sourceMappingURL=apps_web_src_1-f_ge7gi6-vb._.js.map