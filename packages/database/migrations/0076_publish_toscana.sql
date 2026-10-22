-- Publish Toscana after source-art, browser, and backend integration checks.
INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('toscana', 'Toscana', 15000000, 'UZS', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  published = true,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('toscana', 'wedding')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('toscana', 'wedding'), ('toscana', 'fotiha')
ON CONFLICT DO NOTHING;
