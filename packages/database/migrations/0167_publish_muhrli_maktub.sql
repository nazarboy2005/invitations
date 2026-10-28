-- Publish Muhrli Maktub after the source flowers-note field is typed, editable, persistent, and browser-verified.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM templates WHERE id='taklifla-muhrli-maktub' AND name='Muhrli Maktub'
      AND published=false AND price_minor=150000 AND currency='UZS'
  ) THEN
    RAISE EXCEPTION 'Muhrli Maktub must be privately registered at the approved 150000 UZS price before publication';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM template_category_assignments WHERE template_id='taklifla-muhrli-maktub' AND category_id='wedding')
     OR NOT EXISTS (SELECT 1 FROM template_supported_event_types WHERE template_id='taklifla-muhrli-maktub' AND event_type='wedding') THEN
    RAISE EXCEPTION 'Muhrli Maktub must remain wedding-category and wedding-only';
  END IF;
END $$;
UPDATE templates SET published=true,updated_at=now() WHERE id='taklifla-muhrli-maktub';
