-- Publish Glass Pink after its source, catalog, visual, and integration gates pass.
UPDATE templates
SET published = true, updated_at = now()
WHERE id = 'glass-pink';
