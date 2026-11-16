export type ServiceCoordinates = { latitude: number; longitude: number };

export const CURRENT_LOCATION_REGION = "nearby";
export const CURRENT_LOCATION_LABEL = "Joriy joylashuvim";

export function validCoordinates(value: {
  latitude: number | null;
  longitude: number | null;
}): value is ServiceCoordinates {
  return (
    value.latitude !== null &&
    value.longitude !== null &&
    Number.isFinite(value.latitude) &&
    Number.isFinite(value.longitude) &&
    Math.abs(value.latitude) <= 90 &&
    Math.abs(value.longitude) <= 180
  );
}

/** Great-circle distance in meters; this is not a road route or travel time. */
export function serviceDistance(
  origin: ServiceCoordinates | null | undefined,
  destination: { latitude: number | null; longitude: number | null },
): number | null {
  if (!origin || !validCoordinates(origin) || !validCoordinates(destination))
    return null;
  const radians = Math.PI / 180;
  const latitude = (destination.latitude - origin.latitude) * radians;
  const longitude = (destination.longitude - origin.longitude) * radians;
  const a =
    Math.sin(latitude / 2) ** 2 +
    Math.cos(origin.latitude * radians) *
      Math.cos(destination.latitude * radians) *
      Math.sin(longitude / 2) ** 2;
  return 6_371_008.8 * 2 * Math.asin(Math.sqrt(Math.min(1, Math.max(0, a))));
}

export function formatServiceDistance(meters: number): string {
  // Switch at the rounded boundary so 999.9 m never displays as "1000 m".
  const rounded = Math.round(meters);
  return rounded < 1000
    ? `${rounded} m`
    : `${Number((meters / 1000).toFixed(2))} km`;
}
