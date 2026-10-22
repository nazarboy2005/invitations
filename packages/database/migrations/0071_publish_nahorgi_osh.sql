-- Publish Nahorgi Osh after its captured source and service integration pass.
INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('nahorgi-osh', 'Nahorgi Osh', 15000000, 'UZS', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  published = true,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('nahorgi-osh', 'osh')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES
  ('nahorgi-osh', 'osh'),
  ('nahorgi-osh', 'sunnat-toyi'),
  ('nahorgi-osh', 'wedding')
ON CONFLICT DO NOTHING;
