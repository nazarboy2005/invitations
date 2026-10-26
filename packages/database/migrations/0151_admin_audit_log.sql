-- Catalog administration history. No credentials, IPs or invitation content.
CREATE TABLE admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid NOT NULL REFERENCES users(id),
  action text NOT NULL CHECK (action IN ('template.update','category.create','category.update','music.create','music.update')),
  target_id text NOT NULL,
  previous_values jsonb,
  new_values jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX admin_audit_log_recent_idx ON admin_audit_log(created_at DESC,id DESC);
