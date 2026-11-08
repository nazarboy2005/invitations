-- User-approved canonical template names and IDs, including hidden templates.
-- Purchase payloads and audit history remain immutable; ID aliases are resolved by the app.
CREATE TEMP TABLE template_id_renames(previous_id text PRIMARY KEY,id text UNIQUE NOT NULL,name text NOT NULL) ON COMMIT DROP;
INSERT INTO template_id_renames(previous_id,id,name) VALUES
  ('ivory-rose-card','oq-atirgul','Oq atirgul'),
  ('moviy-ravoq-card','moviy-ravoq','Moviy ravoq'),
  ('wedivo-pulau-sehati','kongillar-oroli','Ko‘ngillar oroli'),
  ('oltin-darvoza-ortidagi-baxt','baxt-darvozasi','Baxt darvozasi'),
  ('buxoro-ravoq','buxoro-ravogi','Buxoro ravog‘i'),
  ('tojmahal-oltin-darvozasi','tojmahal-darvozasi','Tojmahal darvozasi'),
  ('fairy','sehrli-oqshom','Sehrli oqshom'),
  ('butterfly','kapalak','Kapalak'),
  ('girlsparty','dugonalar','Dugonalar'),
  ('evelina','baxt-kaliti','Baxt kaliti'),
  ('toscana','gulzor','Gulzor'),
  ('korporativ','anjuman','Anjuman'),
  ('stained-glass','shisha-naqshi','Shisha naqshi'),
  ('swan-garden','oqqushlar','Oqqushlar'),
  ('golden-card','zarvaraq','Zarvaraq'),
  ('green-garden','yashil-makon','Yashil Makon'),
  ('green-gold','zumrad','Zumrad'),
  ('green-white','oq-chechak','Oq chechak'),
  ('jasmine-white','oq-yasmin','Oq yasmin'),
  ('lace','marvarid','Marvarid'),
  ('love-sakura','sakura-sehri','Sakura sehri'),
  ('luxury-gold','zar-jilosi','Zar jilosi'),
  ('modern-floral','gul-ifori','Gul ifori'),
  ('taklifla-zarhal-sahifa','zarhal-sahifa','Zarhal Sahifa'),
  ('taklifla-muhrli-maktub','muhrli-maktub','Muhrli Maktub'),
  ('taklifla-asalari','asalari','Asalari'),
  ('taklifla-fayzli-xonadon','fayzli-xonadon','Fayzli Xonadon'),
  ('taklifla-ertak','ertak','Ertak'),
  ('taklifla-gulbog','gulbog','Gulbog'),
  ('taklifla-zarrin-gullar','zarrin-gullar','Zarrin gullar'),
  ('taklifla-toglar-bagrida','toglar-bagrida','Tog‘lar bag‘rida'),
  ('taklifla-oltin-yol','oltin-yol','Oltin Yo‘l'),
  ('taklifla-osmon','osmon','Cheksiz Osmon'),
  ('taklifla-parilar-ertagi','parilar-ertagi','Parilar ertagi'),
  ('taklifla-qogoz-ertagi','qogoz-ertagi','Qog‘oz ertagi'),
  ('taklifla-sakura-guli','sakura-guli','Sakura Guli'),
  ('taklifla-sharlar','sharlar','Sharlar'),
  ('taklifla-yulduzli-tun','yulduzli-tun','Yulduzli Tun'),
  ('taklifla-terracotta','terrakota','Terrakota'),
  ('taklifla-uchrashuv','uchrashuv','Uchrashuv'),
  ('taklifla-yubiley-sahifasi','umr-bahori','Umr bahori'),
  ('taklifla-barakali','baraka','Baraka'),
  ('taklifla-tungi-saroy','tungi-saroy','Tungi Saroy'),
  ('taklifla-tovus','tovus','Tovus'),
  ('taklifla-tort-fasl','tort-fasl','To‘rt fasl'),
  ('glass-pink','pushti-gulbarg','Pushti gulbarg'),
  ('olive-manor-edition','zaytun','Zaytun'),
  ('islamic-edition','islomiy','Islomiy'),
  ('orchid-amplop','ormon-maktubi','O‘rmon maktubi'),
  ('invitate-palov','osh-ziyofati','Osh ziyofati'),
  ('golden-hour','oltin-lahza','Oltin lahza'),
  ('bloom','gullar-bayrami','Gullar bayrami'),
  ('invitate-nahorgi-osh','sahar-ziyofati','Sahar ziyofati'),
  ('invitate-wedding','gulchambar','Gulchambar'),
  ('whiteless','orzular','Orzular'),
  ('monochrome-editorial-edition','oq-qora-lavha','Oq-qora lavha'),
  ('xatna-edition','xatna','Xatna'),
  ('cloud-castle','bulutlar-qasri','Bulutlar qasri'),
  ('palace-rose','saroy-atirguli','Saroy atirguli'),
  ('royal-burgundy-edition','baxmal-saroy','Baxmal saroy'),
  ('taklifnomachi-1','nafosat','Nafosat'),
  ('taklifnomachi-12','moviy-osmon','Moviy osmon'),
  ('taklifnomachi-13','oltin-atirgul','Oltin atirgul'),
  ('taklifnomachi-15','tun-jilosi','Tun jilosi'),
  ('taklifnomachi-16','zaytun-guli','Zaytun guli'),
  ('taklifnomachi-17','ipak-jilosi','Ipak jilosi'),
  ('taklifnomachi-18','guldasta','Guldasta'),
  ('taklifnomachi-19','zaytun-bogi','Zaytun bog‘i'),
  ('ivory-love','oppoq-tuygu','Oppoq tuyg‘u'),
  ('swan','oqqush','Oqqush');
