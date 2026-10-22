-- Register the source-backed sunnat-toyi design as unavailable until release gates pass.
INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('zarrin-doppi', 'Zarrin do‘ppi', 15000000, 'UZS', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('zarrin-doppi', 'other') ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('zarrin-doppi', 'sunnat-toyi') ON CONFLICT DO NOTHING;
