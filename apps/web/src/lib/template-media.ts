import media from "../generated/template-media.json";

const optimized = media as Record<string, { url: string }>;

/** Exact packaged files only. Never rewrite uploaded media or arbitrary URLs. */
export function optimizedTemplateMedia(pathname: string): string | undefined {
  return optimized[pathname]?.url;
}
