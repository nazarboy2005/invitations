-- Restore the missing private catalog registration; this does not publish Fairy.
INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('fairy', 'Fairy', 15000000, 'UZS', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('fairy', 'wedding')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('fairy', 'wedding')
ON CONFLICT DO NOTHING;
