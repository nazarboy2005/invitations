module.exports = [
(()=>{"use strict";return[
"[project]/apps/web/src/app/preview/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PreviewPage,
    "dynamic",
    ()=>dynamic,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$577$2e$0_react$40$19$2e$3$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.577.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-rsc] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/contracts/src/index.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$site$2d$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/site-header.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$full$2d$template$2d$preview$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/modules/catalog/full-template-preview.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$template$2d$gallery$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/modules/catalog/template-gallery.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$server$2f$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/server/catalog.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f$preview$2f$preview$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/apps/web/src/app/preview/preview.module.css [app-rsc] (css module)");
;
;
;
;
;
;
;
;
;
const dynamic = "force-dynamic";
const metadata = {
    title: "Taklifnoma dizaynlari",
    robots: {
        index: false,
        follow: false
    }
};
async function PreviewPage({ searchParams }) {
    const params = await searchParams;
    const templateId = Array.isArray(params.template) ? params.template[0] : params.template;
    const draftId = Array.isArray(params.draft) ? params.draft[0] : params.draft;
    const demoParam = Array.isArray(params.demo) ? params.demo[0] : params.demo;
    const qaSilentParam = Array.isArray(params.qaSilent) ? params.qaSilent[0] : params.qaSilent;
    const qaLongNamesParam = Array.isArray(params.qaLongNames) ? params.qaLongNames[0] : params.qaLongNames;
    const template = templateId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["templateById"])(templateId) : undefined;
    if (template) {
        const catalog = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$server$2f$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCatalog"])();
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$full$2d$template$2d$preview$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FullTemplatePreview"], {
            template: template,
            canSelect: catalog.templates.some((item)=>item.id === template.id),
            draftId: draftId,
            demo: demoParam === "1",
            silentPlayback: qaSilentParam === "1",
            longNames: qaLongNamesParam === "1"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/preview/page.tsx",
            lineNumber: 44,
            columnNumber: 7
        }, this);
    }
    const catalog = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$server$2f$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCatalog"])(true);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$site$2d$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SiteHeader"], {}, void 0, false, {
                fileName: "[project]/apps/web/src/app/preview/page.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                id: "main",
                className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f$preview$2f$preview$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].galleryPage,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f$preview$2f$preview$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].galleryHeader,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f$preview$2f$preview$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].backLink,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$577$2e$0_react$40$19$2e$3$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/preview/page.tsx",
                                        lineNumber: 62,
                                        columnNumber: 13
                                    }, this),
                                    " Bosh sahifaga"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/preview/page.tsx",
                                lineNumber: 61,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Dizaynlar"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/preview/page.tsx",
                                lineNumber: 64,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                children: "Taklifnomalarni to‘liq ko‘ring"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/preview/page.tsx",
                                lineNumber: 65,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Har bir dizayn o‘zining asl ko‘rinishi va harakatlari bilan ochiladi."
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/preview/page.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/preview/page.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$template$2d$gallery$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TemplateGallery"], {
                        templates: catalog.templates.filter((item)=>item.published || item.id === "anor"),
                        categories: catalog.categories ?? __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TEMPLATE_CATEGORIES"]
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/preview/page.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/preview/page.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/preview/page.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/site-header.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SiteHeader",
    ()=>SiteHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$577$2e$0_react$40$19$2e$3$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flower$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Flower2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.577.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/flower-2.js [app-rsc] (ecmascript) <export default as Flower2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$577$2e$0_react$40$19$2e$3$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.577.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/arrow-up-right.js [app-rsc] (ecmascript) <export default as ArrowUpRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$server$2f$auth$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/server/auth/index.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$site$2d$header$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/site-header.module.css [app-rsc] (css module)");
