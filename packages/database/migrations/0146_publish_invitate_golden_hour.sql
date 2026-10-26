-- Publish Invitate Golden Hour after source, integration, and catalog checks.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM template_category_assignments
    WHERE template_id = 'golden-hour' AND category_id = 'birthday'
  ) OR NOT EXISTS (
    SELECT 1 FROM template_supported_event_types
    WHERE template_id = 'golden-hour' AND event_type = 'birthday'
  ) THEN
    RAISE EXCEPTION 'Golden Hour must remain birthday-category and birthday-only';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM templates WHERE id = 'golden-hour') THEN
    RAISE EXCEPTION 'Golden Hour must be registered before publication';
  END IF;
END $$;

UPDATE templates
SET published = true, updated_at = now()
WHERE id = 'golden-hour';
