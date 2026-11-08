import aliases from "./template-asset-aliases.json" with { type: "json" };

const paths = Object.entries(aliases).sort(([a], [b]) => b.length - a.length);

/** Keep old same-origin asset bookmarks usable after canonical package moves. */
export function canonicalTemplateAssetPath(pathname) {
  for (const [previous, current] of paths) {
    const prefix = `/templates/${previous}`;
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      return `/templates/${current}${pathname.slice(prefix.length)}`;
    }
  }
  return pathname;
}
