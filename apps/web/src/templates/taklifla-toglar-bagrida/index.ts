export { ToglarBagridaInvitation } from "./renderer";
export { makeMountainPayload } from "./adapter";

/** Package metadata; the shared catalog/database own availability. */
export const mountainPackage = {
  id: "taklifla-toglar-bagrida",
  name: "Tog‘lar bag‘rida",
  description: "Tog‘lar manzarasi, gul bezaklari va nafis naqshli to‘y taklifnomasi.",
  supportedEventTypes: ["wedding"],
  published: true,
  selectable: true,
} as const;
