-- Register Golden Card as unavailable until its individual release gates pass.
INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('golden-card', 'Golden Card', 15000000, 'UZS', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  published = false,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('golden-card', 'wedding') ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('golden-card', 'wedding') ON CONFLICT DO NOTHING;
