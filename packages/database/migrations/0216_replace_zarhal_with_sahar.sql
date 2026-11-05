-- User requested removing the dark design from new selections. Preserve owned
-- invitations and its renderer; new light stationery remains hidden during QA.
UPDATE templates SET published=false WHERE id='zarhal-oqshom-card';
INSERT INTO templates(id,name,price_minor,currency,published,format)
VALUES('sahar-ifori','Sahar ifori',0,'UZS',false,'image')
ON CONFLICT(id) DO NOTHING;
INSERT INTO template_category_assignments(template_id,category_id)
VALUES('sahar-ifori','wedding') ON CONFLICT DO NOTHING;
INSERT INTO template_supported_event_types(template_id,event_type)
VALUES('sahar-ifori','wedding'),('sahar-ifori','fotiha') ON CONFLICT DO NOTHING;
