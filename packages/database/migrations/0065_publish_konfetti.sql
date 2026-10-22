-- Publish Konfetti after its captured source, shared contract, catalog art, and release checks pass.
INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('konfetti', 'Konfetti', 15000000, 'UZS', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  published = true,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('konfetti', 'birthday')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES
  ('konfetti', 'birthday'),
  ('konfetti', 'yubiley')
ON CONFLICT DO NOTHING;
