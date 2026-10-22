-- Register Green Gold for internal preview; keep it unselectable until release gates pass.
INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('green-gold', 'Green Gold', 15000000, 'UZS', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  published = false,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('green-gold', 'wedding') ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('green-gold', 'wedding') ON CONFLICT DO NOTHING;
