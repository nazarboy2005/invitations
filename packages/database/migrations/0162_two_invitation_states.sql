-- Existing unpublished invitations become drafts without resetting their
-- identity, original link, payment entitlement or editing deadline.
UPDATE invitations
SET status='draft', data=jsonb_set(data,'{status}','"draft"'::jsonb),
    archived_at=NULL, updated_at=now()
WHERE status='archived';

-- Deletion is final in the product. Retain a private tombstone so financial
-- records, guest responses and audit references keep their original links.
ALTER TABLE invitations DROP CONSTRAINT invitations_status_check;
ALTER TABLE invitations ADD CONSTRAINT invitations_status_check
  CHECK (status IN ('draft','published','deleted'));
ALTER TABLE invitations ADD COLUMN deleted_at timestamptz;
