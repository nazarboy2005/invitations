-- Publish Orchid Amplop after its source and invitation lifecycle checks pass.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM template_category_assignments
    WHERE template_id = 'orchid-amplop' AND category_id = 'wedding'
  ) OR NOT EXISTS (
    SELECT 1 FROM template_supported_event_types
    WHERE template_id = 'orchid-amplop' AND event_type = 'wedding'
  ) THEN
    RAISE EXCEPTION 'Orchid Amplop must remain wedding-category and wedding-only';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM templates WHERE id = 'orchid-amplop') THEN
    RAISE EXCEPTION 'Orchid Amplop must be registered before publication';
  END IF;
END $$;

UPDATE templates
SET published = true, updated_at = now()
WHERE id = 'orchid-amplop';
