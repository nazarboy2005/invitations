-- Admin-owned event access is separate from provider payments and revenue.
CREATE TABLE admin_invitation_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id uuid NOT NULL UNIQUE,
  owner_id uuid NOT NULL REFERENCES users(id),
  template_id text NOT NULL REFERENCES templates(id),
  template_name text NOT NULL,
  identity_snapshot text NOT NULL,
  quoted_amount_minor bigint NOT NULL CHECK (quoted_amount_minor > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (invitation_id, owner_id) REFERENCES invitations(id, owner_id)
);
CREATE INDEX admin_invitation_grants_owner ON admin_invitation_grants(owner_id, created_at DESC);

CREATE FUNCTION protect_admin_invitation_grant() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW IS DISTINCT FROM OLD THEN
    RAISE EXCEPTION 'Admin invitation grant is immutable';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER admin_invitation_grants_protect BEFORE UPDATE ON admin_invitation_grants
  FOR EACH ROW EXECUTE FUNCTION protect_admin_invitation_grant();