;
;
;
;
;
async function SiteHeader({ compact = false }) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$server$2f$auth$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSessionUser"])().catch(()=>null);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$site$2d$header$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].header,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `container ${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$site$2d$header$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].inner}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                    href: "/",
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$site$2d$header$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].brand,
                    "aria-label": "Taklifnoma bosh sahifa",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$577$2e$0_react$40$19$2e$3$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flower$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Flower2$3e$__["Flower2"], {
                            size: 27,
                            strokeWidth: 1.5
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/site-header.tsx",
                            lineNumber: 15,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                "taklifnoma",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$site$2d$header$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].dot,
                                    children: "."
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/site-header.tsx",
                                    lineNumber: 17,
                                    columnNumber: 23
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/site-header.tsx",
                            lineNumber: 16,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/site-header.tsx",
                    lineNumber: 10,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    "aria-label": "Asosiy menyu",
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$site$2d$header$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].nav,
                    children: [
                        !compact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            href: "/#templates",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$site$2d$header$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].catalog,
                            children: "Dizaynlar"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/site-header.tsx",
                            lineNumber: 22,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            href: "/dashboard",
                            children: user ? "Taklifnomalarim" : "Kirish"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/site-header.tsx",
                            lineNumber: 26,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            href: "/studio",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$site$2d$header$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].create,
                            children: [
                                "Yaratish ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$577$2e$0_react$40$19$2e$3$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__["ArrowUpRight"], {
                                    size: 16
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/site-header.tsx",
                                    lineNumber: 28,
                                    columnNumber: 22
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/site-header.tsx",
                            lineNumber: 27,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/site-header.tsx",
                    lineNumber: 20,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/site-header.tsx",
            lineNumber: 9,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/site-header.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/modules/catalog/full-template-preview.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FullTemplatePreview",
    ()=>FullTemplatePreview
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const FullTemplatePreview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call FullTemplatePreview() from the server but FullTemplatePreview is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/modules/catalog/full-template-preview.tsx", "FullTemplatePreview");
}),
"[project]/apps/web/src/modules/catalog/full-template-preview.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$full$2d$template$2d$preview$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/apps/web/src/modules/catalog/full-template-preview.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$full$2d$template$2d$preview$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/apps/web/src/modules/catalog/template-gallery.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TemplateGallery",
    ()=>TemplateGallery
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const TemplateGallery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call TemplateGallery() from the server but TemplateGallery is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/modules/catalog/template-gallery.tsx", "TemplateGallery");
}),
"[project]/apps/web/src/modules/catalog/template-gallery.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$template$2d$gallery$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/apps/web/src/modules/catalog/template-gallery.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$modules$2f$catalog$2f$template$2d$gallery$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/apps/web/src/server/auth/crypto.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "digest",
    ()=>digest,
    "isOwnContact",
    ()=>isOwnContact,
    "randomToken",
    ()=>randomToken,
    "safeEqual",
    ()=>safeEqual,
    "verifyInitData",
    ()=>verifyInitData,
    "verifyMiniAppLaunch",
    ()=>verifyMiniAppLaunch
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
const randomToken = ()=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(32).toString("base64url");
const digest = (value)=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHash"])("sha256").update(value).digest("hex");
function safeEqual(a, b) {
    const left = Buffer.from(a), right = Buffer.from(b);
    return left.length === right.length && (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["timingSafeEqual"])(left, right);
}
function verifyInitData(raw, botToken, now = Date.now()) {
    if (!raw || raw.length > 16384) throw new Error("Invalid Telegram launch data");
    const params = new URLSearchParams(raw);
    const keys = [
        ...params.keys()
    ];
    if (new Set(keys).size !== keys.length) throw new Error("Duplicate Telegram fields");
    const hash = params.get("hash");
    if (!hash || !/^[a-f0-9]{64}$/i.test(hash)) throw new Error("Invalid Telegram signature");
    params.delete("hash");
    const checked = [
        ...params.entries()
    ].sort(([a], [b])=>a.localeCompare(b, "en")).map(([key, value])=>`${key}=${value}`).join("\n");
    const secret = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHmac"])("sha256", "WebAppData").update(botToken).digest();
    const expected = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHmac"])("sha256", secret).update(checked).digest("hex");
    if (!safeEqual(expected, hash.toLowerCase())) throw new Error("Invalid Telegram signature");
    const timestamp = Number(params.get("auth_date"));
    if (!Number.isInteger(timestamp) || timestamp * 1000 > now + 30000 || now - timestamp * 1000 > 300000) throw new Error("Telegram launch expired; reopen the Mini App");
    const user = JSON.parse(params.get("user") ?? "null");
    if (!user || !Number.isSafeInteger(user.id) || user.id <= 0 || typeof user.first_name !== "string") throw new Error("Telegram user missing");
    return user;
}
function verifyMiniAppLaunch(raw, botToken, now = Date.now()) {
    const user = verifyInitData(raw, botToken, now);
    const params = new URLSearchParams(raw);
    // Only construct this fingerprint after signature validation. URL ordering and
    // equivalent percent encodings do not change the verified signature or fields.
    const replayKey = digest(JSON.stringify([
        "telegram-miniapp:v1",
        digest(botToken),
        params.get("hash").toLowerCase(),
        params.get("auth_date"),
        String(user.id)
    ]));
    return {
        user,
        replayKey
    };
}
function isOwnContact(senderId, contact, forwarded = false) {
    if (forwarded || !Number.isSafeInteger(senderId) || senderId <= 0 || contact.user_id !== senderId || typeof contact.phone_number !== "string") return false;
    const digits = contact.phone_number.replace(/\D/g, "");
    return /^\+?\d[\d\s()-]*$/.test(contact.phone_number) && /^[1-9]\d{6,14}$/.test(digits);
}
}),
"[project]/apps/web/src/server/auth/index.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthError",
    ()=>AuthError,
    "BROWSER_COOKIE",
    ()=>BROWSER_COOKIE,
    "SESSION_COOKIE",
    ()=>SESSION_COOKIE,
    "authRoute",
    ()=>authRoute,
    "browserHash",
    ()=>browserHash,
    "cookieOptions",
    ()=>cookieOptions,
    "currentSession",
    ()=>currentSession,
    "getSessionUser",
    ()=>getSessionUser,
    "issueSession",
    ()=>issueSession,
    "json",
    ()=>json,
    "missingAuthConfig",
    ()=>missingAuthConfig,
    "readJson",
    ()=>readJson,
    "requireConfigured",
    ()=>requireConfigured,
    "requireUser",
    ()=>requireUser,
    "toSessionUser",
    ()=>toSessionUser,
    "uuid",
    ()=>uuid,
    "verifySameOrigin",
    ()=>verifySameOrigin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@24._a2f1860f1d2baa39b98152f5d917c6cc/node_modules/next/server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/index.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$server$2f$auth$2f$crypto$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/server/auth/crypto.ts [app-rsc] (ecmascript)");
