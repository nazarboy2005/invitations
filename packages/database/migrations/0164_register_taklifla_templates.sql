-- Keep the two fully sourced Taklifla candidates private until release verification completes.
INSERT INTO templates (id, name, published, price_minor, currency)
VALUES
  ('taklifla-asalari', 'Asalari', false, 150000, 'UZS'),
  ('taklifla-muhrli-maktub', 'Muhrli Maktub', false, 150000, 'UZS')
ON CONFLICT (id) DO NOTHING;

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('taklifla-asalari', 'birthday'), ('taklifla-muhrli-maktub', 'wedding')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('taklifla-asalari', 'birthday'), ('taklifla-muhrli-maktub', 'wedding')
ON CONFLICT DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM templates WHERE id = 'taklifla-asalari' AND name = 'Asalari'
      AND price_minor = 150000 AND currency = 'UZS' AND published = false
  ) OR NOT EXISTS (
    SELECT 1 FROM templates WHERE id = 'taklifla-muhrli-maktub' AND name = 'Muhrli Maktub'
      AND price_minor = 150000 AND currency = 'UZS' AND published = false
  ) THEN
    RAISE EXCEPTION 'Taklifla templates must be registered privately at 150000 UZS';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM template_category_assignments WHERE template_id='taklifla-asalari' AND category_id='birthday')
     OR NOT EXISTS (SELECT 1 FROM template_supported_event_types WHERE template_id='taklifla-asalari' AND event_type='birthday')
     OR NOT EXISTS (SELECT 1 FROM template_category_assignments WHERE template_id='taklifla-muhrli-maktub' AND category_id='wedding')
     OR NOT EXISTS (SELECT 1 FROM template_supported_event_types WHERE template_id='taklifla-muhrli-maktub' AND event_type='wedding') THEN
    RAISE EXCEPTION 'Taklifla category and event compatibility registration is incomplete';
  END IF;
END $$;
