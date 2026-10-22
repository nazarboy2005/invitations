INSERT INTO templates (id, name, price_minor, currency, published) VALUES ('taklifnomachi-17', 'Taklifnomachi - Atlas va atlas ipak', 15000000, 'UZS', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO template_category_assignments (template_id, category_id) VALUES ('taklifnomachi-17', 'wedding') ON CONFLICT DO NOTHING;
INSERT INTO template_supported_event_types (template_id, event_type) VALUES ('taklifnomachi-17', 'wedding') ON CONFLICT DO NOTHING;
