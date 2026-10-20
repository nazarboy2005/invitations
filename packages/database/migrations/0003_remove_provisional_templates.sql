-- The three starter designs were provisional and are being removed from the
-- selectable catalog. Keep their rows so existing foreign keys and historical
-- invitation records remain intact, but make them unavailable everywhere.
UPDATE templates
SET published = false,
    replacement_template_id = NULL,
    updated_at = now()
WHERE id IN ('suzani', 'shirin-bayram', 'ivory-love');

DELETE FROM template_category_assignments
WHERE template_id IN ('suzani', 'shirin-bayram', 'ivory-love');

-- Creators may prepare and save invitation data before choosing an exact
-- template. Publication still requires a selected template.
ALTER TABLE invitations ALTER COLUMN template_id DROP NOT NULL;
ALTER TABLE invitations
  ADD CONSTRAINT invitations_published_template_required
  CHECK (status <> 'published' OR template_id IS NOT NULL);
