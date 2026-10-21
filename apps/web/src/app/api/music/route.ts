import { NextResponse } from "next/server";
import { getDb } from "@taklifnoma/database";
import { apiError, privateHeaders } from "@/server/api";

export async function GET() {
  try {
    const tracks = await getDb()`
      SELECT t.id, a.id AS asset_id, a.url, t.title
      FROM catalog_music_tracks t
      JOIN media_assets a ON a.id=t.asset_id
      WHERE t.active=true AND a.status='ready'
      ORDER BY t.position, t.created_at, t.id`;
    return NextResponse.json(
      {
        tracks: tracks.map((track) => ({
          id: track.id,
          assetId: track.asset_id,
          url: track.url,
          filename: track.title,
        })),
      },
      { headers: privateHeaders },
    );
  } catch (error) {
    return apiError(error);
  }
}
