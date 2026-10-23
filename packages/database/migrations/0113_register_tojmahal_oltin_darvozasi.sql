-- Register Tojmahal oltin darvozasi as an unpublished template.
INSERT INTO templates (id,name,price_minor,currency,published) VALUES ('tojmahal-oltin-darvozasi','Tojmahal oltin darvozasi',15000000,'UZS',false) ON CONFLICT (id) DO NOTHING;
INSERT INTO template_category_assignments (template_id,category_id) VALUES ('tojmahal-oltin-darvozasi','wedding') ON CONFLICT DO NOTHING;
INSERT INTO template_supported_event_types (template_id,event_type) VALUES ('tojmahal-oltin-darvozasi','wedding') ON CONFLICT DO NOTHING;
