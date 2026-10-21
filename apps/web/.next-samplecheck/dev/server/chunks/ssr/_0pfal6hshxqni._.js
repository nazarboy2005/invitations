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
"[project]/apps/web/src/modules/catalog/full-template-preview.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FullTemplatePreview",
    ()=>FullTemplatePreview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/contracts/src/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/templates/anor/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/anor/renderer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$marxaba$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/templates/marxaba/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$marxaba$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/marxaba/renderer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$studio$2f$draft$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/modules/studio/draft-storage.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$preview$2d$sample$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/modules/catalog/preview-sample.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$full$2d$template$2d$preview$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/apps/web/src/modules/catalog/full-template-preview.module.css [app-ssr] (css module)");
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
function previewDraftKey(id) {
    return `taklifnoma:full-preview:v1:${id}`;
}
function FullTemplatePreview({ template, draftId, demo = false, silentPlayback = false, longNames = false }) {
    const [invitation, setInvitation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [catalogPreview, setCatalogPreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let active = true;
        async function load() {
            let candidate = null;
            if (draftId) {
                try {
                    const stored = sessionStorage.getItem(previewDraftKey(draftId));
                    if (stored) {
                        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invitationSchema"].safeParse(JSON.parse(stored));
                        if (parsed.success) candidate = parsed.data;
                    }
                } catch  {
                /* Fall back to the owner's recoverable browser draft below. */ }
                if (!candidate) {
                    try {
                        const response = await fetch("/api/auth/session", {
                            cache: "no-store"
                        });
                        const session = response.ok ? await response.json() : null;
                        const ownerId = typeof session?.user?.id === "string" ? session.user.id : null;
                        candidate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$studio$2f$draft$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readBrowserDraft"])(draftId, ownerId)?.invitation ?? null;
                    } catch  {
                        candidate = null;
                    }
                }
            }
            if (!active) return;
            const candidateHasContent = candidate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$preview$2d$sample$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasAuthoredInvitationContent"])(candidate) : false;
            const resolved = candidate && (!demo || candidateHasContent) ? {
                ...candidate,
                templateId: template.id
            } : (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$preview$2d$sample$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createTemplatePreviewSample"])(template.id, candidate ?? undefined);
            setCatalogPreview(!candidateHasContent);
            setInvitation(longNames && !candidateHasContent ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$preview$2d$sample$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createLongNamePreview"])(resolved) : resolved);
        }
        void load();
        return ()=>{
            active = false;
        };
    }, [
        demo,
        draftId,
        longNames,
        template.id
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$full$2d$template$2d$preview$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].fullPreview,
        children: !invitation ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$full$2d$template$2d$preview$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].loading,
            children: "Dizayn ochilmoqda…"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/modules/catalog/full-template-preview.tsx",
            lineNumber: 90,
            columnNumber: 9
        }, this) : template.id === "anor" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnorInvitation"], {
            invitation: invitation,
            invitationId: invitation.id,
            locale: invitation.defaultLocale,
            preview: true,
            fullPreview: true,
            catalogMusic: catalogPreview,
            sampleWishes: catalogPreview
        }, void 0, false, {
            fileName: "[project]/apps/web/src/modules/catalog/full-template-preview.tsx",
            lineNumber: 92,
            columnNumber: 9
        }, this) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$marxaba$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["isMarxabaTemplate"])(template.id) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$marxaba$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MarxabaInvitation"], {
            invitation: invitation,
            invitationId: invitation.id,
            locale: invitation.defaultLocale,
            templateId: template.id,
            preview: true,
            fullPreview: true,
            catalogMusic: catalogPreview,
            silentPlayback: silentPlayback,
            sampleWishes: catalogPreview
        }, void 0, false, {
            fileName: "[project]/apps/web/src/modules/catalog/full-template-preview.tsx",
            lineNumber: 102,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$full$2d$template$2d$preview$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].unsupported,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Bu dizaynning to‘liq ko‘rinishi hali tayyorlanmagan."
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/modules/catalog/full-template-preview.tsx",
                    lineNumber: 115,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: "/#templates",
                    children: "Dizaynlarni ko‘rish"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/modules/catalog/full-template-preview.tsx",
                    lineNumber: 116,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/modules/catalog/full-template-preview.tsx",
            lineNumber: 114,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/modules/catalog/full-template-preview.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/modules/catalog/preview-sample.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createLongNamePreview",
    ()=>createLongNamePreview,
    "createTemplatePreviewSample",
    ()=>createTemplatePreviewSample,
    "getTemplatePreviewWishes",
    ()=>getTemplatePreviewWishes,
    "hasAuthoredInvitationContent",
    ()=>hasAuthoredInvitationContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/contracts/src/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$preview$2d$sample$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/modules/catalog/preview-sample.json.[json].cjs [app-ssr] (ecmascript)");
;
;
function createTemplatePreviewSample(templateId, localeSettings) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invitationSchema"].parse({
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createInvitation"])(templateId),
        defaultLocale: localeSettings?.defaultLocale ?? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$preview$2d$sample$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].defaultLocale,
        enabledLocales: localeSettings ? [
            ...localeSettings.enabledLocales
        ] : [
            ...__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$preview$2d$sample$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].enabledLocales
        ],
        eventType: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$preview$2d$sample$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].eventType,
        startsAt: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$preview$2d$sample$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].startsAt,
        timezone: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$preview$2d$sample$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].timezone,
        gift: structuredClone(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$preview$2d$sample$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].gift),
        contacts: structuredClone(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$preview$2d$sample$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].contacts),
        program: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$preview$2d$sample$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].program.map((entry)=>({
                ...entry
            })),
        gallery: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$preview$2d$sample$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].gallery.map((item)=>({
                ...item
            })),
        content: structuredClone(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$preview$2d$sample$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].content),
        dressCode: structuredClone(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$preview$2d$sample$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].dressCode),
        rsvp: {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createInvitation"])(templateId).rsvp,
            enabled: true
        },
        wishes: {
            enabled: true,
            requireApproval: true
        }
    });
}
function getTemplatePreviewWishes(locale) {
    return structuredClone(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$preview$2d$sample$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].wishes[locale]);
}
function createLongNamePreview(invitation) {
    const content = Object.fromEntries(Object.entries(invitation.content).map(([locale, localized])=>[
            locale,
            {
                ...localized,
                people: [
                    "Gulbahor-Marguba Sayyidabonu",
                    "Jahongir-Shohruhbek Mirzohid"
                ]
            }
        ]));
    return __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invitationSchema"].parse({
        ...invitation,
        content
    });
}
function hasAuthoredInvitationContent(invitation) {
    const hasText = (values)=>values.some((value)=>Boolean(value?.trim()));
    const authoredCopy = Object.values(invitation.content).some((content)=>hasText([
            content.title,
            content.hosts,
            content.greeting,
            content.personalGreeting,
            content.message,
            content.eventLabel,
            content.venueName,
            content.address,
            content.landmark,
            content.programHeading,
            ...content.people,
            ...Object.values(content.programTitles)
        ]));
    const authoredStory = invitation.story.some((chapter)=>hasText([
            ...Object.values(chapter.title),
            ...Object.values(chapter.text)
        ]));
    const dressCode = invitation.dressCode;
    const authoredDressCode = dressCode.enabled || hasText([
        ...Object.values(dressCode.style),
        ...Object.values(dressCode.text),
        ...Object.values(dressCode.note),
        ...dressCode.colors.flatMap((color)=>Object.values(color.name)),
        ...dressCode.colors.map((color)=>color.hex)
    ]);
    const authoredGift = invitation.gift.enabled || invitation.gift.receiptUploadEnabled || hasText([
        invitation.gift.cardNumber,
        invitation.gift.cardHolder
    ]);
    const authoredRsvp = invitation.rsvp.enabled !== true || Boolean(invitation.rsvp.deadline.trim()) || invitation.rsvp.maxPartySize !== 5;
    return Boolean(authoredCopy || authoredStory || authoredDressCode || authoredGift || authoredRsvp || !invitation.wishes.enabled || invitation.eventType !== "other" || invitation.startsAt || invitation.program.length || invitation.gallery.length || invitation.contacts.phoneNumber.trim() || invitation.contacts.telegramUsername.trim() || invitation.music.enabled || invitation.music.url || invitation.music.filename || invitation.music.assetId || invitation.venue.mapUrl || invitation.venue.latitude !== null || invitation.venue.longitude !== null);
}
}),
"[project]/apps/web/src/modules/catalog/template-gallery.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TemplateGallery",
    ()=>TemplateGallery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$577$2e$0_react$40$19$2e$3$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.577.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/arrow-up-right.js [app-ssr] (ecmascript) <export default as ArrowUpRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$577$2e$0_react$40$19$2e$3$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.577.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$577$2e$0_react$40$19$2e$3$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$template$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutTemplate$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.577.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/layout-template.js [app-ssr] (ecmascript) <export default as LayoutTemplate>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/contracts/src/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f$home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/apps/web/src/app/home.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