;
;
;
;
const SESSION_COOKIE = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "taklifnoma_session";
const BROWSER_COOKIE = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "taklifnoma_auth_browser";
const DAY = 86400000;
class AuthError extends Error {
    code;
    status;
    constructor(code, message, status = 400){
        super(message), this.code = code, this.status = status;
    }
}
function missingAuthConfig() {
    const missing = [
        "DATABASE_URL",
        "APP_URL",
        "SESSION_SECRET",
        "TELEGRAM_BOT_TOKEN",
        "TELEGRAM_BOT_USERNAME",
        "TELEGRAM_WEBHOOK_SECRET"
    ].filter((key)=>!process.env[key]);
    if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length < 32) missing.push("SESSION_SECRET (minimum 32 characters)");
    if (process.env.APP_URL) {
        try {
            if (("TURBOPACK compile-time value", "development") === "production" && new URL(process.env.APP_URL).protocol !== "https:") //TURBOPACK unreachable
            ;
        } catch  {
            missing.push("APP_URL (valid absolute URL required)");
        }
    }
    return missing;
}
function requireConfigured() {
    const missing = missingAuthConfig();
    if (missing.length) throw new AuthError("NOT_CONFIGURED", "Authentication is not configured", 503);
}
function verifySameOrigin(request) {
    const expected = process.env.APP_URL;
    if (!expected) throw new AuthError("NOT_CONFIGURED", "APP_URL is not configured", 503);
    if (request.headers.get("origin") !== new URL(expected).origin) throw new AuthError("INVALID_ORIGIN", "Request origin is not allowed", 403);
}
const cookieOptions = (maxAge)=>({
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === "production",
        sameSite: "lax",
        path: "/",
        maxAge
    });
