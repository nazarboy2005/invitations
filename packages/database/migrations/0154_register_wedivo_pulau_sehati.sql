-- Register Pulau Sehati privately for coordinator lifecycle verification.
INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('wedivo-pulau-sehati', 'Ko‘ngillar oroli', 15000000, 'UZS', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('wedivo-pulau-sehati', 'wedding') ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('wedivo-pulau-sehati', 'wedding') ON CONFLICT DO NOTHING;
