INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('korporativ', 'Korporativ', 15000000, 'UZS', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  updated_at = now();

-- Source category labels are catalog organization, independent of event types.
-- Use the existing general-purpose category until an administrator assigns
-- this design to an appropriate catalog category.
INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('korporativ', 'other')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES
  ('korporativ', 'korporativ'),
  ('korporativ', 'bitiruv'),
  ('korporativ', 'yubiley')
ON CONFLICT DO NOTHING;
