/** Local aliases are interchangeable for development requests, never in production. */
export function allowedRequestOrigin(
  origin: string | null,
  expected: string,
  production: boolean,
): boolean {
  if (!origin) return false;
  try {
    const configured = new URL(expected);
    const actual = new URL(origin);
    // Origin headers must be serialized origins, without paths or credentials.
    if (origin !== actual.origin) return false;
    if (actual.origin === configured.origin) return true;
    if (production) return false;
    const loopback = new Set(["localhost", "127.0.0.1", "[::1]"]);
    return (
      loopback.has(configured.hostname) &&
      loopback.has(actual.hostname) &&
      actual.protocol === configured.protocol &&
      actual.port === configured.port
    );
  } catch {
    return false;
  }
}
