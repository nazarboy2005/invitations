import { NextResponse } from "next/server";

export function GET() {
  const username = process.env.TELEGRAM_BOT_USERNAME?.replace(/^@/, "");
  if (!username) return NextResponse.json({ botUrl: null });
  return NextResponse.json(
    { botUrl: `https://t.me/${username}` },
    { headers: { "Cache-Control": "public, max-age=3600" } },
  );
}
