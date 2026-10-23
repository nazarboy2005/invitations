-- Register Buxoro ravoq as an unpublished template.
INSERT INTO templates (id,name,price_minor,currency,published) VALUES ('buxoro-ravoq','Buxoro ravoq',15000000,'UZS',false) ON CONFLICT (id) DO NOTHING;
INSERT INTO template_category_assignments (template_id,category_id) VALUES ('buxoro-ravoq','wedding') ON CONFLICT DO NOTHING;
INSERT INTO template_supported_event_types (template_id,event_type) VALUES ('buxoro-ravoq','wedding') ON CONFLICT DO NOTHING;
