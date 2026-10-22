-- Register the recovered source design as unavailable until its release gates pass.
INSERT INTO templates (id, name, price_minor, currency, published)
VALUES ('ming-bir-kecha', 'Ming bir kecha', 15000000, 'UZS', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('ming-bir-kecha', 'wedding') ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('ming-bir-kecha', 'wedding') ON CONFLICT DO NOTHING;
