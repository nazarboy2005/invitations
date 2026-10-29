-- Hidden until full source/lifecycle verification; preserve administrator pricing.
INSERT INTO templates(id,name,price_minor,currency,published) VALUES ('taklifla-zarrin-gullar','Zarrin gullar',100000,'UZS',false) ON CONFLICT(id) DO NOTHING;
INSERT INTO template_category_assignments(template_id,category_id) VALUES ('taklifla-zarrin-gullar','wedding') ON CONFLICT DO NOTHING;
INSERT INTO template_supported_event_types(template_id,event_type) VALUES ('taklifla-zarrin-gullar','wedding') ON CONFLICT DO NOTHING;
