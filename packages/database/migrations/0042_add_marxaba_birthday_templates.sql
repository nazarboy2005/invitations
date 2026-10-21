INSERT INTO templates (id, name, price_minor, currency, published)
VALUES
  ('konfetti', 'Konfetti', 15000000, 'UZS', false),
  ('oltin-kuz', 'Oltin Kuz', 15000000, 'UZS', false),
  ('oltin-yosh', 'Oltin Yosh', 15000000, 'UZS', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES
  ('konfetti', 'birthday'),
  ('oltin-kuz', 'birthday'),
  ('oltin-yosh', 'birthday')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES
  ('konfetti', 'birthday'),
  ('konfetti', 'yubiley'),
  ('oltin-kuz', 'birthday'),
  ('oltin-kuz', 'yubiley'),
  ('oltin-yosh', 'birthday'),
  ('oltin-yosh', 'yubiley')
ON CONFLICT DO NOTHING;
