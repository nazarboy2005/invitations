INSERT INTO templates (id, name, price_minor, currency, published)
VALUES
  ('suzani', 'Suzani', 15000000, 'UZS', false),
  ('orik-guli', 'O‘rik Guli', 15000000, 'UZS', false),
  ('paxta', 'Paxta', 15000000, 'UZS', false),
  ('sahro-fonusi', 'Sahro Fonusi', 15000000, 'UZS', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES
  ('suzani', 'wedding'),
  ('orik-guli', 'wedding'),
  ('paxta', 'wedding'),
  ('sahro-fonusi', 'wedding')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES
  ('suzani', 'wedding'),
  ('orik-guli', 'wedding'),
  ('paxta', 'wedding'),
  ('sahro-fonusi', 'wedding')
ON CONFLICT DO NOTHING;
