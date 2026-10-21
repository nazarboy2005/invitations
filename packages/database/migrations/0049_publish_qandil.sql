-- Publish Qandil after its source, contract, and preview release checks pass.
ALTER TABLE template_supported_event_types
  DROP CONSTRAINT IF EXISTS template_supported_event_types_event_type_check;

ALTER TABLE template_supported_event_types
  ADD CONSTRAINT template_supported_event_types_event_type_check
  CHECK (event_type IN (
    'wedding', 'birthday', 'yubiley', 'osh', 'iftorlik', 'qiz-bazmi',
    'fotiha', 'qiz-uzatish', 'sunnat-toyi', 'beshik-toyi', 'bitiruv',
    'korporativ', 'yangi-uy', 'other'
  ));

INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('qandil', 'Qandil', 15000000, 'UZS', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  published = true,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('qandil', 'wedding')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES
  ('qandil', 'wedding'),
  ('qandil', 'fotiha'),
  ('qandil', 'qiz-uzatish')
ON CONFLICT DO NOTHING;
