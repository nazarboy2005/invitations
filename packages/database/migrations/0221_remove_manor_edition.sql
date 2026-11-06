-- Permanently remove the user-retired Manor template from the catalog.
-- The configured database was verified to have no invitations or payments using it.
DELETE FROM templates WHERE id = 'manor-edition';
