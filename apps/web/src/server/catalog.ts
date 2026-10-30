import {
  TEMPLATES,
  TEMPLATE_CATEGORIES,
  publicTemplateName,
  type TemplateDefinition,
  type TemplateCategory,
} from "@taklifnoma/contracts";
import { getDb } from "@taklifnoma/database";

let catalogFallbackWarningLogged = false;

function localCatalog(includeUnpublished: boolean) {
  return {
    templates: TEMPLATES.filter(
      (item) => includeUnpublished || item.published,
    ),
    categories: TEMPLATE_CATEGORIES,
  };
}

/** Anonymous aggregate only; never expose creator details or draft counts. */
export async function getPublishedInvitationCount(): Promise<number | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const [row] =
      await getDb()`SELECT count(*)::int AS total FROM invitations WHERE status='published'`;
    return Number(row.total);
  } catch {
    return null;
  }
}

export async function getCatalog(includeUnpublished = false): Promise<{
  templates: TemplateDefinition[];
  categories: TemplateCategory[];
  configured: boolean;
}> {
  if (!process.env.DATABASE_URL)
    return {
      ...localCatalog(includeUnpublished),
      configured: false,
    };
  try {
    const db = getDb();
    const [rows, categoryRows, assignments, eventSupport] = await Promise.all([
      db`SELECT id,name,published,price_minor,currency FROM templates ORDER BY id`,
      db`SELECT id,name,position FROM template_categories ORDER BY position,id`,
      db`SELECT a.template_id,a.category_id FROM template_category_assignments a JOIN template_categories c ON c.id=a.category_id ORDER BY c.position,c.id`,
      db`SELECT template_id,event_type FROM template_supported_event_types ORDER BY template_id,event_type`,
    ]);
    catalogFallbackWarningLogged = false;
    return {
      templates: rows.flatMap((row) => {
        const definition = TEMPLATES.find((item) => item.id === row.id);
        return definition && (includeUnpublished || row.published)
          ? [
              {
                ...definition,
                name: publicTemplateName(row.name),
                published: row.published,
                priceMinor: Number(row.price_minor),
                categoryIds: assignments
                  .filter((assignment) => assignment.template_id === row.id)
                  .map((assignment) => String(assignment.category_id)),
                supportedEventTypes: eventSupport
                  .filter((support) => support.template_id === row.id)
                  .map(
                    (support) =>
                      support.event_type as TemplateDefinition["supportedEventTypes"][number],
                  ),
              },
            ]
          : [];
      }),
      categories: categoryRows.map((row) => ({
        id: String(row.id),
        name: String(row.name),
        position: Number(row.position),
      })),
      configured: true,
    };
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String(error.code)
        : "UNKNOWN_ERROR";
    if (!catalogFallbackWarningLogged)
      console.warn(
        `Catalog database unavailable (${code}); using local catalog.`,
      );
    catalogFallbackWarningLogged = true;
    return { ...localCatalog(includeUnpublished), configured: false };
  }
}