;
;
function TemplateGallery({ templates, categories }) {
    const [categoryId, setCategoryId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("all");
    const visibleTemplates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>templates.filter((template)=>categoryId === "all" || template.categoryIds.includes(categoryId)), [
        categoryId,
        templates
    ]);
    if (templates.length === 0) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f$home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].catalogEmpty,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$577$2e$0_react$40$19$2e$3$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$template$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutTemplate$3e$__["LayoutTemplate"], {
                size: 25,
                strokeWidth: 1.5
            }, void 0, false, {
                fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                lineNumber: 33,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Hozircha tanlash uchun nashr qilingan dizayn yo‘q."
            }, void 0, false, {
                fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                lineNumber: 34,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
        lineNumber: 32,
        columnNumber: 7
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            categories.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f$home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].categoryFilters,
                "aria-label": "Dizayn kategoriyalari",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        "aria-pressed": categoryId === "all",
                        className: categoryId === "all" ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f$home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].selectedFilter : "",
                        onClick: ()=>setCategoryId("all"),
                        children: [
                            "Barchasi ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: templates.length
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                                lineNumber: 51,
                                columnNumber: 22
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                        lineNumber: 45,
                        columnNumber: 11
                    }, this),
                    categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            "aria-pressed": categoryId === category.id,
                            className: categoryId === category.id ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f$home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].selectedFilter : "",
                            onClick: ()=>setCategoryId(category.id),
                            children: [
                                category.name,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: templates.filter((template)=>template.categoryIds.includes(category.id)).length
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                                    lineNumber: 64,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, category.id, true, {
                            fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                            lineNumber: 54,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                lineNumber: 41,
                columnNumber: 9
            }, this),
            visibleTemplates.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f$home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].catalogEmpty,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$577$2e$0_react$40$19$2e$3$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$template$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutTemplate$3e$__["LayoutTemplate"], {
                        size: 25,
                        strokeWidth: 1.5
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                        lineNumber: 77,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Bu kategoriyada hozircha dizayn yo‘q."
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                        lineNumber: 78,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                lineNumber: 76,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f$home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].catalogGrid,
                children: visibleTemplates.map((template)=>{
                    const previewUrl = `/preview?template=${encodeURIComponent(template.id)}`;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f$home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].templateCard,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f$home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].templateArt,
                                href: previewUrl,
                                "aria-label": `${template.name}: to‘liq ko‘rinishini ochish`,
                                style: {
                                    backgroundImage: `url(${template.previewImage?.startsWith("/") ? template.previewImage : `/templates/${template.id}/${template.previewImage ?? "stage.webp"}`})`
                                }
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                                lineNumber: 86,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f$home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].templateInfo,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: categories.filter((category)=>template.categoryIds.includes(category.id)).map((category)=>category.name).join(" · ")
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                                        lineNumber: 95,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: template.name
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                                        lineNumber: 103,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: template.description
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                                        lineNumber: 104,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Mos keladi:",
                                            " ",
                                            template.supportedEventTypes.map((id)=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EVENT_TYPE_OPTIONS"].find((eventType)=>eventType.id === id)?.name ?? id).join(", ")
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                                        lineNumber: 105,
                                        columnNumber: 19
                                    }, this),
                                    template.published ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatPrice"])(template.priceMinor)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                                        lineNumber: 117,
                                        columnNumber: 21
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f$home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].previewOnlyLabel,
                                        children: "Faqat ko‘rib chiqish uchun"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                                        lineNumber: 119,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f$home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].templateActions,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                className: "button secondary",
                                                href: previewUrl,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$577$2e$0_react$40$19$2e$3$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                                                        lineNumber: 125,
                                                        columnNumber: 23
                                                    }, this),
                                                    " Ko‘rish"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                                                lineNumber: 124,
                                                columnNumber: 21
                                            }, this),
                                            template.published && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f$home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].createAction,
                                                href: `/studio?new=1&template=${encodeURIComponent(template.id)}`,
                                                children: [
                                                    "Yaratish ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$577$2e$0_react$40$19$2e$3$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__["ArrowUpRight"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                                                        lineNumber: 132,
                                                        columnNumber: 34
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                                                lineNumber: 128,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                                        lineNumber: 123,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                                lineNumber: 94,
                                columnNumber: 17
                            }, this)
                        ]
                    }, template.id, true, {
                        fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                        lineNumber: 85,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
                lineNumber: 81,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/modules/catalog/template-gallery.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/modules/studio/draft-storage.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DRAFT_KEY",
    ()=>DRAFT_KEY,
    "listBrowserDrafts",
    ()=>listBrowserDrafts,
    "readBrowserDraft",
    ()=>readBrowserDraft,
    "saveBrowserDraft",
    ()=>saveBrowserDraft
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/contracts/src/index.ts [app-ssr] (ecmascript)");
;
const DRAFT_KEY = "taklifnoma:draft:v1";
const prefix = `${DRAFT_KEY}:`;
function decode(value) {
    if (!value) return null;
    try {
        const data = JSON.parse(value);
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invitationSchema"].safeParse(data.invitation ?? data);
        if (!parsed.success) return null;
        return {
            invitation: parsed.data,
            savedAt: typeof data.savedAt === "string" ? data.savedAt : "",
            dirty: data.dirty !== false,
            ownerId: typeof data.ownerId === "string" ? data.ownerId : null
        };
    } catch  {
        return null;
    }
}
function readBrowserDraft(id, ownerId = null) {
    const permitted = (draft)=>draft && (!draft.ownerId || draft.ownerId === ownerId) ? draft : null;
    if (id) {
        const draft = decode(localStorage.getItem(prefix + id));
        if (draft) return permitted(draft);
        const legacy = decode(localStorage.getItem(DRAFT_KEY));
        return legacy?.invitation.id === id ? permitted(legacy) : null;
    }
    const latest = localStorage.getItem(DRAFT_KEY);
    const legacy = decode(latest);
    if (legacy) return permitted(legacy);
    if (!latest) return null;
    try {
        const pointer = JSON.parse(latest);
        return typeof pointer.id === "string" ? permitted(decode(localStorage.getItem(prefix + pointer.id))) : null;
    } catch  {
        return null;
    }
}
function listBrowserDrafts(ownerId = null) {
    const result = new Map();
    const legacy = readBrowserDraft(undefined, ownerId);
    if (legacy) result.set(legacy.invitation.id, legacy);
    for(let index = 0; index < localStorage.length; index++){
        const key = localStorage.key(index);
        if (!key?.startsWith(prefix)) continue;
        const draft = decode(localStorage.getItem(key));
        if (draft && (!draft.ownerId || draft.ownerId === ownerId)) result.set(draft.invitation.id, draft);
    }
    return [
        ...result.values()
    ].sort((a, b)=>b.savedAt.localeCompare(a.savedAt));
}
function saveBrowserDraft(invitation, dirty, ownerId = null) {
    const savedAt = new Date().toISOString();
    const legacy = decode(localStorage.getItem(DRAFT_KEY));
    if (legacy && legacy.invitation.id !== invitation.id) localStorage.setItem(prefix + legacy.invitation.id, JSON.stringify(legacy));
    localStorage.setItem(prefix + invitation.id, JSON.stringify({
        invitation,
        savedAt,
        dirty,
        ownerId
    }));
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
        id: invitation.id,
        savedAt
    }));
}
}),
"[project]/apps/web/src/templates/anor/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/anor/renderer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/anor/registry.ts [app-ssr] (ecmascript)");
;
;
}),
"[project]/apps/web/src/templates/anor/registry.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "anorTemplate",
    ()=>anorTemplate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/contracts/src/index.ts [app-ssr] (ecmascript)");
