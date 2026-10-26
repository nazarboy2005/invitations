-- Publish Modern Floral after source parity, interaction, and accessibility checks.
UPDATE templates
SET published = true,
    updated_at = now()
WHERE id = 'modern-floral';

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('modern-floral', 'wedding')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('modern-floral', 'wedding')
ON CONFLICT DO NOTHING;
