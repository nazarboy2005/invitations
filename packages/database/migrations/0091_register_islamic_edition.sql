-- Register the exact E-invitation Islamic Edition design without publishing it.
INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('islamic-edition', 'Islamic Edition', 15000000, 'UZS', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('islamic-edition', 'wedding')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('islamic-edition', 'wedding')
ON CONFLICT DO NOTHING;
