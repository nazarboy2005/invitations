-- Publish Chorlove Lace after source and authenticated lifecycle checks pass.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM template_category_assignments
    WHERE template_id = 'lace' AND category_id = 'wedding'
  ) OR NOT EXISTS (
    SELECT 1 FROM template_supported_event_types
    WHERE template_id = 'lace' AND event_type = 'wedding'
  ) THEN
    RAISE EXCEPTION 'Lace must remain wedding-category and wedding-only';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM templates
    WHERE id = 'lace' AND price_minor = 15000000 AND currency = 'UZS'
  ) THEN
    RAISE EXCEPTION 'Lace must be registered at 15,000,000 UZS before publication';
  END IF;
END $$;

UPDATE templates
SET published = true, updated_at = now()
WHERE id = 'lace';
