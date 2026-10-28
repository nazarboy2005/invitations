-- Publish both Taklifla source integrations after source, renderer, and private lifecycle gates pass.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM templates WHERE id='taklifla-asalari' AND name='Asalari' AND price_minor=150000 AND currency='UZS' AND published=false
  ) OR NOT EXISTS (
    SELECT 1 FROM templates WHERE id='taklifla-muhrli-maktub' AND name='Muhrli Maktub' AND price_minor=150000 AND currency='UZS' AND published=false
  ) THEN
    RAISE EXCEPTION 'Taklifla source candidates are not in the expected private release state';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM template_category_assignments WHERE template_id='taklifla-asalari' AND category_id='birthday')
     OR NOT EXISTS (SELECT 1 FROM template_supported_event_types WHERE template_id='taklifla-asalari' AND event_type='birthday')
     OR NOT EXISTS (SELECT 1 FROM template_category_assignments WHERE template_id='taklifla-muhrli-maktub' AND category_id='wedding')
     OR NOT EXISTS (SELECT 1 FROM template_supported_event_types WHERE template_id='taklifla-muhrli-maktub' AND event_type='wedding') THEN
    RAISE EXCEPTION 'Taklifla category or event compatibility registration is incomplete';
  END IF;
END $$;

UPDATE templates SET published=true,updated_at=now()
WHERE id IN ('taklifla-asalari','taklifla-muhrli-maktub');
