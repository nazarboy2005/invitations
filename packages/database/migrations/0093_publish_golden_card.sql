-- Publish Golden Card after its source, catalog, preview, browser, and integration gates pass.
UPDATE templates
SET published = true, updated_at = now()
WHERE id = 'golden-card';
