-- Permanently remove the user-retired Amru Maruf template from the catalog.
-- The configured database was verified to have no invitations or payments using it.
DELETE FROM templates WHERE id = 'amru-maruf-edition-v1';
