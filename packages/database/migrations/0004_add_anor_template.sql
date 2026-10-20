INSERT INTO templates(id,name,price_minor,currency,published)
VALUES ('anor','Anor',15000000,'UZS',false)
ON CONFLICT (id) DO UPDATE SET
  name=EXCLUDED.name,
  published=false,
  updated_at=now();

INSERT INTO template_category_assignments(template_id,category_id)
VALUES ('anor','wedding')
ON CONFLICT DO NOTHING;
