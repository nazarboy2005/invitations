-- Publish Cloud Castle after source adaptation, authentic preview provenance, browser QA, and release gates pass.
INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('cloud-castle', 'Cloud Castle', 15000000, 'UZS', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_minor = EXCLUDED.price_minor,
  currency = EXCLUDED.currency,
  published = true,
  updated_at = now();

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('cloud-castle', 'wedding')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('cloud-castle', 'wedding')
ON CONFLICT DO NOTHING;
