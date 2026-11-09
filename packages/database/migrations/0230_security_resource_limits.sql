-- Bounded cleanup and per-account quotas; no changes to invitation/guest data.
CREATE INDEX IF NOT EXISTS media_assets_owner_usage_idx ON media_assets(owner_id,created_at);
CREATE INDEX IF NOT EXISTS media_assets_pending_cleanup_idx ON media_assets(created_at) WHERE status IN ('pending','rejected');
CREATE INDEX IF NOT EXISTS invitation_viewers_retention_idx ON invitation_viewers(last_viewed_at);
