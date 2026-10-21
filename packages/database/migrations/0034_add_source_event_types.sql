ALTER TABLE template_supported_event_types
  DROP CONSTRAINT IF EXISTS template_supported_event_types_event_type_check;

ALTER TABLE template_supported_event_types
  ADD CONSTRAINT template_supported_event_types_event_type_check
  CHECK (event_type IN (
    'wedding', 'birthday', 'osh', 'qiz-bazmi', 'fotiha',
    'qiz-uzatish', 'sunnat-toyi', 'other'
  ));

-- Compatibility is transcribed from each captured template's metadata.
INSERT INTO template_supported_event_types (template_id, event_type)
VALUES
  ('nilufar', 'fotiha'),
  ('monogram', 'fotiha'),
  ('suzani', 'fotiha'),
  ('orik-guli', 'fotiha'),
  ('orik-guli', 'qiz-uzatish'),
  ('paxta', 'fotiha'),
  ('sahro-fonusi', 'fotiha'),
  ('vals', 'fotiha'),
  ('toscana', 'fotiha'),
  ('muhr', 'fotiha'),
  ('muhr', 'qiz-uzatish'),
  ('bulbul', 'fotiha'),
  ('bulbul', 'qiz-uzatish'),
  ('kozgu', 'fotiha')
ON CONFLICT DO NOTHING;
