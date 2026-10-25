-- Publish Chorlove Palov after source, catalog, creator, and public checks pass.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM template_category_assignments
    WHERE template_id = 'palov' AND category_id = 'osh'
  ) OR NOT EXISTS (
    SELECT 1 FROM template_supported_event_types
    WHERE template_id = 'palov' AND event_type = 'osh'
  ) THEN
    RAISE EXCEPTION 'Chorlove Palov must remain categorized and supported for osh';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM templates WHERE id = 'palov') THEN
    RAISE EXCEPTION 'Chorlove Palov must be registered before publication';
  END IF;
END $$;

UPDATE templates
SET published = true, updated_at = now()
WHERE id = 'palov';
