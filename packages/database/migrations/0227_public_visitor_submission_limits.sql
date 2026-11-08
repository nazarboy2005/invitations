ALTER TABLE wishes ADD COLUMN visitor_token_hash text;

CREATE INDEX wishes_visitor_submission_idx
  ON wishes(invitation_id, visitor_token_hash)
  WHERE visitor_token_hash IS NOT NULL;
