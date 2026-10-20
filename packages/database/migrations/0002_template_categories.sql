CREATE TABLE template_categories (
 id text PRIMARY KEY CHECK (length(id) BETWEEN 1 AND 64 AND id ~ '^[a-z][a-z0-9]*(-[a-z0-9]+)*$'),
 name text NOT NULL CHECK (length(btrim(name)) BETWEEN 1 AND 120),
 position integer NOT NULL DEFAULT 0 CHECK (position BETWEEN 0 AND 10000),
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE template_category_assignments (
 template_id text NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
 category_id text NOT NULL REFERENCES template_categories(id) ON DELETE CASCADE,
 PRIMARY KEY (template_id, category_id)
);
CREATE INDEX template_category_assignments_category_idx ON template_category_assignments(category_id,template_id);
INSERT INTO template_categories(id,name,position) VALUES
 ('wedding','Nikoh to‘yi',0), ('birthday','Tug‘ilgan kun',1),
 ('osh','Nahorgi osh',2), ('qiz-bazmi','Qiz bazmi',3), ('other','Boshqa tadbirlar',4);
INSERT INTO templates(id,name,price_minor) VALUES ('ivory-love','Ivory Love',15000000);
INSERT INTO template_category_assignments(template_id,category_id) VALUES
 ('suzani','wedding'),('shirin-bayram','birthday'),('ivory-love','wedding');
