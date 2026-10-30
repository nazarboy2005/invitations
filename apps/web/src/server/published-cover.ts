import { getDb } from "@taklifnoma/database";
import { publicationCoverSignature } from "./cover-publication-auth";

// Called after publication commits. Use the cover function over HTTP so payment
// and publication deployments do not each bundle/launch a Chromium runtime.
export async function preparePublishedCover(input: {
  invitationId?: string;
  orderId?: string;
}) {
  try {
    const [row] = await getDb()`SELECT i.id FROM invitations i
      WHERE i.status='published' AND
      (i.id::text=${input.invitationId ?? ""} OR EXISTS (
        SELECT 1 FROM payment_orders p WHERE p.invitation_id=i.id AND p.id::text=${input.orderId ?? ""}
      )) LIMIT 1`;
    if (!row) return;
    const until = Date.now() + 50000;
    do {
      const response = await fetch(
        new URL("/api/invitation-covers", process.env.APP_URL),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Publication-Cover": publicationCoverSignature(
              row.id,
              Date.now() + 60000,
            ),
          },
          body: JSON.stringify({ id: row.id }),
          signal: AbortSignal.timeout(Math.max(1, until - Date.now())),
        },
      );
      await response.arrayBuffer();
      if (response.ok) return;
      if (response.status !== 429 || Date.now() + 3000 >= until) break;
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } while (Date.now() < until);
    console.error(
      "Published cover preparation unavailable; dashboard can retry",
    );
  } catch {
    console.error("Published cover preparation failed; dashboard can retry");
  }
}
