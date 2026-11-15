export async function servicesRequest(
  url: string,
  body?: unknown,
  method = "POST",
) {
  const response = await fetch(url, {
    cache: "no-store",
    ...(body === undefined
      ? {}
      : {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(
      [
        data.error?.message ?? "So‘rov bajarilmadi.",
        ...(data.error?.fields ?? []).map(
          (f: { path: string; message: string }) => `${f.path}: ${f.message}`,
        ),
      ].join(" "),
    );
  return data;
}
