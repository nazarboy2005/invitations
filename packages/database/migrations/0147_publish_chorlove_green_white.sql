-- Publish Chorlove Green White after its source and integration checks pass.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM template_category_assignments
    WHERE template_id = 'green-white' AND category_id = 'wedding'
  ) OR NOT EXISTS (
    SELECT 1 FROM template_supported_event_types
    WHERE template_id = 'green-white' AND event_type = 'wedding'
  ) THEN
    RAISE EXCEPTION 'Green White must remain wedding-category and wedding-only';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM templates WHERE id = 'green-white') THEN
    RAISE EXCEPTION 'Green White must be registered before publication';
  END IF;
END $$;

UPDATE templates
SET published = true, updated_at = now()
WHERE id = 'green-white';