;
const anorTemplate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["templateById"])("anor");
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
"use client";
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
        osh: "Nahorgi osh",
        "qiz-bazmi": "Qiz bazmi",
        other: "Tadbir"
    },
    "uz-Cyrl": {
        wedding: "Никоҳ тўйи",
        birthday: "Туғилган кун",
        osh: "Наҳорги ош",
        "qiz-bazmi": "Қиз базми",
        other: "Тадбир"
    },
    en: {
        wedding: "Wedding",
        birthday: "Birthday",
        osh: "Morning osh",
        "qiz-bazmi": "Bride’s celebration",
        other: "Celebration"
    },
    ru: {
        wedding: "Свадьба",
        birthday: "День рождения",
        osh: "Утренний ош",
        "qiz-bazmi": "Праздник невесты",
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
    const [loadedLocale, setLoadedLocale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>makeLegacyData(invitation, frameLocale, guestName, sampleWishes), [
        invitation,
        frameLocale,
        guestName,
        sampleWishes
    ]);
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
        if (loadedLocale !== frameLocale) return;
        frame.current?.contentWindow?.postMessage(payload, window.location.origin);
    }, [
        frameLocale,
        loadedLocale,
        payload
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        sendData();
    }, [
        sendData
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const onMessage = (event)=>{
            if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow || event.data?.type !== "anor:language") return;
            const next = event.data.locale;
            if (invitation.enabledLocales.includes(next)) {
                setLoadedLocale(null);
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
            onLoad: ()=>setLoadedLocale(frameLocale),
            allow: "autoplay; fullscreen",
            loading: "eager"
        }, frameLocale, false, {
            fileName: "[project]/apps/web/src/templates/anor/renderer.tsx",
            lineNumber: 397,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/templates/anor/renderer.tsx",
        lineNumber: 388,
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
"[project]/apps/web/src/templates/marxaba/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MARXABA_TEMPLATE_IDS",
    ()=>MARXABA_TEMPLATE_IDS,
    "isMarxabaTemplate",
    ()=>isMarxabaTemplate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$marxaba$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/marxaba/renderer.tsx [app-ssr] (ecmascript)");
;
const MARXABA_TEMPLATE_IDS = [
    "oltin-nur",
    "samarqand-kechasi",
    "bogi-eram",
    "atlas",
    "uchar-gilam",
    "oq-kabutar",
    "kuzgi-chinor",
    "muhabbat-kitobi",
    "sahifa",
    "oltin-uzuk",
    "oynavand",
    "somon-yoli",
    "qogoz-turna",
    "nilufar"
];
function isMarxabaTemplate(id) {
    return MARXABA_TEMPLATE_IDS.includes(id);
}
}),
"[project]/apps/web/src/templates/marxaba/renderer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MarxabaInvitation",
    ()=>MarxabaInvitation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/anor/renderer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$marxaba$2f$renderer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/apps/web/src/templates/marxaba/renderer.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$catalog$2d$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/modules/catalog/catalog-music.ts [app-ssr] (ecmascript)");
