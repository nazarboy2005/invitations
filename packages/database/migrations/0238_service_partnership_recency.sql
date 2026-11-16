-- Recover partnership activation times, rather than imported category positions.
WITH activations AS (
  SELECT s.slug, to_char(COALESCE((
    SELECT max(a.created_at) FROM admin_audit_log a
    WHERE a.target_id = s.slug
      AND a.action IN ('service.create','service.update','service.publish')
      AND a.new_values->>'featured' = 'true'
      AND COALESCE(a.previous_values->>'featured','false') <> 'true'
      AND a.created_at >= s.created_at
  ), s.created_at) AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS since
  FROM service_listings s
  WHERE s.draft->>'featured' = 'true' OR s.published->>'featured' = 'true'
)
UPDATE service_listings s SET
  draft = CASE WHEN s.draft->>'featured' = 'true'
    THEN jsonb_set(s.draft, '{featuredSince}', to_jsonb(a.since)) ELSE s.draft END,
  published = CASE WHEN s.published->>'featured' = 'true'
    THEN jsonb_set(s.published, '{featuredSince}', to_jsonb(a.since)) ELSE s.published END
FROM activations a WHERE a.slug = s.slug;

-- Own this metadata in storage so every writer follows the same lifecycle.
CREATE FUNCTION set_service_partnership_recency() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE since text;
BEGIN
  IF NEW.draft->>'featured' = 'true' THEN
    IF TG_OP = 'UPDATE' AND OLD.draft->>'featured' = 'true' THEN
      since := OLD.draft->>'featuredSince';
    END IF;
    since := COALESCE(since, to_char(clock_timestamp() AT TIME ZONE 'UTC',
      'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));
    NEW.draft := jsonb_set(NEW.draft, '{featuredSince}', to_jsonb(since));
  ELSE
    NEW.draft := NEW.draft - 'featuredSince';
  END IF;
  IF NEW.published->>'featured' = 'true' THEN
    IF since IS NULL AND TG_OP = 'UPDATE' AND OLD.published->>'featured' = 'true' THEN
      since := OLD.published->>'featuredSince';
    END IF;
    since := COALESCE(since, to_char(clock_timestamp() AT TIME ZONE 'UTC',
      'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));
    NEW.published := jsonb_set(NEW.published, '{featuredSince}', to_jsonb(since));
  ELSE
    NEW.published := NEW.published - 'featuredSince';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER service_partnership_recency
  BEFORE INSERT OR UPDATE OF draft, published ON service_listings
  FOR EACH ROW EXECUTE FUNCTION set_service_partnership_recency();
