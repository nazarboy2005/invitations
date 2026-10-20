export { MarxabaInvitation } from "./renderer";

export const MARXABA_TEMPLATE_IDS = [
  "oltin-nur",
  "samarqand-kechasi",
  "bogi-eram",
  "atlas",
  "uchar-gilam",
  "oq-kabutar",
  "kuzgi-chinor",
  "muhabbat-kitobi",
  "sahifa",
  "oltin-uzuk",
] as const;

export function isMarxabaTemplate(id: string): boolean {
  return (MARXABA_TEMPLATE_IDS as readonly string[]).includes(id);
}
