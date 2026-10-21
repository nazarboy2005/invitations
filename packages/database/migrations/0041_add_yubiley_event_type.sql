ALTER TABLE template_supported_event_types
  DROP CONSTRAINT IF EXISTS template_supported_event_types_event_type_check;

ALTER TABLE template_supported_event_types
  ADD CONSTRAINT template_supported_event_types_event_type_check
  CHECK (event_type IN (
    'wedding', 'birthday', 'yubiley', 'osh', 'qiz-bazmi', 'fotiha',
    'qiz-uzatish', 'sunnat-toyi', 'beshik-toyi', 'other'
  ));
