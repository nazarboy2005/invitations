export { TakliflaQogozErtagiInvitation } from "./renderer";
export { makeQogozPayload } from "./adapter";
export const qogozErtagiPackage = {
  id: "taklifla-qogoz-ertagi", name: "Qog‘oz Ertagi",
  description: "Qog‘oz manzaralar va ochiladigan ertak kitobi.",
  supportedEventTypes: ["wedding"], published: false, selectable: false,
} as const;
