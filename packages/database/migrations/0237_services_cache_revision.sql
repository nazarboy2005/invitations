-- All public writers (including scripts/workers) invalidate in the same transaction.
CREATE TABLE service_directory_cache_state (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  revision bigint NOT NULL DEFAULT 1
);
INSERT INTO service_directory_cache_state DEFAULT VALUES;

CREATE FUNCTION bump_service_directory_cache_revision() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.published IS NULL THEN RETURN NULL; END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.published IS NULL THEN RETURN NULL; END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.published IS NOT DISTINCT FROM NEW.published
       AND (NEW.published IS NULL OR OLD.position = NEW.position) THEN
      RETURN NULL;
    END IF;
  END IF;
  UPDATE service_directory_cache_state SET revision = revision + 1 WHERE singleton;
  RETURN NULL;
END;
$$;
CREATE TRIGGER service_directory_cache_write
  AFTER INSERT OR UPDATE OR DELETE ON service_listings
  FOR EACH ROW EXECUTE FUNCTION bump_service_directory_cache_revision();
CREATE TRIGGER service_directory_cache_truncate
  AFTER TRUNCATE ON service_listings
  FOR EACH STATEMENT EXECUTE FUNCTION bump_service_directory_cache_revision();
