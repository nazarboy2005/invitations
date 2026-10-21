ALTER TABLE template_supported_event_types
  DROP CONSTRAINT IF EXISTS template_supported_event_types_event_type_check;

ALTER TABLE template_supported_event_types
  ADD CONSTRAINT template_supported_event_types_event_type_check
  CHECK (event_type IN (
    'wedding', 'birthday', 'yubiley', 'osh', 'iftorlik', 'qiz-bazmi',
    'fotiha', 'qiz-uzatish', 'sunnat-toyi', 'beshik-toyi', 'bitiruv',
    'korporativ', 'other'
  ));

-- The source category is not a catalog category yet; keep it under the existing
-- Other category while preserving the independent source-backed event types.
INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('bitiruv', 'Bitiruv', 15000000, 'UZS', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('bitiruv', 'other')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES
  ('bitiruv', 'bitiruv'),
  ('bitiruv', 'birthday'),
  ('bitiruv', 'korporativ')
ON CONFLICT DO NOTHING;
