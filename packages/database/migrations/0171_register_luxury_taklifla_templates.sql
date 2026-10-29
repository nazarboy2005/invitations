-- Full captured Taklifla templates; remain private until release verification.
INSERT INTO templates(id,name,price_minor,currency,published)
VALUES ('taklifla-tungi-saroy','Tungi Saroy',100000,'UZS',false),
       ('taklifla-tovus','Tovus',100000,'UZS',false)
ON CONFLICT(id) DO NOTHING;
INSERT INTO template_category_assignments(template_id,category_id)
VALUES ('taklifla-tungi-saroy','wedding'),('taklifla-tovus','wedding')
ON CONFLICT DO NOTHING;
INSERT INTO template_supported_event_types(template_id,event_type)
VALUES ('taklifla-tungi-saroy','wedding'),('taklifla-tovus','wedding')
ON CONFLICT DO NOTHING;
