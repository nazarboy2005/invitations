-- Telegram user ID is the account identity. Discard previously collected
-- account phone data; invitation-authored contacts and guest RSVP are separate.
ALTER TABLE users
  DROP COLUMN IF EXISTS phone_number,
  DROP COLUMN IF EXISTS phone_source,
  DROP COLUMN IF EXISTS phone_shared_at;
