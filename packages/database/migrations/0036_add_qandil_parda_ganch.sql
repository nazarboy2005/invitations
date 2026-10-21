INSERT INTO templates (id, name, price_minor, currency, published)
VALUES
  ('qandil', 'Qandil', 15000000, 'UZS', false),
  ('parda', 'Parda', 15000000, 'UZS', false),
  ('ganch', 'Ganch', 15000000, 'UZS', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES
  ('qandil', 'wedding'),
  ('parda', 'wedding'),
  ('ganch', 'wedding')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES
  ('qandil', 'wedding'),
  ('qandil', 'fotiha'),
  ('qandil', 'qiz-uzatish'),
  ('parda', 'wedding'),
  ('parda', 'fotiha'),
  ('parda', 'qiz-uzatish'),
  ('ganch', 'wedding'),
  ('ganch', 'fotiha'),
  ('ganch', 'qiz-bazmi')
ON CONFLICT DO NOTHING;
