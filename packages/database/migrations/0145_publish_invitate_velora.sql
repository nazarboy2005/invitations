-- Publish Invitate Velora after its source and creator/public checks pass.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM template_category_assignments
    WHERE template_id = 'velora' AND category_id = 'wedding'
  ) OR NOT EXISTS (
    SELECT 1 FROM template_supported_event_types
    WHERE template_id = 'velora' AND event_type = 'wedding'
  ) THEN
    RAISE EXCEPTION 'Velora must remain wedding-category and wedding-only';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM templates WHERE id = 'velora') THEN
    RAISE EXCEPTION 'Velora must be registered before publication';
  END IF;
END $$;

UPDATE templates
SET published = true, updated_at = now()
WHERE id = 'velora';
