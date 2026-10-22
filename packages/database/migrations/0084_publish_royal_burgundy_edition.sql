-- Publish Velvet Royale after source, renderer, visual, and shared backend gates pass.
INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('royal-burgundy-edition', 'Velvet Royale', 15000000, 'UZS', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  published = true,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('royal-burgundy-edition', 'wedding')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('royal-burgundy-edition', 'wedding')
ON CONFLICT DO NOTHING;
