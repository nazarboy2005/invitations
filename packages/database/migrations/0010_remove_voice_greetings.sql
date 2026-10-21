WITH legacy_voice_assets AS (
 SELECT DISTINCT data->'voiceMessage'->>'assetId' AS asset_id
 FROM invitations
 WHERE data ? 'voiceMessage'
   AND COALESCE(data->'voiceMessage'->>'assetId', '') <> ''
)
DELETE FROM media_assets AS asset
USING legacy_voice_assets AS voice
WHERE asset.id::text=voice.asset_id
  AND NOT EXISTS (
    SELECT 1 FROM catalog_music_tracks AS track WHERE track.asset_id=asset.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM invitations AS invitation
    WHERE invitation.data->'music'->>'assetId'=voice.asset_id
       OR EXISTS (
         SELECT 1 FROM jsonb_array_elements(
           COALESCE(invitation.data->'gallery', '[]'::jsonb)
         ) AS image
         WHERE image->>'id'=voice.asset_id
       )
  );

UPDATE invitations
SET data=data-'voiceMessage', updated_at=now()
WHERE data ? 'voiceMessage';
