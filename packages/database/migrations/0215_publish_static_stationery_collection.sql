-- Four-locale/long-name/empty-optional/QR/overflow renders, desktop/phone
-- protected preview + authored Studio, typecheck, 39 focused tests and build pass.
-- Preserve administrator prices and the existing free static testing policy.
UPDATE templates t SET published=true
WHERE t.id IN ('lola-maktubi','moviy-ravoq-card','zarhal-oqshom-card')
  AND t.format='image' AND t.price_minor=0
  AND EXISTS (SELECT 1 FROM template_category_assignments c WHERE c.template_id=t.id AND c.category_id='wedding')
  AND EXISTS (SELECT 1 FROM template_supported_event_types s WHERE s.template_id=t.id AND s.event_type='wedding')
  AND EXISTS (SELECT 1 FROM template_supported_event_types s WHERE s.template_id=t.id AND s.event_type='fotiha');
