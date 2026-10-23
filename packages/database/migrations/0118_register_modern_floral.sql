-- Register Modern Floral for internal preview; keep it unpublished until release gates pass.
INSERT INTO templates (id,name,price_minor,currency,published) VALUES ('modern-floral','Modern Floral',15000000,'UZS',false)
ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name,price_minor=EXCLUDED.price_minor,currency=EXCLUDED.currency,published=false,updated_at=now();
INSERT INTO template_category_assignments(template_id,category_id) VALUES('modern-floral','wedding') ON CONFLICT DO NOTHING;
INSERT INTO template_supported_event_types(template_id,event_type) VALUES('modern-floral','wedding') ON CONFLICT DO NOTHING;
