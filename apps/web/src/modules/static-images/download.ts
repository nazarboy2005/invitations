import type { Invitation, Locale } from "@taklifnoma/contracts";
import { invitationImageFilename } from "./filename";
export async function downloadInvitationImage(
  invitation: Invitation,
  locale: Locale,
  request: typeof fetch = fetch,
) {
  const response = await request(
    `/api/invitations/${encodeURIComponent(invitation.id)}/image`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ revision: invitation.revision, locale }),
    },
  );
  if (!response.ok)
    throw new Error(
      (await response.json()).error?.message || "Rasm yuklab olinmadi.",
    );
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  const encodedName = response.headers
    .get("Content-Disposition")
    ?.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  link.download = encodedName
    ? decodeURIComponent(encodedName)
    : invitationImageFilename(invitation, locale);
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
  return response.headers.get("X-Image-Exported-At") || undefined;
}
