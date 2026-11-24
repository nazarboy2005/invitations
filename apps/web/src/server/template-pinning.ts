import type { TransactionSql } from "postgres";

/** Caller holds the template lock and records this change in the same transaction. */
export async function updateTemplatePin(
  tx: TransactionSql,
  templateId: string,
  pinned: boolean,
): Promise<string | null> {
  const [row] = await tx`
    UPDATE templates SET pinned_order = CASE WHEN ${pinned}
      THEN COALESCE(pinned_order, nextval('template_pin_order_seq'))
      ELSE NULL END, updated_at = now()
    WHERE id = ${templateId}
    RETURNING pinned_order::text
  `;
  return row.pinned_order ?? null;
}
