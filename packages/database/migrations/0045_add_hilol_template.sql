INSERT INTO template_categories (id, name, position)
VALUES ('iftorlik', 'Iftorlik', 5)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  updated_at = now();

INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('hilol', 'Hilol', 15000000, 'UZS', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('hilol', 'iftorlik')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('hilol', 'iftorlik'), ('hilol', 'osh')
ON CONFLICT DO NOTHING;
