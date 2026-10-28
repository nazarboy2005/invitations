-- Publish the source-complete Velvet Royale renderer. Preserve current admin pricing.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM templates WHERE id = 'royal-burgundy-edition') THEN
    RAISE EXCEPTION 'Velvet Royale must be registered before publication';
  END IF;
END $$;

INSERT INTO template_category_assignments (template_id, category_id)
VALUES ('royal-burgundy-edition', 'wedding')
ON CONFLICT DO NOTHING;

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('royal-burgundy-edition', 'wedding')
ON CONFLICT DO NOTHING;

UPDATE templates
SET published = true, updated_at = now()
WHERE id = 'royal-burgundy-edition';
