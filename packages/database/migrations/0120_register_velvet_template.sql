-- Register captured Invitate Velvet while source adaptation and release checks are reviewed.
INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('velvet', 'Velvet', 15000000, 'UZS', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('velvet', 'wedding')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('velvet', 'wedding')
ON CONFLICT DO NOTHING;
