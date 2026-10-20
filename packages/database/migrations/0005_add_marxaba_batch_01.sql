INSERT INTO templates(id,name,price_minor,currency,published) VALUES
 ('oltin-nur','Oltin Nur',15000000,'UZS',false),
 ('samarqand-kechasi','Samarqand Kechasi',15000000,'UZS',false),
 ('bogi-eram','Bog‘i Eram',15000000,'UZS',false),
 ('atlas','Atlas',15000000,'UZS',false),
 ('uchar-gilam','Uchar Gilam',15000000,'UZS',false),
 ('oq-kabutar','Oq Kabutar',15000000,'UZS',false),
 ('kuzgi-chinor','Kuzgi Chinor',15000000,'UZS',false),
 ('muhabbat-kitobi','Muhabbat Kitobi',15000000,'UZS',false),
 ('sahifa','Sahifa',15000000,'UZS',false),
 ('oltin-uzuk','Oltin Uzuk',15000000,'UZS',false)
ON CONFLICT (id) DO UPDATE SET
 name=EXCLUDED.name,
 published=false,
 updated_at=now();

INSERT INTO template_category_assignments(template_id,category_id)
SELECT id,'wedding' FROM templates
WHERE id IN (
 'oltin-nur','samarqand-kechasi','bogi-eram','atlas','uchar-gilam',
 'oq-kabutar','kuzgi-chinor','muhabbat-kitobi','sahifa','oltin-uzuk'
)
ON CONFLICT DO NOTHING;
