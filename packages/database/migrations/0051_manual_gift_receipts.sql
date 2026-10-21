-- Guest receipts are private evidence for owner review, never payment verification.
CREATE TABLE gift_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id uuid NOT NULL REFERENCES invitations(id),
  guest_id uuid REFERENCES invitation_guests(id),
  asset_id uuid NOT NULL UNIQUE REFERENCES media_assets(id),
  giver_names text NOT NULL,
  file_hash text NOT NULL,
  destination jsonb NOT NULL,
  status text NOT NULL DEFAULT 'unreviewed' CHECK(status IN ('unreviewed','received','issue')),
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES users(id),
  UNIQUE(invitation_id,file_hash)
);
CREATE INDEX gift_receipts_invitation_idx ON gift_receipts(invitation_id,created_at DESC);
