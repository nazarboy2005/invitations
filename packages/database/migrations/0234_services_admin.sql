CREATE TABLE service_listings (
  slug text PRIMARY KEY CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  draft jsonb NOT NULL,
  published jsonb,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  revision integer NOT NULL DEFAULT 1,
  position bigserial UNIQUE NOT NULL,
  evidence jsonb,
  review_required boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES users(id),
  updated_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((status = 'published') = (published IS NOT NULL)),
  CHECK (draft->>'slug' = slug AND (published IS NULL OR published->>'slug' = slug))
);
CREATE INDEX service_listings_published_idx ON service_listings(position) WHERE published IS NOT NULL;
CREATE TABLE service_media (
  id uuid PRIMARY KEY,
  object_key text NOT NULL UNIQUE,
  width integer NOT NULL CHECK (width > 0),
  height integer NOT NULL CHECK (height > 0),
  bytes integer NOT NULL,
  owner_id uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE service_import_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  input jsonb NOT NULL,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','review','failed','cancelled')),
  service_slug text REFERENCES service_listings(slug),
  result jsonb,
  error text,
  attempts integer NOT NULL DEFAULT 0,
  lease_token uuid,
  heartbeat_at timestamptz,
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX service_import_queue_idx ON service_import_jobs(created_at) WHERE status IN ('queued','running');
CREATE TABLE service_worker_heartbeat (
  name text PRIMARY KEY, updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE admin_audit_log DROP CONSTRAINT admin_audit_log_action_check;
ALTER TABLE admin_audit_log ADD CONSTRAINT admin_audit_log_action_check CHECK (action IN (
  'template.update','category.create','category.update','music.create','music.update',
  'user.suspend','user.restore','user.revoke_sessions','payment.create','payment.update',
  'broadcast.create','broadcast.confirm','broadcast.cancel',
  'invitation.create','invitation.update','invitation.publish','invitation.archive',
  'invitation.delete','invitation.extend_deadline','invitation.moderate','invitation.upload','invitation.review_correction',
  'service.create','service.update','service.publish','service.unpublish','service.archive','service.import'
));
