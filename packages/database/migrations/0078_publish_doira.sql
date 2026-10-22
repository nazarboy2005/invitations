-- Publish Doira after source, artwork provenance, contract, and integration checks.
INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('doira', 'Doira', 15000000, 'UZS', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  published = true,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('doira', 'wedding')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('doira', 'wedding'), ('doira', 'sunnat-toyi')
ON CONFLICT DO NOTHING;
