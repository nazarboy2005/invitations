-- Keep the source-backed template hidden until its release gates pass.
INSERT INTO templates (id, name, price_minor, currency, published)
VALUES (
  'oltin-darvoza-ortidagi-baxt',
  'Oltin darvoza ortidagi baxt',
  15000000,
  'UZS',
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  published = false,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('oltin-darvoza-ortidagi-baxt', 'wedding') ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('oltin-darvoza-ortidagi-baxt', 'wedding') ON CONFLICT DO NOTHING;
