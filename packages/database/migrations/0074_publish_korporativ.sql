-- Publish Korporativ after source, contract, and persistence checks.
-- The user explicitly waived browser-rendered QA for this release.
INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('korporativ', 'Korporativ', 15000000, 'UZS', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  published = true,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('korporativ', 'other')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES
  ('korporativ', 'korporativ'),
  ('korporativ', 'bitiruv'),
  ('korporativ', 'yubiley')
ON CONFLICT DO NOTHING;
