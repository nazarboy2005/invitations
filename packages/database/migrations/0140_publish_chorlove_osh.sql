-- Publish Chorlove Osh after the creator-to-public lifecycle check passes.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM template_category_assignments
    WHERE template_id = 'osh' AND category_id = 'osh'
  ) OR NOT EXISTS (
    SELECT 1 FROM template_supported_event_types
    WHERE template_id = 'osh' AND event_type = 'osh'
  ) THEN
    RAISE EXCEPTION 'Chorlove Osh must remain categorized and supported for osh';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM templates WHERE id = 'osh') THEN
    RAISE EXCEPTION 'Chorlove Osh must be registered before publication';
  END IF;
END $$;

UPDATE templates
SET published = true, updated_at = now()
WHERE id = 'osh';
