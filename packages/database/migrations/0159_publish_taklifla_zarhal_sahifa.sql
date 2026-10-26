-- Publish Zarhal Sahifa after source, route, and lifecycle checks pass.
INSERT INTO templates (id, name, published, price_minor, currency)
VALUES ('taklifla-zarhal-sahifa', 'Zarhal Sahifa', false, 150000, 'UZS')
ON CONFLICT (id) DO NOTHING;

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('taklifla-zarhal-sahifa', 'wedding')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('taklifla-zarhal-sahifa', 'wedding')
ON CONFLICT DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM templates
    WHERE id = 'taklifla-zarhal-sahifa'
      AND name = 'Zarhal Sahifa'
      AND price_minor = 150000
      AND currency = 'UZS'
  ) THEN
    RAISE EXCEPTION 'Zarhal Sahifa catalog registration does not match its approved release';
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

UPDATE templates
SET published = true, updated_at = now()
WHERE id = 'taklifla-zarhal-sahifa';
