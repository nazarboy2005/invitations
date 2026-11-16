export const SERVICE_PHOTO_WIDTHS = [320, 640, 960, 1280, 1600] as const;

/** Public photos always pass through a live listing/existence check. */
export function servicePhotoUrl(slug: string, src: string, width?: number) {
  const query = new URLSearchParams({ src });
  if (width !== undefined) {
    const selected = SERVICE_PHOTO_WIDTHS.find((size) => size >= width) ?? 1600;
    query.set("w", String(selected));
  }
  return `/api/services/photos/${encodeURIComponent(slug)}?${query}`;
}
