-- Publish Palace Rose after source and creator/public lifecycle checks pass.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM template_category_assignments
    WHERE template_id = 'palace-rose' AND category_id = 'wedding'
  ) OR NOT EXISTS (
    SELECT 1 FROM template_supported_event_types
    WHERE template_id = 'palace-rose' AND event_type = 'wedding'
  ) THEN
    RAISE EXCEPTION 'Palace Rose must remain wedding-category and wedding-only';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM templates WHERE id = 'palace-rose') THEN
    RAISE EXCEPTION 'Palace Rose must be registered before publication';
  END IF;
END $$;

UPDATE templates
SET published = true, updated_at = now()
WHERE id = 'palace-rose';
