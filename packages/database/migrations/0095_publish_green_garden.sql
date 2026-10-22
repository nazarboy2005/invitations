-- Publish Green Garden after its source, shared-contract adapter, catalog art, and browser preview gates pass.
UPDATE templates SET published = true, updated_at = now()
WHERE id = 'green-garden';
