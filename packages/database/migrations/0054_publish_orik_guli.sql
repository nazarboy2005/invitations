-- Publish O‘rik Guli after source, catalog, compatibility, and renderer checks.
INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('orik-guli', 'O‘rik Guli', 15000000, 'UZS', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  published = true,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('orik-guli', 'wedding')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES
  ('orik-guli', 'wedding'),
  ('orik-guli', 'fotiha'),
  ('orik-guli', 'qiz-uzatish')
ON CONFLICT DO NOTHING;
