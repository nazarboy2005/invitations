-- Add the second 5:7 image design, hidden until its layout is verified.
INSERT INTO templates(id,name,price_minor,currency,published,format)
VALUES ('zumrad-naqsh','Zumrad naqsh',0,'UZS',false,'image') ON CONFLICT(id) DO NOTHING;
INSERT INTO template_category_assignments(template_id,category_id)
VALUES ('zumrad-naqsh','wedding') ON CONFLICT DO NOTHING;
INSERT INTO template_supported_event_types(template_id,event_type)
VALUES ('zumrad-naqsh','wedding'),('zumrad-naqsh','fotiha') ON CONFLICT DO NOTHING;
