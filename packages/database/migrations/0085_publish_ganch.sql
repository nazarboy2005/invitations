-- Publish Ganch after source adaptation, authentic preview provenance, browser QA, and integration gates pass.
INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('ganch', 'Ganch', 15000000, 'UZS', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  published = true,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('ganch', 'wedding')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES
  ('ganch', 'wedding'),
  ('ganch', 'fotiha'),
  ('ganch', 'qiz-bazmi')
ON CONFLICT DO NOTHING;
