ALTER TABLE template_supported_event_types
  DROP CONSTRAINT IF EXISTS template_supported_event_types_event_type_check;

ALTER TABLE template_supported_event_types
  ADD CONSTRAINT template_supported_event_types_event_type_check
  CHECK (event_type IN (
    'wedding', 'birthday', 'yubiley', 'osh', 'iftorlik', 'qiz-bazmi',
    'fotiha', 'qiz-uzatish', 'sunnat-toyi', 'beshik-toyi', 'bitiruv',
    'korporativ', 'yangi-uy', 'other'
  ));

INSERT INTO template_categories (id, name, position)
VALUES ('yangi-uy', 'Yangi uy', 6)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  updated_at = now();

INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('yangi-uy', 'Yangi Uy', 15000000, 'UZS', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('yangi-uy', 'yangi-uy')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('yangi-uy', 'yangi-uy'), ('yangi-uy', 'osh')
ON CONFLICT DO NOTHING;
