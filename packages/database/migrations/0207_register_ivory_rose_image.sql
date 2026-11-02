-- One free 5:7 image design, hidden until verification. Existing formats unchanged.
ALTER TABLE templates ADD COLUMN IF NOT EXISTS format text NOT NULL DEFAULT 'web'
  CHECK (format IN ('web', 'image'));
INSERT INTO templates(id,name,price_minor,currency,published,format)
VALUES ('ivory-rose-card','Oq atirgul',0,'UZS',false,'image') ON CONFLICT(id) DO NOTHING;
INSERT INTO template_category_assignments(template_id,category_id)
VALUES ('ivory-rose-card','wedding') ON CONFLICT DO NOTHING;
INSERT INTO template_supported_event_types(template_id,event_type)
VALUES ('ivory-rose-card','wedding'),('ivory-rose-card','fotiha') ON CONFLICT DO NOTHING;
