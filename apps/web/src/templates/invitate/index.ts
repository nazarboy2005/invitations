export { InvitateInvitation } from "./renderer";

export const INVITATE_TEMPLATE_IDS = ["evelina"] as const;

export function isInvitateTemplate(id: string): boolean {
  return (INVITATE_TEMPLATE_IDS as readonly string[]).includes(id);
}
