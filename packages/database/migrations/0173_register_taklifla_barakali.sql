-- Source-derived birthday template; private until verified.
INSERT INTO templates(id,name,price_minor,currency,published)
VALUES ('taklifla-barakali','Barakali',100000,'UZS',false) ON CONFLICT(id) DO NOTHING;
INSERT INTO template_category_assignments(template_id,category_id)
VALUES ('taklifla-barakali','birthday') ON CONFLICT DO NOTHING;
INSERT INTO template_supported_event_types(template_id,event_type)
VALUES ('taklifla-barakali','birthday') ON CONFLICT DO NOTHING;
