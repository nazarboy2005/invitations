-- Add the three source-complete wedding designs privately; preserve all other rows.
INSERT INTO templates (id, name, price_minor, currency, published)
VALUES
  ('stained-glass', 'Stained Glass', 15000000, 'UZS', false),
  ('sunset', 'Sunset', 15000000, 'UZS', false),
  ('swan-garden', 'Swan Garden', 15000000, 'UZS', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('stained-glass','wedding'), ('sunset','wedding'), ('swan-garden','wedding')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('stained-glass','wedding'), ('sunset','wedding'), ('swan-garden','wedding')
ON CONFLICT DO NOTHING;
