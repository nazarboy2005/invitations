import type { NextConfig } from "next";
import { HTML_LIMITED_BOT_UA_RE } from "next/dist/shared/lib/router/utils/html-bots";
import { preparePublicAssets } from "./scripts/prepare-public-assets.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const publicAssets = preparePublicAssets();
const appRoot = path.dirname(fileURLToPath(import.meta.url));
const pdfRequire = createRequire(
  createRequire(import.meta.url).resolve("pdf-lib"),
);
const pdfWorkerFiles = [
  "./src/server/pdf-receipt-worker.cjs",
  ...[
    "pdf-lib",
    "@pdf-lib/standard-fonts",
    "@pdf-lib/upng",
    "pako",
    "tslib",
  ].map(
    (name) =>
      path
        .relative(
          appRoot,
          path.dirname(
            pdfRequire.resolve(
              name === "tslib" ? name : `${name}/package.json`,
            ),
          ),
        )
        .split(path.sep)
        .join("/") + "/**",
  ),
];
const config: NextConfig = {
  // Keep Next's defaults and include Telegram, whose crawler needs metadata in <head>.
  htmlLimitedBots: new RegExp(
    `${HTML_LIMITED_BOT_UA_RE.source}|TelegramBot`,
    "i",
  ),
  distDir: process.env.TAKLIFNOMA_BUILD_DIST_DIR ?? ".next",
  transpilePackages: ["@taklifnoma/contracts", "@taklifnoma/database"],
  poweredByHeader: false,
  // Optimize only bundled raster artwork, never uploads, SVGs or API responses.
  images: {
    localPatterns: ["png", "jpg", "jpeg", "webp", "avif", "gif"].flatMap(
      (extension) =>
        ["/images", `/_assets/${publicAssets.version}/images`].map((root) => ({
          pathname: `${root}/**/*.${extension}`,
          search: "",
        })),
    ),
    remotePatterns: [],
    dangerouslyAllowSVG: false,
    maximumRedirects: 0,
  },
  // URLs can contain guest/login tokens; fetch paths can contain bot tokens.
  // Also prevent automatic logging of Server Function arguments/browser data.
  logging: false,
  serverExternalPackages: [
    "playwright",
    "playwright-core",
    "@sparticuz/chromium",
    "sharp",
  ],
  outputFileTracingIncludes: {
    "/api/public/invitations/*/receipts": pdfWorkerFiles,
    "/api/static-images/preview": [
      "./src/templates/oq-atirgul/assets/**",
      "./src/templates/zumrad-naqsh/assets/**",
      "./src/templates/lola-maktubi/assets/**",
      "./src/templates/moviy-ravoq/assets/**",
      "./src/templates/zarhal-oqshom-card/assets/**",
      "./src/templates/sahar-ifori/assets/**",
      "./node_modules/@sparticuz/chromium/bin/**",
      "./node_modules/playwright-core/**",
    ],
    "/api/invitations/*/image": [
      "./src/templates/oq-atirgul/assets/**",
      "./src/templates/zumrad-naqsh/assets/**",
      "./src/templates/lola-maktubi/assets/**",
      "./src/templates/moviy-ravoq/assets/**",
      "./src/templates/zarhal-oqshom-card/assets/**",
      "./src/templates/sahar-ifori/assets/**",
      "./node_modules/@sparticuz/chromium/bin/**",
      "./node_modules/playwright-core/**",
    ],
  },
  async rewrites() {
    // Production asset routing is pinned to the build's revision. Development
    // callers use original public URLs and do not depend on these rules.
    return ["images", "audio", "music", "templates"].map((root) => ({
      source: `/_assets/${publicAssets.version}/${root}/:path*`,
      destination: `/${root}/:path*`,
    }));
  },
  async headers() {
    return [
      {
        source: "/share/templates/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          ...(process.env.NODE_ENV === "production"
            ? [{ key: "Strict-Transport-Security", value: "max-age=31536000" }]
            : []),
        ],
      },
    ];
  },
};
export default config;
