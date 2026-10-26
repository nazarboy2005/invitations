-- Publish Love Sakura after source, renderer, and lifecycle release checks pass.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM template_category_assignments
    WHERE template_id = 'love-sakura' AND category_id = 'wedding'
  ) OR NOT EXISTS (
    SELECT 1 FROM template_supported_event_types
    WHERE template_id = 'love-sakura' AND event_type = 'wedding'
  ) THEN
    RAISE EXCEPTION 'Love Sakura must remain wedding-category and wedding-only';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM templates WHERE id = 'love-sakura') THEN
    RAISE EXCEPTION 'Love Sakura must be registered before publication';
  END IF;
END $$;

UPDATE templates
SET published = true, updated_at = now()
WHERE id = 'love-sakura';
