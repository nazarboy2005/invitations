-- Publish Invitate Fairy after its source and creator/public checks pass.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM template_category_assignments
    WHERE template_id = 'fairy' AND category_id = 'wedding'
  ) OR NOT EXISTS (
    SELECT 1 FROM template_supported_event_types
    WHERE template_id = 'fairy' AND event_type = 'wedding'
  ) THEN
    RAISE EXCEPTION 'Fairy must remain wedding-category and wedding-only';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM templates WHERE id = 'fairy') THEN
    RAISE EXCEPTION 'Fairy must be registered before publication';
  END IF;
END $$;

UPDATE templates
SET published = true, updated_at = now()
WHERE id = 'fairy';
