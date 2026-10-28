-- Exact Taklifla Fasllar source, private until fidelity and lifecycle checks pass.
INSERT INTO templates(id,name,price_minor,currency,published)
VALUES ('taklifla-tort-fasl','To‘rt fasl',100000,'UZS',false)
ON CONFLICT(id) DO NOTHING;
INSERT INTO template_category_assignments(template_id,category_id)
VALUES ('taklifla-tort-fasl','wedding') ON CONFLICT DO NOTHING;
INSERT INTO template_supported_event_types(template_id,event_type)
VALUES ('taklifla-tort-fasl','wedding') ON CONFLICT DO NOTHING;
