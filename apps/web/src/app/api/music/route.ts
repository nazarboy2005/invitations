import { NextResponse } from "next/server";
import { getDb } from "@taklifnoma/database";
import { apiError, privateHeaders } from "@/server/api";
import { CLASSICAL_MUSIC } from "@/modules/studio/classical-music";

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
        tracks: [
          ...CLASSICAL_MUSIC.map((track) => ({ ...track, assetId: null })),
          ...tracks.map((track) => ({
            id: track.id,
            assetId: track.asset_id,
            url: track.url,
            filename: track.title,
            composer: "",
            performer: "",
            instrument: "",
            durationSeconds: null,
            license: "",
            attribution: "",
            sourceUrl: "",
            licenseUrl: "",
          })),
        ],
      },
      { headers: privateHeaders },
    );
  } catch (error) {
    return apiError(error);
  }
}
