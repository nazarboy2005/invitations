ALTER TABLE invitations
  ADD COLUMN view_count bigint NOT NULL DEFAULT 0 CHECK (view_count >= 0);

CREATE TABLE invitation_viewers (
  invitation_id uuid NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  visitor_hash text NOT NULL,
  last_viewed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (invitation_id, visitor_hash)
);
