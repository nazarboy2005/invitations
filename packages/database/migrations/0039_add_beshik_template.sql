ALTER TABLE template_supported_event_types
  DROP CONSTRAINT IF EXISTS template_supported_event_types_event_type_check;

ALTER TABLE template_supported_event_types
  ADD CONSTRAINT template_supported_event_types_event_type_check
  CHECK (event_type IN (
    'wedding', 'birthday', 'osh', 'qiz-bazmi', 'fotiha',
    'qiz-uzatish', 'sunnat-toyi', 'beshik-toyi', 'other'
  ));

INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('beshik', 'Beshik', 15000000, 'UZS', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('beshik', 'other')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES
  ('beshik', 'beshik-toyi'),
  ('beshik', 'birthday')
ON CONFLICT DO NOTHING;
