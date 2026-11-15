import { readFile } from "node:fs/promises";
import { webUrl } from "./core.mjs";

export async function readOverrides(file) {
  let data;
  try {
    data = JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw new Error(`Invalid review file: ${error.message}`);
  }
  const overrides = data?.overrides;
  if (!overrides || typeof overrides !== "object" || Array.isArray(overrides))
    throw new Error("review.json needs an overrides object.");
  const allowed = [
    "name",
    "address",
    "description",
    "phones",
    "links",
    "emails",
    "hours",
    "categories",
    "location",
  ];
  for (const [field, value] of Object.entries(overrides)) {
    if (!allowed.includes(field))
      throw new Error(`Unsupported review field: ${field}`);
    if (
      ["name", "address", "description", "hours"].includes(field) &&
      typeof value !== "string"
    )
      throw new Error(`Review ${field} must be text.`);
    if (
      ["phones", "emails", "categories"].includes(field) &&
      (!Array.isArray(value) || value.some((x) => typeof x !== "string"))
    )
      throw new Error(`Review ${field} must be an array of strings.`);
    if (
      field === "links" &&
      (!Array.isArray(value) ||
        value.some((x) => !x || !webUrl(x.url) || typeof x.type !== "string"))
    )
      throw new Error("Review links need a public HTTP(S) URL and a type.");
    if (
      field === "location" &&
      value !== null &&
      (!value ||
        !Number.isFinite(value.lat) ||
        !Number.isFinite(value.lng) ||
        Math.abs(value.lat) > 90 ||
        Math.abs(value.lng) > 180)
    )
      throw new Error("Review location needs valid lat/lng coordinates.");
  }
  return overrides;
}
