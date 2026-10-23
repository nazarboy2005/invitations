-- Register Shisha bog unpublished.
INSERT INTO templates (id,name,price_minor,currency,published) VALUES ('shisha-bog','Shisha bog',15000000,'UZS',false) ON CONFLICT (id) DO NOTHING;
INSERT INTO template_category_assignments (template_id,category_id) VALUES ('shisha-bog','wedding') ON CONFLICT DO NOTHING;
INSERT INTO template_supported_event_types (template_id,event_type) VALUES ('shisha-bog','wedding') ON CONFLICT DO NOTHING;
