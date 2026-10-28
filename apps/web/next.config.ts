import type { NextConfig } from "next";
import { HTML_LIMITED_BOT_UA_RE } from "next/dist/shared/lib/router/utils/html-bots";
const config: NextConfig = {
  // Keep Next's defaults and include Telegram, whose crawler needs metadata in <head>.
  htmlLimitedBots: new RegExp(
    `${HTML_LIMITED_BOT_UA_RE.source}|TelegramBot`,
    "i",
  ),
  distDir: process.env.TAKLIFNOMA_BUILD_DIST_DIR ?? ".next",
  transpilePackages: ["@taklifnoma/contracts", "@taklifnoma/database"],
  poweredByHeader: false,
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
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};
export default config;
