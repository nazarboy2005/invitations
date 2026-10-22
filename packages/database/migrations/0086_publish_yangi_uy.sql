-- Publish Yangi Uy after source adaptation, authentic preview provenance, browser QA, and integration gates pass.
INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('yangi-uy', 'Yangi Uy', 15000000, 'UZS', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  published = true,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('yangi-uy', 'yangi-uy')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES
  ('yangi-uy', 'yangi-uy'),
  ('yangi-uy', 'osh')
ON CONFLICT DO NOTHING;
