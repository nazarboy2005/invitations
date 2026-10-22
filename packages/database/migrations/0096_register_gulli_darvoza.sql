-- Keep Gulli darvoza out of the selectable catalog until its release checks pass.
INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('gulli-darvoza', 'Gulli darvoza', 15000000, 'UZS', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  published = false,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('gulli-darvoza', 'wedding') ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('gulli-darvoza', 'wedding') ON CONFLICT DO NOTHING;