CREATE TEMP TABLE template_id_aliases(alias text PRIMARY KEY,id text NOT NULL) ON COMMIT DROP;
INSERT INTO template_id_aliases(alias,id) VALUES
  ('ivory-rose-card','oq-atirgul'),
  ('moviy-ravoq-card','moviy-ravoq'),
  ('wedivo-pulau-sehati','kongillar-oroli'),
  ('oltin-darvoza-ortidagi-baxt','baxt-darvozasi'),
  ('buxoro-ravoq','buxoro-ravogi'),
  ('tojmahal-oltin-darvozasi','tojmahal-darvozasi'),
  ('fairy','sehrli-oqshom'),
  ('butterfly','kapalak'),
  ('girlsparty','dugonalar'),
  ('evelina','baxt-kaliti'),
  ('toscana','gulzor'),
  ('korporativ','anjuman'),
  ('stained-glass','shisha-naqshi'),
  ('swan-garden','oqqushlar'),
  ('golden-card','zarvaraq'),
  ('green-garden','yashil-makon'),
  ('green-gold','zumrad'),
  ('green-white','oq-chechak'),
  ('jasmine-white','oq-yasmin'),
  ('lace','marvarid'),
  ('love-sakura','sakura-sehri'),
  ('luxury-gold','zar-jilosi'),
  ('modern-floral','gul-ifori'),
  ('taklifla-zarhal-sahifa','zarhal-sahifa'),
  ('taklifla-muhrli-maktub','muhrli-maktub'),
  ('taklifla-asalari','asalari'),
  ('taklifla-fayzli-xonadon','fayzli-xonadon'),
  ('taklifla-ertak','ertak'),
  ('taklifla-gulbog','gulbog'),
  ('taklifla-zarrin-gullar','zarrin-gullar'),
  ('taklifla-toglar-bagrida','toglar-bagrida'),
  ('taklifla-oltin-yol','oltin-yol'),
  ('taklifla-osmon','osmon'),
  ('taklifla-parilar-ertagi','parilar-ertagi'),
  ('taklifla-qogoz-ertagi','qogoz-ertagi'),
  ('taklifla-sakura-guli','sakura-guli'),
  ('taklifla-sharlar','sharlar'),
  ('taklifla-yulduzli-tun','yulduzli-tun'),
  ('taklifla-terracotta','terrakota'),
  ('terracotta','terrakota'),
  ('taklifla-uchrashuv','uchrashuv'),
  ('taklifla-yubiley-sahifasi','umr-bahori'),
  ('yubiley-sahifasi','umr-bahori'),
  ('taklifla-barakali','baraka'),
  ('barakali','baraka'),
  ('taklifla-tungi-saroy','tungi-saroy'),
  ('taklifla-tovus','tovus'),
  ('taklifla-tort-fasl','tort-fasl'),
  ('glass-pink','pushti-gulbarg'),
  ('olive-manor-edition','zaytun'),
  ('olive-manor','zaytun'),
  ('islamic-edition','islomiy'),
  ('islamic','islomiy'),
  ('orchid-amplop','ormon-maktubi'),
  ('invitate-palov','osh-ziyofati'),
  ('golden-hour','oltin-lahza'),
  ('bloom','gullar-bayrami'),
  ('invitate-nahorgi-osh','sahar-ziyofati'),
  ('invitate-wedding','gulchambar'),
  ('whiteless','orzular'),
  ('monochrome-editorial-edition','oq-qora-lavha'),
  ('monochrome-editorial','oq-qora-lavha'),
  ('xatna-edition','xatna'),
  ('cloud-castle','bulutlar-qasri'),
  ('palace-rose','saroy-atirguli'),
  ('royal-burgundy-edition','baxmal-saroy'),
  ('velvet-royale','baxmal-saroy'),
  ('taklifnomachi-1','nafosat'),
  ('klassik-nafis','nafosat'),
  ('taklifnomachi-12','moviy-osmon'),
  ('taklifnomachi-13','oltin-atirgul'),
  ('taklifnomachi-15','tun-jilosi'),
  ('monoxrom','tun-jilosi'),
  ('taklifnomachi-16','zaytun-guli'),
  ('taklifnomachi-17','ipak-jilosi'),
  ('atlas-ipak','ipak-jilosi'),
  ('taklifnomachi-18','guldasta'),
  ('gul-naqshli-marosim','guldasta'),
  ('taklifnomachi-19','zaytun-bogi'),
  ('ivory-love','oppoq-tuygu'),
  ('swan','oqqush');

