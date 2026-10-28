-- Align the published catalog row with Zarhal Sahifa's approved 150,000 UZS price.
UPDATE templates
SET price_minor = 150000,
    currency = 'UZS',
    updated_at = now()
WHERE id = 'taklifla-zarhal-sahifa';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM templates
    WHERE id = 'taklifla-zarhal-sahifa'
      AND published = true
      AND price_minor = 150000
      AND currency = 'UZS'
  ) THEN
    RAISE EXCEPTION 'Zarhal Sahifa must be published at 150,000 UZS';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM template_category_assignments
    WHERE template_id = 'taklifla-zarhal-sahifa' AND category_id = 'wedding'
  ) OR NOT EXISTS (
    SELECT 1 FROM template_supported_event_types
    WHERE template_id = 'taklifla-zarhal-sahifa' AND event_type = 'wedding'
  ) THEN
    RAISE EXCEPTION 'Zarhal Sahifa must remain wedding-category and wedding-only';
  END IF;
END $$;
