-- Complete navy book source, corporate event compatibility separate from category.
INSERT INTO templates(id,name,price_minor,currency,published) VALUES ('taklifla-yubiley-sahifasi','Yubiley Sahifasi',100000,'UZS',false) ON CONFLICT(id) DO NOTHING;
INSERT INTO template_category_assignments(template_id,category_id) VALUES ('taklifla-yubiley-sahifasi','other') ON CONFLICT DO NOTHING;
INSERT INTO template_supported_event_types(template_id,event_type) VALUES ('taklifla-yubiley-sahifasi','korporativ') ON CONFLICT DO NOTHING;
