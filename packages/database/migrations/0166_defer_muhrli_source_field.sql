-- Keep Muhrli Maktub hidden while its source-supported flowers note is integrated.
UPDATE templates SET published=false,updated_at=now() WHERE id='taklifla-muhrli-maktub';
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM templates WHERE id='taklifla-muhrli-maktub' AND published=false)
     OR NOT EXISTS (SELECT 1 FROM template_supported_event_types WHERE template_id='taklifla-muhrli-maktub' AND event_type='wedding') THEN
    RAISE EXCEPTION 'Muhrli Maktub must remain private and wedding-only until its source fields pass';
  END IF;
END $$;