"use client";
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
function MarxabaInvitation({ invitation, invitationId, locale, templateId, guestName = "", guestToken = "", preview = false, fullPreview = false, catalogMusic = false, silentPlayback = false, sampleWishes = false }) {
    const frame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const structuralSignature = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])("");
    const [frameLocale, setFrameLocale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(locale);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>setFrameLocale(locale), [
        locale
    ]);
    const sourceData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLegacyData"])(invitation, frameLocale, guestName, sampleWishes), [
        invitation,
        frameLocale,
        guestName,
        sampleWishes
    ]);
    const enabledLanguages = invitation.enabledLocales.map((item)=>sourceLocale[item]);
    const message = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const musicUrl = sourceData.music.enabled ? sourceData.music.url : catalogMusic ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$catalog$2d$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATALOG_PREVIEW_MUSIC"].url : "";
        return {
            ...sourceData,
            // Samarqand Kechasi's original runtime uses `dataTime` in its lock
            // and opening sequence; the shared contract exposes `dateTime`.
            ...templateId === "samarqand-kechasi" ? {
                dataTime: sourceData.dateTime
            } : {},
            music: musicUrl,
            slug: preview ? "" : invitationId,
            guestToken,
            name: guestName,
            defaultLang: sourceLocale[frameLocale],
            languages: enabledLanguages,
            languageSwitcher: true,
            silentPlayback: preview && silentPlayback,
            i18n: Object.fromEntries(invitation.enabledLocales.map((enabledLocale)=>{
                const localized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$anor$2f$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLegacyData"])(invitation, enabledLocale, guestName, sampleWishes);
                return [
                    sourceLocale[enabledLocale],
                    {
                        // Some captured scripts build their opening name art from this
                        // map, while the shared runtime uses program titles during its
                        // first render. Keep both aligned with the active language.
                        groom: localized.groom,
                        bride: localized.bride,
                        program: localized.program,
                        music: musicUrl
                    }
                ];
            })),
            preview,
            status: preview ? "published" : invitation.status,
            apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`
        };
    }, [
        catalogMusic,
        enabledLanguages,
        frameLocale,
        guestName,
        guestToken,
        invitation.enabledLocales,
        invitation.status,
        invitationId,
        preview,
        sampleWishes,
        sourceData
    ]);
    const latestMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(message);
    latestMessage.current = message;
    const frameUrl = `/templates/${encodeURIComponent(templateId)}/index.html?lang=${sourceLocale[frameLocale]}`;
    const currentStructure = JSON.stringify({
        frameUrl,
        start: invitation.startsAt,
        timezone: invitation.timezone,
        languages: enabledLanguages,
        music: message.music,
        dateTime: message.dateTime,
        dataTime: "dataTime" in message ? message.dataTime : undefined,
        silentPlayback: message.silentPlayback,
        rsvp: invitation.rsvp.enabled,
        wishes: invitation.wishes.enabled,
        gift: invitation.gift.enabled,
        gallery: invitation.gallery.map((item)=>item.id)
    });
    // Keep React's iframe src stable. Locale changes are already handled by the
    // explicit replace below, after the latest locale data has been put in
    // window.name; updating both src and location at once can race and drop data.
    const initialFrameUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(frameUrl);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const onMessage = (event)=>{
            if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow || event.data?.type !== "marxaba:language" || !invitation.enabledLocales.some((enabled)=>sourceLocale[enabled] === event.data.locale)) return;
            const next = invitation.enabledLocales.find((enabled)=>sourceLocale[enabled] === event.data.locale);
            if (next) setFrameLocale(next);
        };
        window.addEventListener("message", onMessage);
        return ()=>window.removeEventListener("message", onMessage);
    }, [
        invitation.enabledLocales
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const target = frame.current?.contentWindow;
        if (!target) return;
        if (!initialized.current || structuralSignature.current !== currentStructure) {
            try {
                target.name = JSON.stringify(message);
                target.location.replace(frameUrl);
            } catch  {
                target.location.replace(frameUrl);
            }
            initialized.current = true;
            structuralSignature.current = currentStructure;
            return;
        }
        target.postMessage({
            type: "marxaba:update",
            payload: message
        }, window.location.origin);
    }, [
        currentStructure,
        frameUrl,
        message
    ]);
    const frameClass = fullPreview ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$marxaba$2f$renderer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].full : preview ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$marxaba$2f$renderer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].preview : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$templates$2f$marxaba$2f$renderer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].public;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: frameClass,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
            ref: frame,
            title: `${sourceData.title || sourceData.eventType} invitation`,
            src: initialFrameUrl.current,
            onLoad: ()=>{
                frame.current?.contentWindow?.postMessage({
                    type: "marxaba:update",
                    payload: latestMessage.current
                }, window.location.origin);
            },
            allow: "autoplay; fullscreen",
            loading: "eager"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/templates/marxaba/renderer.tsx",
            lineNumber: 168,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/templates/marxaba/renderer.tsx",
        lineNumber: 167,
        columnNumber: 5
    }, this);
}
}),
"[project]/packages/contracts/src/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_WEDDING_INVITATION_MESSAGE",
    ()=>DEFAULT_WEDDING_INVITATION_MESSAGE,
    "EVENT_TYPES",
    ()=>EVENT_TYPES,
    "EVENT_TYPE_OPTIONS",
    ()=>EVENT_TYPE_OPTIONS,
    "LANGUAGE_NAMES",
    ()=>LANGUAGE_NAMES,
    "LOCALES",
    ()=>LOCALES,
    "TEMPLATES",
    ()=>TEMPLATES,
    "TEMPLATE_CATEGORIES",
    ()=>TEMPLATE_CATEGORIES,
    "addLanguage",
    ()=>addLanguage,
    "contentSchema",
    ()=>contentSchema,
    "createInvitation",
    ()=>createInvitation,
    "defaultDressCode",
    ()=>defaultDressCode,
    "defaultEventLabel",
    ()=>defaultEventLabel,
    "defaultInvitationMessage",
    ()=>defaultInvitationMessage,
    "defaultLocalizedInvitationContent",
    ()=>defaultLocalizedInvitationContent,
    "dressCodeSchema",
    ()=>dressCodeSchema,
    "emptyContent",
    ()=>emptyContent,
    "eventTypeSchema",
    ()=>eventTypeSchema,
    "formatPrice",
    ()=>formatPrice,
    "getContent",
    ()=>getContent,
    "invitationSchema",
    ()=>invitationSchema,
    "localeSchema",
    ()=>localeSchema,
    "removeLanguage",
    ()=>removeLanguage,
    "storyChapterSchema",
    ()=>storyChapterSchema,
    "switchTemplate",
    ()=>switchTemplate,
    "templateById",
    ()=>templateById,
    "templateIdSchema",
    ()=>templateIdSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z .enum>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z .string>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z .literal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z .object>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z .array>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$record$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z .record>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$partialRecord$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z .partialRecord>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z .boolean>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z .number>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$preprocess$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z .preprocess>");
;
const LOCALES = [
    "uz-Latn",
    "uz-Cyrl",
    "en",
    "ru"
];
const localeSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum(LOCALES);
const EVENT_TYPES = [
    "wedding",
    "birthday",
    "osh",
    "qiz-bazmi",
    "other"
];
const eventTypeSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum(EVENT_TYPES);
const EVENT_TYPE_OPTIONS = [
    {
        id: "wedding",
        name: "Nikoh to‘yi"
    },
    {
        id: "birthday",
        name: "Tug‘ilgan kun"
    },
    {
        id: "osh",
        name: "Nahorgi osh"
    },
    {
        id: "qiz-bazmi",
        name: "Qiz bazmi"
    },
    {
        id: "other",
        name: "Boshqa tadbir"
    }
];
const LOCALIZED_EVENT_LABELS = {
    "uz-Latn": {
        wedding: "Nikoh to‘yi",
        birthday: "Tug‘ilgan kun",
        osh: "Nahorgi osh",
        "qiz-bazmi": "Qiz bazmi",
        other: "Tadbir"
    },
    "uz-Cyrl": {
        wedding: "Никоҳ тўйи",
        birthday: "Туғилган кун",
        osh: "Наҳорги ош",
        "qiz-bazmi": "Қиз базми",
        other: "Тадбир"
    },
    en: {
        wedding: "Wedding",
        birthday: "Birthday",
        osh: "Morning osh",
        "qiz-bazmi": "Bride’s celebration",
        other: "Celebration"
    },
    ru: {
        wedding: "Свадьба",
        birthday: "День рождения",
        osh: "Утренний ош",
        "qiz-bazmi": "Праздник невесты",
        other: "Праздник"
    }
};
function defaultEventLabel(eventType, locale) {
    return LOCALIZED_EVENT_LABELS[locale][eventType];
}
const templateIdSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().min(1).max(64).regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/);
const invitationTemplateIdSchema = templateIdSchema.or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal(""));
const LANGUAGE_NAMES = {
    "uz-Latn": "Uz",
    "uz-Cyrl": "Уз",
    en: "En",
    ru: "Ru"
};
const short = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(300);
const text = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(10000);
const safeUrl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(2048).refine((v)=>!v || /^https?:\/\//i.test(v) || /^\/(?!\/)/.test(v), "Use an http(s) URL or local asset path");
const contentSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    title: short,
    people: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(short).max(20),
    hosts: short,
    greeting: short,
    personalGreeting: short,
    message: text,
    eventLabel: short,
    venueName: short,
    address: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(1000),
    landmark: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(1000),
    programHeading: short,
    programTitles: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$record$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(), short)
});
const localizedShortText = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$partialRecord$3e$__["z"].partialRecord(localeSchema, short);
const localizedLongText = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$partialRecord$3e$__["z"].partialRecord(localeSchema, text);
const dressCodeSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    enabled: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean().default(false),
    style: localizedShortText.default({}),
    text: localizedLongText.default({}),
    note: localizedLongText.default({}),
    colors: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().min(1).max(100),
        name: localizedShortText.default({}),
        hex: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^#[0-9a-f]{3,8}$/i)
    })).max(12).default([])
});
const storyChapterSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().min(1).max(100),
    title: localizedShortText.default({}),
    text: localizedLongText.default({})
});
const invitationSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    version: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal(1),
    revision: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().int().min(1).default(1),
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().min(1).max(100),
    templateId: invitationTemplateIdSchema,
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum([
        "draft",
        "published",
        "archived"
    ]),
    defaultLocale: localeSchema,
    enabledLocales: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(localeSchema).min(1).max(4),
    content: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$record$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(), contentSchema),
    eventType: eventTypeSchema,
    startsAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(50),
    timezone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(100),
    venue: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        latitude: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().min(-90).max(90).nullable(),
        longitude: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().min(-180).max(180).nullable(),
        mapUrl: safeUrl
    }),
    program: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(100),
        time: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(10)
    })).max(100),
    story: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(storyChapterSchema).max(20).default([]),
    gallery: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(100),
        url: safeUrl,
        alt: short,
        caption: short
    })).max(50),
    music: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        enabled: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
        assetId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(100).nullable(),
        url: safeUrl,
        filename: short
    }),
    gift: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        enabled: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
        receiptUploadEnabled: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
        cardNumber: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(30),
        cardHolder: short
    }),
    contacts: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$preprocess$3e$__["z"].preprocess((value)=>{
        if (!Array.isArray(value)) return value;
        const firstValue = (type)=>value.find((contact)=>typeof contact?.value === "string" && contact.type === type && contact.value.trim())?.value ?? "";
        return {
            phoneNumber: firstValue("phone"),
            telegramUsername: firstValue("telegram")
        };
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        phoneNumber: short,
        telegramUsername: short
    })),
    rsvp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        enabled: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
        deadline: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(50),
        maxPartySize: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().int().min(1).max(100)
    }),
    wishes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        enabled: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
        requireApproval: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal(true)
    }),
    dressCode: dressCodeSchema.default({
        enabled: false,
        style: {},
        text: {},
        note: {},
        colors: []
    })
}).superRefine((value, ctx)=>{
    if (!value.enabledLocales.includes(value.defaultLocale)) ctx.addIssue({
        code: "custom",
        message: "Default language must be enabled"
    });
    if (value.status === "published" && !value.templateId) ctx.addIssue({
        code: "custom",
        path: [
            "templateId"
        ],
        message: "A published invitation must have a template"
    });
    for (const locale of value.enabledLocales)if (!value.content[locale]) ctx.addIssue({
        code: "custom",
        message: `Missing language: ${locale}`
    });
    if (!value.gift.enabled && value.gift.receiptUploadEnabled) ctx.addIssue({
        code: "custom",
        message: "Receipt uploads require gift details"
    });
});
const DEFAULT_DRESS_CODE = {
    "uz-Latn": {
        style: "Kechki libos",
        text: "Ayollar uchun uzun kechki ko‘ylak, erkaklar uchun klassik kostyum. Quyidagi ranglardan tanlasangiz, suratlar yanada chiroyli chiqadi.",
        note: "Iltimos, oq libosdan saqlaning — bu kun oq rang kelinniki.",
        colors: [
            "Shampan",
            "Pudra",
            "Zaytun",
            "To‘q ko‘k",
            "Bordo"
        ]
    },
    "uz-Cyrl": {
        style: "Кечки либос",
        text: "Аёллар учун узун кечки кўйлак, эркаклар учун классик костюм. Қуйидаги ранглардан танласангиз, суратлар янада чиройли чиқади.",
        note: "Илтимос, оқ либосдан сақланинг — бу кун оқ ранг келинники.",
        colors: [
            "Шампан",
            "Пудра",
            "Зайтун",
            "Тўқ кўк",
            "Бордо"
        ]
    },
    en: {
        style: "Evening attire",
        text: "Women: long evening dresses. Men: classic suits. Choosing from the colors below will make the photos look even more beautiful.",
        note: "Please avoid wearing white — white belongs to the bride on this day.",
        colors: [
            "Champagne",
            "Powder",
            "Olive",
            "Navy",
            "Burgundy"
        ]
    },
    ru: {
        style: "Вечерний наряд",
        text: "Для женщин — длинные вечерние платья, для мужчин — классические костюмы. Выбирайте цвета из палитры ниже, чтобы фотографии получились ещё красивее.",
        note: "Пожалуйста, не надевайте белое — в этот день белый цвет принадлежит невесте.",
        colors: [
            "Шампань",
            "Пудровый",
            "Оливковый",
            "Тёмно-синий",
            "Бордовый"
        ]
    }
};
function defaultDressCode() {
    const palette = [
        "#ead7b7",
        "#d7a7ad",
        "#78805b",
        "#243d5a",
        "#783645"
    ];
    const colors = DEFAULT_DRESS_CODE["uz-Latn"].colors.map((_, index)=>({
            id: `dress-code-color-${index + 1}`,
            name: Object.fromEntries(LOCALES.map((locale)=>[
                    locale,
                    DEFAULT_DRESS_CODE[locale].colors[index]
                ])),
            hex: palette[index]
        }));
    return {
        enabled: true,
        style: Object.fromEntries(LOCALES.map((locale)=>[
                locale,
                DEFAULT_DRESS_CODE[locale].style
            ])),
        text: Object.fromEntries(LOCALES.map((locale)=>[
                locale,
                DEFAULT_DRESS_CODE[locale].text
            ])),
        note: Object.fromEntries(LOCALES.map((locale)=>[
                locale,
                DEFAULT_DRESS_CODE[locale].note
            ])),
        colors
    };
}
const TEMPLATE_CATEGORIES = [
    {
        id: "wedding",
        name: "Nikoh to‘yi",
        position: 0
    },
    {
        id: "birthday",
        name: "Tug‘ilgan kun",
        position: 1
    },
    {
        id: "osh",
        name: "Nahorgi osh",
        position: 2
    },
    {
        id: "qiz-bazmi",
        name: "Qiz bazmi",
        position: 3
    },
    {
        id: "other",
        name: "Boshqa tadbirlar",
        position: 4
    }
];
const TEMPLATES = [
    {
        id: "anor",
        name: "Anor",
        description: "Anor gullari va Rishton naqshlari uyg‘unligi.",
        previewImage: "preview.webp",
        categoryIds: [
            "wedding"
        ],
        supportedEventTypes: [
            "wedding"
        ],
        priceMinor: 15000000,
        currency: "UZS",
        accent: "#7c142b",
        published: true
    },
    {
        id: "oltin-nur",
        name: "Oltin Nur",
        description: "Qora baxmal va oltin nur.",
        previewImage: "/templates/oltin-nur/preview.webp",
        categoryIds: [
            "wedding"
        ],
        supportedEventTypes: [
            "wedding"
        ],
        priceMinor: 15000000,
        currency: "UZS",
        accent: "#c6a45b",
        published: false
    },
    {
        id: "samarqand-kechasi",
        name: "Samarqand Kechasi",
        description: "Registon oqshomi va oltin salyut.",
        previewImage: "/templates/samarqand-kechasi/preview.webp",
        categoryIds: [
            "wedding"
        ],
        supportedEventTypes: [
            "wedding"
        ],
        priceMinor: 15000000,
        currency: "UZS",
        accent: "#d2a84a",
        published: true
    },
    {
        id: "bogi-eram",
        name: "Bog‘i Eram",
        description: "O‘ymakor darvoza va jannat bog‘i.",
        previewImage: "/templates/bogi-eram/preview.webp",
        categoryIds: [
            "wedding"
        ],
        supportedEventTypes: [
            "wedding"
        ],
        priceMinor: 15000000,
        currency: "UZS",
        accent: "#9c6c3a",
        published: true
    },
    {
        id: "atlas",
        name: "Atlas",
        description: "Zamonaviy atlas va adras ranglari.",
        previewImage: "/templates/atlas/preview.webp",
        categoryIds: [
            "wedding"
        ],
        supportedEventTypes: [
            "wedding"
        ],
        priceMinor: 15000000,
        currency: "UZS",
        accent: "#c2185b",
        published: true
    },
    {
        id: "uchar-gilam",
        name: "Uchar Gilam",
        description: "Gilam ustida Buxoro uzra parvoz.",
        previewImage: "/templates/uchar-gilam/preview.webp",
        categoryIds: [
            "wedding"
        ],
        supportedEventTypes: [
            "wedding"
        ],
        priceMinor: 15000000,
        currency: "UZS",
        accent: "#be8738",
        published: false
    },
    {
        id: "oq-kabutar",
        name: "Oq Kabutar",
        description: "Oq kabutarlar va ipak lenta.",
        previewImage: "/templates/oq-kabutar/preview.webp",
        categoryIds: [
            "wedding"
        ],
        supportedEventTypes: [
            "wedding"
        ],
        priceMinor: 15000000,
        currency: "UZS",
        accent: "#9a7957",
        published: false
    },
    {
        id: "kuzgi-chinor",
        name: "Kuzgi Chinor",
        description: "Oltin kuz va chinor barglari.",
        previewImage: "/templates/kuzgi-chinor/preview.webp",
        categoryIds: [
            "wedding"
        ],
        supportedEventTypes: [
            "wedding"
        ],
        priceMinor: 15000000,
        currency: "UZS",
        accent: "#a65724",
        published: false
    },
    {
        id: "muhabbat-kitobi",
        name: "Muhabbat Kitobi",
        description: "Sevgi hikoyasi kitob sahifalarida.",
        previewImage: "/templates/muhabbat-kitobi/preview.webp",
        categoryIds: [
            "wedding"
        ],
        supportedEventTypes: [
            "wedding"
        ],
        priceMinor: 15000000,
        currency: "UZS",
        accent: "#8a6348",
        published: false
    },
    {
        id: "sahifa",
        name: "Sahifa",
        description: "Jurnal muqovasidan ilhomlangan taklifnoma.",
        previewImage: "/templates/sahifa/preview.webp",
        categoryIds: [
            "wedding"
        ],
        supportedEventTypes: [
            "wedding"
        ],
        priceMinor: 15000000,
        currency: "UZS",
        accent: "#9f7551",
        published: false
    },
    {
        id: "oltin-uzuk",
        name: "Oltin Uzuk",
        description: "Haqiqiy 3D oltin uzuklar.",
        previewImage: "/templates/oltin-uzuk/preview.webp",
        categoryIds: [
            "wedding"
        ],
        supportedEventTypes: [
            "wedding"
        ],
        priceMinor: 15000000,
        currency: "UZS",
        accent: "#c8a14e",
        published: false
    },
    {
        id: "oynavand",
        name: "Oynavand",
        description: "Oynakori gumbaz va ko‘zgu parchalari.",
        previewImage: "/templates/oynavand/preview.webp",
        categoryIds: [
            "wedding"
        ],
        supportedEventTypes: [
            "wedding"
        ],
        priceMinor: 15000000,
        currency: "UZS",
        accent: "#3fb7b0",
        published: true
    },
    {
        id: "somon-yoli",
        name: "Somon Yo‘li",
        description: "Ismlaringiz yulduzlar turkumida.",
        previewImage: "/templates/somon-yoli/preview.webp",
        categoryIds: [
            "wedding"
        ],
        supportedEventTypes: [
            "wedding"
        ],
        priceMinor: 15000000,
        currency: "UZS",
        accent: "#4b2a7a",
        published: true
    },
    {
        id: "qogoz-turna",
        name: "Qog‘oz Turna",
        description: "Qat-qat ochiladigan nafis taklifnoma.",
        previewImage: "/templates/qogoz-turna/preview.webp",
        categoryIds: [
            "wedding"
        ],
        supportedEventTypes: [
            "wedding"
        ],
        priceMinor: 15000000,
        currency: "UZS",
        accent: "#c9785a",
        published: true
    },
    {
        id: "nilufar",
        name: "Nilufar",
        description: "Nilufar hovuzi va sokin suv manzarasi.",
        previewImage: "/templates/nilufar/preview.webp",
        categoryIds: [
            "wedding"
        ],
        supportedEventTypes: [
            "wedding"
        ],
        priceMinor: 15000000,
        currency: "UZS",
        accent: "#7fa99b",
        published: false
    }
];
const templateById = (id)=>TEMPLATES.find((item)=>item.id === id);
function formatPrice(minor) {
    const absolute = Math.abs(minor);
    const whole = Math.floor(absolute / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
    const fraction = absolute % 100;
    return `${minor < 0 ? "−" : ""}${whole}${fraction ? `,${String(fraction).padStart(2, "0")}` : ""} so‘m`;
}
function emptyContent() {
    return {
        title: "",
        people: [],
        hosts: "",
        greeting: "",
        personalGreeting: "",
        message: "",
        eventLabel: "",
        venueName: "",
        address: "",
        landmark: "",
        programHeading: "",
        programTitles: {}
    };
}
const DEFAULT_WEDDING_INVITATION_MESSAGE = "Hayotimizning eng quvonchli kunida — nikoh to‘yimizda — Sizni aziz mehmonimiz sifatida ko‘rishdan baxtiyormiz.";
function defaultInvitationMessage(eventType, locale) {
    if (eventType !== "wedding") return "";
    return ({
        "uz-Latn": DEFAULT_WEDDING_INVITATION_MESSAGE,
        "uz-Cyrl": "Ҳаётимизнинг энг қувончли кунида — никоҳ тўйимизда — Сизни азиз меҳмонимиз сифатида кўришдан бахтиёрмиз.",
        en: "We would be delighted to have you with us on the happiest day of our lives—our wedding day.",
        ru: "Будем счастливы видеть вас среди гостей в самый радостный день нашей жизни — в день нашей свадьбы."
    })[locale];
}
const DEFAULT_GREETINGS = {
    "uz-Latn": "Assalomu alaykum, aziz mehmon!",
    "uz-Cyrl": "Ассалому алайкум, азиз меҳмон!",
    en: "Hello, dear guest!",
    ru: "Здравствуйте, дорогой гость!"
};
const DEFAULT_INVITATION_TITLES = {
    "uz-Latn": "Bizning unutilmas kunimiz",
    "uz-Cyrl": "Бизнинг унутилмас кунимиз",
    en: "Our unforgettable day",
    ru: "Наш незабываемый день"
};
const DEFAULT_PROGRAM_HEADINGS = {
    wedding: {
        "uz-Latn": "To‘y dasturi",
        "uz-Cyrl": "Тўй дастури",
        en: "Wedding program",
        ru: "Программа свадьбы"
    },
    birthday: {
        "uz-Latn": "Tug‘ilgan kun dasturi",
        "uz-Cyrl": "Туғилган кун дастури",
        en: "Birthday program",
        ru: "Программа дня рождения"
    },
    osh: {
        "uz-Latn": "Nahorgi osh dasturi",
        "uz-Cyrl": "Наҳорги ош дастури",
        en: "Morning osh program",
        ru: "Программа утреннего оша"
    },
    "qiz-bazmi": {
        "uz-Latn": "Qiz bazmi dasturi",
        "uz-Cyrl": "Қиз базми дастури",
        en: "Bride’s celebration program",
        ru: "Программа праздника невесты"
    },
    other: {
        "uz-Latn": "Tadbir dasturi",
        "uz-Cyrl": "Тадбир дастури",
        en: "Event program",
        ru: "Программа мероприятия"
    }
};
function defaultLocalizedInvitationContent(eventType, locale) {
    return {
        ...emptyContent(),
        title: DEFAULT_INVITATION_TITLES[locale],
        greeting: DEFAULT_GREETINGS[locale],
        message: defaultInvitationMessage(eventType, locale),
        eventLabel: defaultEventLabel(eventType, locale),
        programHeading: DEFAULT_PROGRAM_HEADINGS[eventType][locale]
    };
}
function createInvitation(templateId = "") {
    return {
        version: 1,
        revision: 1,
        id: crypto.randomUUID(),
        templateId,
        status: "draft",
        defaultLocale: "uz-Latn",
        enabledLocales: [
            "uz-Latn"
        ],
        content: {
            "uz-Latn": emptyContent()
        },
        eventType: "other",
        startsAt: "",
        timezone: "Asia/Tashkent",
        venue: {
            latitude: null,
            longitude: null,
            mapUrl: ""
        },
        program: [],
        story: [],
        gallery: [],
        music: {
            enabled: false,
            assetId: null,
            url: "",
            filename: ""
        },
        gift: {
            enabled: false,
            receiptUploadEnabled: false,
            cardNumber: "",
            cardHolder: ""
        },
        contacts: {
            phoneNumber: "",
            telegramUsername: ""
        },
        rsvp: {
            enabled: true,
            deadline: "",
            maxPartySize: 5
        },
        wishes: {
            enabled: true,
            requireApproval: true
        },
        dressCode: {
            enabled: false,
            style: {},
            text: {},
            note: {},
            colors: []
        }
    };
}
function getContent(invitation, locale = invitation.defaultLocale) {
    return invitation.content[locale] ?? invitation.content[invitation.defaultLocale] ?? emptyContent();
}
function switchTemplate(invitation, templateId) {
    return {
        ...invitation,
        templateId
    };
}
function addLanguage(invitation, locale) {
    if (invitation.enabledLocales.includes(locale)) return invitation;
    const content = defaultLocalizedInvitationContent(invitation.eventType, locale);
    return {
        ...invitation,
        enabledLocales: [
            ...invitation.enabledLocales,
            locale
        ],
        content: {
            ...invitation.content,
            [locale]: content
        }
    };
}
function removeLanguage(invitation, locale) {
    if (invitation.enabledLocales.length <= 1 || locale === invitation.defaultLocale || !invitation.enabledLocales.includes(locale)) return invitation;
    const content = {
        ...invitation.content
    };
    delete content[locale];
    const removeLocale = (value)=>{
        const copy = {
            ...value
        };
        delete copy[locale];
        return copy;
    };
    return {
        ...invitation,
        enabledLocales: invitation.enabledLocales.filter((item)=>item !== locale),
        content,
        story: invitation.story.map((chapter)=>({
                ...chapter,
                title: removeLocale(chapter.title),
                text: removeLocale(chapter.text)
            })),
        dressCode: {
            ...invitation.dressCode,
            style: removeLocale(invitation.dressCode.style),
            text: removeLocale(invitation.dressCode.text),
            note: removeLocale(invitation.dressCode.note),
            colors: invitation.dressCode.colors.map((color)=>({
                    ...color,
                    name: removeLocale(color.name)
                }))
        }
    };
}
}),
]})(),
"[project]/apps/web/src/app/home.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "catalogEmpty": "home-module__xN3HmW__catalogEmpty",
  "catalogGrid": "home-module__xN3HmW__catalogGrid",
  "categoryFilters": "home-module__xN3HmW__categoryFilters",
  "createAction": "home-module__xN3HmW__createAction",
  "emptyArt": "home-module__xN3HmW__emptyArt",
  "hero": "home-module__xN3HmW__hero",
  "heroCopy": "home-module__xN3HmW__heroCopy",
  "occasion": "home-module__xN3HmW__occasion",
  "previewOnlyLabel": "home-module__xN3HmW__previewOnlyLabel",
  "sectionHeading": "home-module__xN3HmW__sectionHeading",
  "sectionLabel": "home-module__xN3HmW__sectionLabel",
  "selectedFilter": "home-module__xN3HmW__selectedFilter",
  "templateActions": "home-module__xN3HmW__templateActions",
  "templateArt": "home-module__xN3HmW__templateArt",
  "templateCard": "home-module__xN3HmW__templateCard",
  "templateInfo": "home-module__xN3HmW__templateInfo",
  "templates": "home-module__xN3HmW__templates",
});
}),
"[project]/apps/web/src/modules/catalog/full-template-preview.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "fullPreview": "full-template-preview-module__OlGP2q__fullPreview",
  "loading": "full-template-preview-module__OlGP2q__loading",
  "unsupported": "full-template-preview-module__OlGP2q__unsupported",
});
}),
"[project]/apps/web/src/modules/catalog/preview-sample.json.[json].cjs [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = {
    "defaultLocale": "uz-Latn",
    "enabledLocales": [
        "uz-Latn",
        "uz-Cyrl",
        "en",
        "ru"
    ],
    "eventType": "wedding",
    "startsAt": "2027-06-12T17:00",
    "timezone": "Asia/Tashkent",
    "gift": {
        "enabled": true,
        "receiptUploadEnabled": false,
        "cardNumber": "8600 1234 5678 9012",
        "cardHolder": "AZIZ AZIZOV"
    },
    "contacts": {
        "phoneNumber": "+998 90 123 45 67",
        "telegramUsername": "@demo"
    },
    "program": [
        {
            "id": "sample-arrival",
            "time": "17:30"
        },
        {
            "id": "sample-entrance",
            "time": "18:00"
        },
        {
            "id": "sample-meal",
            "time": "18:30"
        },
        {
            "id": "sample-music",
            "time": "20:00"
        },
        {
            "id": "sample-cake",
            "time": "21:30"
        },
        {
            "id": "sample-farewell",
            "time": "22:30"
        }
    ],
    "gallery": [
        {
            "id": "sample-memory-1",
            "url": "",
            "alt": "",
            "caption": ""
        },
        {
            "id": "sample-memory-2",
            "url": "",
            "alt": "",
            "caption": ""
        },
        {
            "id": "sample-memory-3",
            "url": "",
            "alt": "",
            "caption": ""
        },
        {
            "id": "sample-memory-4",
            "url": "",
            "alt": "",
            "caption": ""
        },
        {
            "id": "sample-memory-5",
            "url": "",
            "alt": "",
            "caption": ""
        },
        {
            "id": "sample-memory-6",
            "url": "",
            "alt": "",
            "caption": ""
        }
    ],
    "dressCode": {
        "enabled": true,
        "style": {
            "uz-Latn": "Kechki libos",
            "uz-Cyrl": "Кечки либос",
            "en": "Evening attire",
            "ru": "Вечерний наряд"
        },
        "text": {
            "uz-Latn": "Ayollar uchun uzun kechki ko‘ylak, erkaklar uchun klassik kostyum. Quyidagi ranglardan tanlasangiz, suratlar yanada chiroyli chiqadi.",
            "uz-Cyrl": "Аёллар учун узун кечки кўйлак, эркаклар учун классик костюм. Қуйидаги ранглардан танласангиз, суратлар янада чиройли чиқади.",
            "en": "Women: long evening dresses. Men: classic suits. Choosing from the colors below will make the photos look even more beautiful.",
            "ru": "Для женщин — длинные вечерние платья, для мужчин — классические костюмы. Выбирайте цвета из палитры ниже, чтобы фотографии получились ещё красивее."
        },
        "note": {
            "uz-Latn": "Iltimos, oq libosdan saqlaning — bu kun oq rang kelinniki.",
            "uz-Cyrl": "Илтимос, оқ либосдан сақланинг — бу кун оқ ранг келинники.",
            "en": "Please avoid wearing white — white belongs to the bride on this day.",
            "ru": "Пожалуйста, не надевайте белое — в этот день белый цвет принадлежит невесте."
        },
        "colors": [
            {
                "id": "sample-dress-champagne",
                "name": {
                    "uz-Latn": "Shampan",
                    "uz-Cyrl": "Шампан",
                    "en": "Champagne",
                    "ru": "Шампань"
                },
                "hex": "#ead7b7"
            },
            {
                "id": "sample-dress-powder",
                "name": {
                    "uz-Latn": "Pudra",
                    "uz-Cyrl": "Пудра",
                    "en": "Powder",
                    "ru": "Пудровый"
                },
                "hex": "#d7a7ad"
            },
            {
                "id": "sample-dress-olive",
                "name": {
                    "uz-Latn": "Zaytun",
                    "uz-Cyrl": "Зайтун",
                    "en": "Olive",
                    "ru": "Оливковый"
                },
                "hex": "#78805b"
            },
            {
                "id": "sample-dress-navy",
                "name": {
                    "uz-Latn": "To‘q ko‘k",
                    "uz-Cyrl": "Тўқ кўк",
                    "en": "Navy",
                    "ru": "Тёмно-синий"
                },
                "hex": "#243d5a"
            },
            {
                "id": "sample-dress-burgundy",
                "name": {
                    "uz-Latn": "Bordo",
                    "uz-Cyrl": "Бордо",
                    "en": "Burgundy",
                    "ru": "Бордовый"
                },
                "hex": "#783645"
            }
        ]
    },
    "wishes": {
        "uz-Latn": [
            {
                "name": "Dilnoza opa",
                "text": "Baxtingiz abadiy bo‘lsin! Bir umr bir-biringizni qadrlab yashang."
            },
            {
                "name": "Sardor",
                "text": "Jasur, do‘stim, tabriklayman! Oilangiz mustahkam bo‘lsin."
            },
            {
                "name": "Nilufar",
                "text": "Malikajon, sizga eng go‘zal kunlar tilayman!"
            }
        ],
        "uz-Cyrl": [
            {
                "name": "Дилноза опа",
                "text": "Бахтингиз абадий бўлсин! Бир умр бир-бирингизни қадрлаб яшанг."
            },
            {
                "name": "Сардор",
                "text": "Жасур, дўстим, табриклайман! Оилангиз мустаҳкам бўлсин."
            },
            {
                "name": "Нилуфар",
                "text": "Маликажон, сизга энг гўзал кунлар тилайман!"
            }
        ],
        "en": [
            {
                "name": "Dilnoza",
                "text": "May your happiness last forever! Treasure each other throughout your life."
            },
            {
                "name": "Sardor",
                "text": "Congratulations, Jasur, my friend! May your family stay strong."
            },
            {
                "name": "Nilufar",
                "text": "Malika, wishing you the most beautiful days!"
            }
        ],
        "ru": [
            {
                "name": "Дилноза опа",
                "text": "Пусть ваше счастье будет вечным! Всю жизнь цените друг друга."
            },
            {
                "name": "Сардор",
                "text": "Жасур, друг, поздравляю! Пусть ваша семья будет крепкой."
            },
            {
                "name": "Нилуфар",
                "text": "Малика, желаю вам самых прекрасных дней!"
            }
        ]
    },
    "content": {
        "uz-Latn": {
            "title": "Bizning unutilmas kunimiz",
            "people": [
                "Javohir",
                "Madina"
            ],
            "hosts": "Javohir va Madina oilalari",
            "greeting": "Assalomu alaykum, aziz mehmon!",
            "personalGreeting": "Assalomu alaykum, {name}!",
            "message": "Hayotimizdagi quvonchli kunimizda sizni yonimizda ko‘rishdan mamnun bo‘lamiz.",
            "eventLabel": "Nikoh to‘yi",
            "venueName": "Zarafshon tantanalar saroyi",
            "address": "Toshkent shahri, Yunusobod tumani",
            "landmark": "Amir Temur xiyoboni yaqinida",
            "programHeading": "To‘y dasturi",
            "programTitles": {
                "sample-arrival": "Mehmonlarni kutib olish",
                "sample-entrance": "Kelin-kuyovning kirib kelishi",
                "sample-meal": "Tabriklar va dasturxon",
                "sample-music": "Raqs va kuy-qo‘shiqlar",
                "sample-cake": "To‘y torti",
                "sample-farewell": "Yakuniy so‘z"
            }
        },
        "uz-Cyrl": {
            "title": "Бизнинг унутилмас кунимиз",
            "people": [
                "Жавоҳир",
                "Мадина"
            ],
            "hosts": "Жавоҳир ва Мадинанинг оилалари",
            "greeting": "Ассалому алайкум, азиз меҳмон!",
            "personalGreeting": "Ассалому алайкум, {name}!",
            "message": "Ҳаётимиздаги қувончли кунимизда сизни ёнимизда кўришдан мамнун бўламиз.",
            "eventLabel": "Никоҳ тўйи",
            "venueName": "Зарафшон тантаналар саройи",
            "address": "Тошкент шаҳри, Юнусобод тумани",
            "landmark": "Амир Темур хиёбони яқинида",
            "programHeading": "Тўй дастури",
            "programTitles": {
                "sample-arrival": "Меҳмонларни кутиб олиш",
                "sample-entrance": "Келин-куёвнинг кириб келиши",
                "sample-meal": "Табриклар ва дастурхон",
                "sample-music": "Рақс ва куй-қўшиқлар",
                "sample-cake": "Тўй торти",
                "sample-farewell": "Якуний сўз"
            }
        },
        "en": {
            "title": "Our Unforgettable Day",
            "people": [
                "Javohir",
                "Madina"
            ],
            "hosts": "Javohir and Madina's families",
            "greeting": "Hello, dear guest!",
            "personalGreeting": "Hello, {name}!",
            "message": "We would be delighted to celebrate this joyful day with you.",
            "eventLabel": "Wedding celebration",
            "venueName": "Zarafshon Celebration Palace",
            "address": "Yunusabad district, Tashkent",
            "landmark": "Near Amir Temur Square",
            "programHeading": "Wedding program",
            "programTitles": {
                "sample-arrival": "Welcome and reception",
                "sample-entrance": "The bride and groom make their entrance",
                "sample-meal": "Toasts and dinner",
                "sample-music": "Music and dancing",
                "sample-cake": "Wedding cake",
                "sample-farewell": "Farewell"
            }
        },
        "ru": {
            "title": "Наш незабываемый день",
            "people": [
                "Жавоҳир",
                "Мадина"
            ],
            "hosts": "Семьи Жавохира и Мадины",
            "greeting": "Ассалому алейкум, дорогой гость!",
            "personalGreeting": "Ассалому алейкум, {name}!",
            "message": "Будем рады видеть вас рядом с нами в этот радостный день.",
            "eventLabel": "Свадебное торжество",
            "venueName": "Дворец торжеств «Зарафшон»",
            "address": "Юнусабадский район, Ташкент",
            "landmark": "Рядом с площадью Амира Темура",
            "programHeading": "Программа свадьбы",
            "programTitles": {
                "sample-arrival": "Встреча гостей",
                "sample-entrance": "Выход жениха и невесты",
                "sample-meal": "Поздравления и ужин",
                "sample-music": "Музыка и танцы",
                "sample-cake": "Свадебный торт",
                "sample-farewell": "Заключительное слово"
            }
        }
    }
};
}),
"[project]/apps/web/src/templates/anor/template.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "sourceFullPreview": "template-module__2IWp4W__sourceFullPreview",
  "sourcePreview": "template-module__2IWp4W__sourcePreview",
  "sourcePublic": "template-module__2IWp4W__sourcePublic",
});
}),
"[project]/apps/web/src/templates/marxaba/renderer.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "full": "renderer-module__z5RFBq__full",
  "preview": "renderer-module__z5RFBq__preview",
  "public": "renderer-module__z5RFBq__public",
});
}),
];

//# sourceMappingURL=_0pfal6hshxqni._.js.map