-- Register the recovered Andalus gate design outside the selectable catalog.
INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('andalus-darvozasi', 'Andalus darvozasi', 15000000, 'UZS', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('andalus-darvozasi', 'wedding') ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('andalus-darvozasi', 'wedding') ON CONFLICT DO NOTHING;