-- Hold writers while immutable payment FKs are rekeyed. Transaction rollback restores triggers too.
LOCK TABLE templates,invitations,template_category_assignments,template_supported_event_types,
  template_favorites,platform_payments,payment_orders,invitation_change_requests IN SHARE ROW EXCLUSIVE MODE;
DO $$ BEGIN
  IF EXISTS(SELECT 1 FROM template_id_renames m JOIN templates old ON old.id=m.previous_id JOIN templates current ON current.id=m.id) THEN
    RAISE EXCEPTION 'Canonical template ID already exists; refusing to merge distinct templates';
  END IF;
END $$;

-- Every dependent FK, including retirement replacements, follows the actual primary-key change.
DO $$ DECLARE item record; definition text; BEGIN
  FOR item IN SELECT conname,conrelid::regclass AS table_name,pg_get_constraintdef(oid) AS definition
    FROM pg_constraint WHERE contype='f' AND confrelid='templates'::regclass
  LOOP
    definition := regexp_replace(item.definition,' ON UPDATE (NO ACTION|RESTRICT|CASCADE|SET NULL|SET DEFAULT)','','g');
    definition := replace(definition,'REFERENCES templates(id)','REFERENCES templates(id) ON UPDATE CASCADE');
    EXECUTE format('ALTER TABLE %s DROP CONSTRAINT %I, ADD CONSTRAINT %I %s',item.table_name,item.conname,item.conname,definition);
  END LOOP;
END $$;
ALTER TABLE platform_payments DISABLE TRIGGER platform_payments_protect;
ALTER TABLE payment_orders DISABLE TRIGGER payment_orders_protect;
UPDATE templates t SET id=m.id,name=m.name FROM template_id_renames m WHERE t.id=m.previous_id;
ALTER TABLE platform_payments ENABLE TRIGGER platform_payments_protect;
ALTER TABLE payment_orders ENABLE TRIGGER payment_orders_protect;

-- Only identity fields/namespaces are rewritten. Names, event types, media and content stay authored.
CREATE FUNCTION pg_temp.canonical_template_document(document jsonb) RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE result jsonb := document; details jsonb; item record; current_value jsonb; previous_value jsonb; canonical_id text;
BEGIN
  IF jsonb_typeof(document) IS DISTINCT FROM 'object' THEN RETURN document; END IF;
  SELECT id INTO canonical_id FROM template_id_aliases WHERE alias=document->>'templateId';
  IF canonical_id IS NOT NULL THEN result:=jsonb_set(result,'{templateId}',to_jsonb(canonical_id)); END IF;
  details:=result->'templateData';
  IF jsonb_typeof(details)='object' THEN
    FOR item IN SELECT * FROM template_id_aliases ORDER BY alias LOOP
      IF details ? item.alias THEN
        previous_value:=details->item.alias;
        IF details ? item.id THEN
          current_value:=details->item.id;
          IF current_value IS DISTINCT FROM previous_value THEN
            IF jsonb_typeof(current_value)<>'object' OR jsonb_typeof(previous_value)<>'object'
              OR EXISTS(SELECT 1 FROM jsonb_each(previous_value) p JOIN jsonb_each(current_value) c USING(key) WHERE p.value IS DISTINCT FROM c.value) THEN
              RAISE EXCEPTION 'Conflicting saved template data for % and %; refusing data loss',item.alias,item.id;
            END IF;
            previous_value:=previous_value||current_value;
          END IF;
        END IF;
        details:=(details-item.alias)||jsonb_build_object(item.id,previous_value);
      END IF;
    END LOOP;
    result:=jsonb_set(result,'{templateData}',details);
  END IF;
  RETURN result;
END $$;
UPDATE invitations SET data=pg_temp.canonical_template_document(data)
WHERE data IS DISTINCT FROM pg_temp.canonical_template_document(data);
UPDATE invitation_change_requests SET proposed_changes=pg_temp.canonical_template_document(proposed_changes)
WHERE proposed_changes IS DISTINCT FROM pg_temp.canonical_template_document(proposed_changes);

-- Resolve deferred support checks before the migration runner applies any later migration.
SET CONSTRAINTS ALL IMMEDIATE;
SET CONSTRAINTS ALL DEFERRED;