function toSessionUser(row) {
    return {
        id: String(row.id),
        telegramUserId: String(row.telegram_user_id),
        displayName: String(row.display_name),
        phoneShared: !!row.phone_shared_at,
        isAdmin: row.is_admin === true
    };
}
async function currentSession() {
    requireConfigured();
    const token = (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])()).get(SESSION_COOKIE)?.value;
    if (!token || token.length > 100) return null;
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDb"])()`SELECT s.id AS session_id, s.expires_at, s.absolute_expires_at, u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=${(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$server$2f$auth$2f$crypto$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["digest"])(token)} AND s.revoked_at IS NULL AND s.expires_at>now() AND s.absolute_expires_at>now() AND u.phone_shared_at IS NOT NULL`;
    return rows[0] ?? null;
}
async function getSessionUser() {
    const row = await currentSession();
    return row ? toSessionUser(row) : null;
}
async function requireUser() {
    const user = await getSessionUser();
    if (!user) throw new AuthError("UNAUTHORIZED", "Sign in with Telegram", 401);
    return user;
}
async function issueSession(userId) {
    const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$server$2f$auth$2f$crypto$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["randomToken"])();
    const agent = (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["headers"])()).get("user-agent")?.slice(0, 500) ?? "";
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDb"])()`INSERT INTO sessions(user_id,token_hash,user_agent,expires_at,absolute_expires_at) VALUES(${userId},${(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$server$2f$auth$2f$crypto$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["digest"])(token)},${agent},${new Date(Date.now() + 30 * DAY)},${new Date(Date.now() + 90 * DAY)})`;
    (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])()).set(SESSION_COOKIE, token, cookieOptions(30 * 86400));
}
async function browserHash() {
    const token = (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])()).get(BROWSER_COOKIE)?.value;
    if (!token || token.length > 100) throw new AuthError("INVALID_BROWSER", "Restart Telegram sign in", 403);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$server$2f$auth$2f$crypto$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["digest"])(token);
}
async function readJson(request) {
    const limit = 20000;
    if (Number(request.headers.get("content-length")) > limit) throw new AuthError("INVALID_INPUT", "Request too large", 413);
    if (!request.body) throw new AuthError("INVALID_INPUT", "Invalid JSON body");
    const reader = request.body.getReader(), chunks = [];
    let bytes = 0;
    try {
        while(true){
            const { done, value } = await reader.read();
            if (done) break;
            bytes += value.byteLength;
            if (bytes > limit) {
                await reader.cancel();
                throw new AuthError("INVALID_INPUT", "Request too large", 413);
            }
            chunks.push(value);
        }
    } finally{
        reader.releaseLock();
    }
    const raw = Buffer.concat(chunks, bytes).toString("utf8");
    try {
        const value = JSON.parse(raw);
        if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error();
        return value;
    } catch  {
        throw new AuthError("INVALID_INPUT", "Invalid JSON body");
    }
}
function uuid(value) {
    if (typeof value !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) throw new AuthError("INVALID_INPUT", "Invalid request identifier");
    return value;
}
async function authRoute(action) {
    try {
        return await action();
    } catch (error) {
        const known = error instanceof AuthError;
        if (!known) console.error("Authentication backend unavailable", error instanceof Error ? error.name : "Error");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: {
                code: known ? error.code : "SERVICE_UNAVAILABLE",
                message: known ? error.message : "Authentication is temporarily unavailable"
            }
        }, {
            status: known ? error.status : 503,
            headers: {
                "Cache-Control": "no-store"
            }
        });
    }
}
const json = (value, status = 200)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$24$2e$_a2f1860f1d2baa39b98152f5d917c6cc$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NextResponse"].json(value, {
        status,
        headers: {
            "Cache-Control": "no-store"
        }
    });
}),
"[project]/apps/web/src/server/catalog.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCatalog",
    ()=>getCatalog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/contracts/src/index.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/index.ts [app-rsc] (ecmascript)");
