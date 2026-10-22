-- Register the source-faithful Samarqand portal design, unpublished.
INSERT INTO templates (id,name,price_minor,currency,published) VALUES ('samarqand-peshtoqi','Samarqand peshtoqi',15000000,'UZS',false) ON CONFLICT (id) DO NOTHING;
INSERT INTO template_category_assignments (template_id,category_id) VALUES ('samarqand-peshtoqi','wedding') ON CONFLICT DO NOTHING;
INSERT INTO template_supported_event_types (template_id,event_type) VALUES ('samarqand-peshtoqi','wedding') ON CONFLICT DO NOTHING;
