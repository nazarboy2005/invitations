// Dashboard and payment cards use catalog artwork. Never parse input, access the
// database or start a browser at this retired URL, including for older clients.
export function POST() {
  return Response.json(
    {
      error: {
        code: "COVER_GENERATION_REMOVED",
        message: "Muqovalar katalogdan olinadi.",
      },
    },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
