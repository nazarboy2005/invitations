-- Publish after source packaging, portrait catalog artwork, typed integration, and verification pass.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM templates t
    JOIN template_category_assignments c
      ON c.template_id = t.id AND c.category_id = 'osh'
    JOIN template_supported_event_types e
      ON e.template_id = t.id AND e.event_type = 'osh'
    WHERE t.id = 'invitate-nahorgi-osh'
  ) THEN
    RAISE EXCEPTION 'Invitate Nahorgi Osh registration is incomplete';
  END IF;
END $$;

UPDATE templates
SET published = true, updated_at = now()
WHERE id = 'invitate-nahorgi-osh';
