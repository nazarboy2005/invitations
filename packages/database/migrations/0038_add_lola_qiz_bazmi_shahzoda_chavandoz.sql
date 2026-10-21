INSERT INTO templates (id, name, price_minor, currency, published)
VALUES
  ('lola', 'Lola', 15000000, 'UZS', false),
  ('qiz-bazmi', 'Qiz Bazmi', 15000000, 'UZS', false),
  ('shahzoda', 'Shahzoda', 15000000, 'UZS', false),
  ('chavandoz', 'Chavandoz', 15000000, 'UZS', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES
  ('lola', 'qiz-bazmi'),
  ('qiz-bazmi', 'qiz-bazmi'),
  ('shahzoda', 'other'),
  ('chavandoz', 'other')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES
  ('lola', 'qiz-uzatish'),
  ('lola', 'fotiha'),
  ('qiz-bazmi', 'qiz-uzatish'),
  ('qiz-bazmi', 'fotiha'),
  ('qiz-bazmi', 'birthday'),
  ('shahzoda', 'sunnat-toyi'),
  ('chavandoz', 'sunnat-toyi'),
  ('chavandoz', 'birthday')
ON CONFLICT DO NOTHING;
