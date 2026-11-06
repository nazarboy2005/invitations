-- Permanently remove the user-retired E-invitation Osh Edition from the catalog.
-- The configured database was verified to have no invitations or payments using it.
DELETE FROM templates WHERE id = 'osh-edition-v1';
