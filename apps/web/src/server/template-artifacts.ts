/** Preserved captures are evidence, not additional runnable invitation pages. */
export function isPrivateTemplateArtifact(pathname: string): boolean {
  let path: string;
  try {
    path = decodeURIComponent(pathname);
  } catch {
    return true;
  }
  if (!path.startsWith("/templates/")) return false;
  if (path === "/templates/anor/source/index.html") return false;
  return (
    (/\/source\//.test(path) && /\.html?\/?$/i.test(path)) ||
    path === "/templates/invitate-wedding/assets/captured/5b73decb38ff5c8c.js" ||
    path === "/templates/taklifnomachi-1/source/templates/1/js/QJtgeIS73Tgv.js" ||
    path === "/templates/taklifnomachi-1/source/templates/1/js/Q362wQYV0bJ4.js"
  );
}
