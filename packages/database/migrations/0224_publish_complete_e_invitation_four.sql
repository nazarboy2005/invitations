-- Repair/release only the four requested existing E-invitation designs.
-- Administrator-controlled names and prices are deliberately preserved.
DO $$
BEGIN
  IF (SELECT count(*) FROM templates WHERE id IN
      ('olive-manor-edition','islamic-edition','monochrome-editorial-edition','xatna-edition')
      AND format = 'web') <> 4 THEN
    RAISE EXCEPTION 'All four E-invitation web registrations must exist';
  END IF;
END $$;

INSERT INTO template_supported_event_types (template_id,event_type) VALUES
  ('olive-manor-edition','wedding'),
  ('islamic-edition','wedding'),
  ('monochrome-editorial-edition','wedding'),
  ('xatna-edition','sunnat-toyi')
ON CONFLICT DO NOTHING;

INSERT INTO template_category_assignments (template_id,category_id) VALUES
  ('olive-manor-edition','wedding'),
  ('islamic-edition','wedding'),
  ('monochrome-editorial-edition','wedding'),
  ('xatna-edition','other')
ON CONFLICT DO NOTHING;

UPDATE templates SET published = true
WHERE id IN ('olive-manor-edition','islamic-edition','monochrome-editorial-edition','xatna-edition');
