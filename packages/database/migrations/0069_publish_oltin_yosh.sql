UPDATE templates
SET name = 'Oltin Yosh', price_minor = 15000000, published = TRUE
WHERE id = 'oltin-yosh';

INSERT INTO template_category_assignments(template_id, category_id)
VALUES ('oltin-yosh', 'birthday')
ON CONFLICT DO NOTHING;

DELETE FROM template_supported_event_types
WHERE template_id = 'oltin-yosh'
  AND event_type NOT IN ('birthday', 'yubiley');

INSERT INTO template_supported_event_types(template_id, event_type)
VALUES ('oltin-yosh', 'birthday'), ('oltin-yosh', 'yubiley')
ON CONFLICT DO NOTHING;
