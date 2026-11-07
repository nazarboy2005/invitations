-- Publish only the three verified additions. Preserve all existing catalog rows.
DO $$
BEGIN
  IF (
    SELECT count(*) FROM templates t
    WHERE t.id IN ('stained-glass','sunset','swan-garden')
      AND t.format='web' AND t.price_minor=15000000 AND t.currency='UZS'
      AND EXISTS (SELECT 1 FROM template_category_assignments c WHERE c.template_id=t.id AND c.category_id='wedding')
      AND EXISTS (SELECT 1 FROM template_supported_event_types s WHERE s.template_id=t.id AND s.event_type='wedding')
  ) <> 3 THEN
    RAISE EXCEPTION 'The three Chorlove wedding designs must be registered before publication';
  END IF;
END $$;

UPDATE templates SET published=true,updated_at=now()
WHERE id IN ('stained-glass','sunset','swan-garden');