;
;
async function getCatalog(includeUnpublished = false) {
    if (!process.env.DATABASE_URL) return {
        templates: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TEMPLATES"].filter((item)=>includeUnpublished || item.published),
        categories: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TEMPLATE_CATEGORIES"],
        configured: false
    };
    const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDb"])();
    const [rows, categoryRows, assignments, eventSupport] = await Promise.all([
        db`SELECT id,name,published,price_minor,currency FROM templates ORDER BY id`,
        db`SELECT id,name,position FROM template_categories ORDER BY position,id`,
        db`SELECT a.template_id,a.category_id FROM template_category_assignments a JOIN template_categories c ON c.id=a.category_id ORDER BY c.position,c.id`,
        db`SELECT template_id,event_type FROM template_supported_event_types ORDER BY template_id,event_type`
    ]);
    return {
        templates: rows.flatMap((row)=>{
            const definition = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$contracts$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TEMPLATES"].find((item)=>item.id === row.id);
            return definition && (includeUnpublished || row.published) ? [
                {
                    ...definition,
                    name: row.name,
                    published: row.published,
                    priceMinor: Number(row.price_minor),
                    categoryIds: assignments.filter((assignment)=>assignment.template_id === row.id).map((assignment)=>String(assignment.category_id)),
                    supportedEventTypes: eventSupport.filter((support)=>support.template_id === row.id).map((support)=>support.event_type)
                }
            ] : [];
        }),
        categories: categoryRows.map((row)=>({
                id: String(row.id),
                name: String(row.name),
                position: Number(row.position)
            })),
        configured: true
    };
}
}),
"[project]/packages/contracts/src/index.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z .enum>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z .string>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z .literal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z .object>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z .array>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$record$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z .record>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$partialRecord$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z .partialRecord>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z .boolean>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z .number>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$preprocess$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z .preprocess>");
;
const LOCALES = [
    "uz-Latn",
    "uz-Cyrl",
    "en",
    "ru"
];
const localeSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum(LOCALES);
const EVENT_TYPES = [
    "wedding",
    "birthday",
    "osh",
    "qiz-bazmi",
    "other"
];
const eventTypeSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum(EVENT_TYPES);
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
const templateIdSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().min(1).max(64).regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/);
const invitationTemplateIdSchema = templateIdSchema.or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal(""));
const LANGUAGE_NAMES = {
    "uz-Latn": "Uz",
    "uz-Cyrl": "Уз",
    en: "En",
    ru: "Ru"
};
const short = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(300);
const text = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(10000);
const safeUrl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(2048).refine((v)=>!v || /^https?:\/\//i.test(v) || /^\/(?!\/)/.test(v), "Use an http(s) URL or local asset path");
const contentSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    title: short,
    people: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(short).max(20),
    hosts: short,
    greeting: short,
    personalGreeting: short,
    message: text,
    eventLabel: short,
    venueName: short,
    address: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(1000),
    landmark: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(1000),
    programHeading: short,
    programTitles: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$record$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(), short)
});
const localizedShortText = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$partialRecord$3e$__["z"].partialRecord(localeSchema, short);
const localizedLongText = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$partialRecord$3e$__["z"].partialRecord(localeSchema, text);
const dressCodeSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    enabled: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean().default(false),
    style: localizedShortText.default({}),
    text: localizedLongText.default({}),
    note: localizedLongText.default({}),
    colors: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().min(1).max(100),
        name: localizedShortText.default({}),
        hex: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^#[0-9a-f]{3,8}$/i)
    })).max(12).default([])
});
const storyChapterSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().min(1).max(100),
    title: localizedShortText.default({}),
    text: localizedLongText.default({})
});
const invitationSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    version: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal(1),
    revision: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().int().min(1).default(1),
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().min(1).max(100),
    templateId: invitationTemplateIdSchema,
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum([
        "draft",
        "published",
        "archived"
    ]),
    defaultLocale: localeSchema,
    enabledLocales: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(localeSchema).min(1).max(4),
    content: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$record$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(), contentSchema),
    eventType: eventTypeSchema,
    startsAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(50),
    timezone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(100),
    venue: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        latitude: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().min(-90).max(90).nullable(),
        longitude: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().min(-180).max(180).nullable(),
        mapUrl: safeUrl
    }),
    program: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(100),
        time: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(10)
    })).max(100),
    story: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(storyChapterSchema).max(20).default([]),
    gallery: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(100),
        url: safeUrl,
        alt: short,
        caption: short
    })).max(50),
    music: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        enabled: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
        assetId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(100).nullable(),
        url: safeUrl,
        filename: short
    }),
    gift: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        enabled: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
        receiptUploadEnabled: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
        cardNumber: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(30),
        cardHolder: short
    }),
    contacts: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$preprocess$3e$__["z"].preprocess((value)=>{
        if (!Array.isArray(value)) return value;
        const firstValue = (type)=>value.find((contact)=>typeof contact?.value === "string" && contact.type === type && contact.value.trim())?.value ?? "";
        return {
            phoneNumber: firstValue("phone"),
            telegramUsername: firstValue("telegram")
        };
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        phoneNumber: short,
        telegramUsername: short
    })),
    rsvp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        enabled: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
        deadline: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(50),
        maxPartySize: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().int().min(1).max(100)
    }),
    wishes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        enabled: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
        requireApproval: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$6$2e$7$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal(true)
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
"[project]/packages/database/src/index.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "closeDb",
    ()=>closeDb,
    "getDb",
    ()=>getDb
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$postgres$40$3$2e$4$2e$9$2f$node_modules$2f$postgres$2f$src$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/postgres@3.4.9/node_modules/postgres/src/index.js [app-rsc] (ecmascript)");
;
let sql;
function getDb() {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
    return sql ??= (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$postgres$40$3$2e$4$2e$9$2f$node_modules$2f$postgres$2f$src$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(process.env.DATABASE_URL, {
        max: 5,
        idle_timeout: 20,
        connect_timeout: 10,
        prepare: false
    });
}
async function closeDb() {
    if (sql) {
        await sql.end();
        sql = undefined;
    }
}
}),
]})(),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/perf_hooks [external] (perf_hooks, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("perf_hooks", () => require("perf_hooks"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[project]/apps/web/src/app/preview/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/web/src/app/preview/page.tsx [app-rsc] (ecmascript)"));
}),
"[project]/apps/web/src/app/preview/preview.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "backLink": "preview-module__bDhGwW__backLink",
  "galleryHeader": "preview-module__bDhGwW__galleryHeader",
  "galleryPage": "preview-module__bDhGwW__galleryPage",
});
}),
"[project]/apps/web/src/components/site-header.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "brand": "site-header-module__4E638a__brand",
  "catalog": "site-header-module__4E638a__catalog",
  "create": "site-header-module__4E638a__create",
  "dot": "site-header-module__4E638a__dot",
  "header": "site-header-module__4E638a__header",
  "inner": "site-header-module__4E638a__inner",
  "nav": "site-header-module__4E638a__nav",
});
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1p8ajud3qsdwq._.js.map