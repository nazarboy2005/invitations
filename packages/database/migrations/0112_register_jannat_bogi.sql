-- Register Jannat bogʻi as an unpublished template.
INSERT INTO templates (id,name,price_minor,currency,published) VALUES ('jannat-bogi','Jannat bogʻi',15000000,'UZS',false) ON CONFLICT (id) DO NOTHING;
INSERT INTO template_category_assignments (template_id,category_id) VALUES ('jannat-bogi','wedding') ON CONFLICT DO NOTHING;
INSERT INTO template_supported_event_types (template_id,event_type) VALUES ('jannat-bogi','wedding') ON CONFLICT DO NOTHING;
