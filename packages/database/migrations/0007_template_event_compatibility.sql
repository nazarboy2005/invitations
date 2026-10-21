CREATE TABLE template_supported_event_types (
  template_id text NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (
    event_type IN ('wedding', 'birthday', 'osh', 'qiz-bazmi', 'other')
  ),
  PRIMARY KEY (template_id, event_type)
);

INSERT INTO template_supported_event_types (template_id, event_type)
SELECT id, 'wedding' FROM templates;

CREATE INDEX template_supported_event_types_event_idx
  ON template_supported_event_types (event_type, template_id);
