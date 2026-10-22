-- Register the exact E-invitation source ID Velvet Royale as unpublished.
INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('royal-burgundy-edition', 'Velvet Royale', 15000000, 'UZS', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  published = false,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('royal-burgundy-edition', 'wedding')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('royal-burgundy-edition', 'wedding')
ON CONFLICT DO NOTHING;
