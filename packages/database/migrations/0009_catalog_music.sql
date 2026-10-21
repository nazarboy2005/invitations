CREATE TABLE catalog_music_tracks (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 asset_id uuid NOT NULL UNIQUE REFERENCES media_assets(id),
 title text NOT NULL CHECK (length(title) BETWEEN 1 AND 160),
 active boolean NOT NULL DEFAULT true,
 position integer NOT NULL DEFAULT 0 CHECK (position >= 0),
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX catalog_music_active_idx ON catalog_music_tracks(active, position, created_at);
