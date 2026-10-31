import { version } from "../generated/public-asset-version.json";

export const publicAssetPrefix = `/_assets/${version}`;

/** For packaged public files only. API, external and creator-media URLs pass through. */
export function publicAsset(url: string): string {
  // Next dev hot-reloads callers independently of startup configuration. Use
  // original files so refreshes and asset edits never depend on a build revision.
  if (process.env.NODE_ENV === "development") return url;
  return /^\/(?:images|audio|music|templates)\//.test(url)
    ? publicAssetPrefix + url
    : url;
}

/** Same-origin template frames only, including their versioned entry documents. */
export function isTemplateDocument(address: string, origin: string): boolean {
  try {
    const url = new URL(address);
    return (
      url.origin === origin &&
      (url.pathname.startsWith("/templates/") ||
        url.pathname.startsWith(publicAssetPrefix + "/templates/"))
    );
  } catch {
    return false;
  }
}
