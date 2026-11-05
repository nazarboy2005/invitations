-- Four locales, long names, empty optionals, QR, desktop/mobile preview + Studio
-- and production packaging pass. Owned save/export is checked after publication.
UPDATE templates t SET published=true WHERE t.id='sahar-ifori'
  AND t.format='image' AND t.price_minor=0
  AND EXISTS(SELECT 1 FROM template_category_assignments c WHERE c.template_id=t.id AND c.category_id='wedding')
  AND EXISTS(SELECT 1 FROM template_supported_event_types s WHERE s.template_id=t.id AND s.event_type='wedding')
  AND EXISTS(SELECT 1 FROM template_supported_event_types s WHERE s.template_id=t.id AND s.event_type='fotiha');
