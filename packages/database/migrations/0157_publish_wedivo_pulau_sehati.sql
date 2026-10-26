-- Publish Pulau Sehati after source field support and creator browser verification.
UPDATE templates
SET published = true,
    name = 'Ko‘ngillar oroli',
    price_minor = 15000000,
    currency = 'UZS'
WHERE id = 'wedivo-pulau-sehati';

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('wedivo-pulau-sehati', 'wedding') ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('wedivo-pulau-sehati', 'wedding') ON CONFLICT DO NOTHING;
