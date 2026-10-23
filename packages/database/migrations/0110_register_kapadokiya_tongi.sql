-- Register Kapadokiya tongi as an unpublished template.
INSERT INTO templates (id,name,price_minor,currency,published) VALUES ('kapadokiya-tongi','Kapadokiya tongi',15000000,'UZS',false) ON CONFLICT (id) DO NOTHING;
INSERT INTO template_category_assignments (template_id,category_id) VALUES ('kapadokiya-tongi','wedding') ON CONFLICT DO NOTHING;
INSERT INTO template_supported_event_types (template_id,event_type) VALUES ('kapadokiya-tongi','wedding') ON CONFLICT DO NOTHING;
