-- Original compositions: remain hidden until renderer, owned download and UI QA pass.
INSERT INTO templates(id,name,price_minor,currency,published,format) VALUES
  ('lola-maktubi','Lola maktubi',0,'UZS',false,'image'),
  ('moviy-ravoq-card','Moviy ravoq',0,'UZS',false,'image'),
  ('zarhal-oqshom-card','Zarhal oqshom',0,'UZS',false,'image')
ON CONFLICT(id) DO NOTHING;
INSERT INTO template_category_assignments(template_id,category_id) VALUES
  ('lola-maktubi','wedding'),('moviy-ravoq-card','wedding'),('zarhal-oqshom-card','wedding')
ON CONFLICT DO NOTHING;
INSERT INTO template_supported_event_types(template_id,event_type) VALUES
  ('lola-maktubi','wedding'),('lola-maktubi','fotiha'),
  ('moviy-ravoq-card','wedding'),('moviy-ravoq-card','fotiha'),
  ('zarhal-oqshom-card','wedding'),('zarhal-oqshom-card','fotiha')
ON CONFLICT DO NOTHING;
