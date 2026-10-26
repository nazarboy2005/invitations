ALTER TABLE users ADD COLUMN disabled_at timestamptz;
ALTER TABLE users ADD COLUMN disabled_reason text;
ALTER TABLE telegram_connections ADD COLUMN broadcast_opt_out_at timestamptz;

ALTER TABLE admin_audit_log DROP CONSTRAINT admin_audit_log_action_check;
ALTER TABLE admin_audit_log ADD CONSTRAINT admin_audit_log_action_check CHECK (action IN (
  'template.update','category.create','category.update','music.create','music.update',
  'user.suspend','user.restore','user.revoke_sessions','payment.create','payment.update',
  'broadcast.create','broadcast.confirm','broadcast.cancel',
  'invitation.create','invitation.update','invitation.publish','invitation.archive','invitation.delete','invitation.extend_deadline','invitation.moderate','invitation.upload'
));

CREATE UNIQUE INDEX invitations_id_owner_unique ON invitations(id,owner_id);
CREATE TABLE platform_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id uuid NOT NULL,
  owner_id uuid NOT NULL REFERENCES users(id),
  template_id text NOT NULL REFERENCES templates(id),
  template_name text NOT NULL,
  amount_minor bigint NOT NULL CHECK(amount_minor BETWEEN 0 AND 1000000000000),
  currency text NOT NULL DEFAULT 'UZS' CHECK(currency='UZS'),
  status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','received','failed','cancelled','refunded')),
  method text NOT NULL DEFAULT 'manual' CHECK(method='manual'),
  reference text NOT NULL DEFAULT '' CHECK(length(reference)<=120),
  note text NOT NULL CHECK(length(note) BETWEEN 5 AND 1000),
  revision integer NOT NULL DEFAULT 1 CHECK(revision>0),
  idempotency_key uuid NOT NULL,
  created_by uuid NOT NULL REFERENCES users(id),
  updated_by uuid NOT NULL REFERENCES users(id),
  received_at timestamptz,
  refunded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(created_by,idempotency_key),
  FOREIGN KEY(invitation_id,owner_id) REFERENCES invitations(id,owner_id),
  CHECK((status IN ('received','refunded')) = (received_at IS NOT NULL)),
  CHECK((status='refunded') = (refunded_at IS NOT NULL))
);
CREATE INDEX platform_payments_recent_idx ON platform_payments(created_at DESC,id DESC);
CREATE INDEX platform_payments_owner_idx ON platform_payments(owner_id,created_at DESC);
CREATE FUNCTION protect_platform_payment() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF (NEW.invitation_id,NEW.owner_id,NEW.template_id,NEW.template_name,NEW.currency,NEW.method,NEW.created_by,NEW.idempotency_key)
     IS DISTINCT FROM (OLD.invitation_id,OLD.owner_id,OLD.template_id,OLD.template_name,OLD.currency,OLD.method,OLD.created_by,OLD.idempotency_key) THEN
    RAISE EXCEPTION 'Payment snapshot is immutable';
  END IF;
  IF NEW.amount_minor<>OLD.amount_minor AND (OLD.status<>'pending' OR NEW.status<>'pending') THEN
    RAISE EXCEPTION 'Only a pending payment amount can change';
  END IF;
  IF NEW.status<>OLD.status AND NOT (
    (OLD.status='pending' AND NEW.status IN ('received','failed','cancelled')) OR
    (OLD.status='received' AND NEW.status='refunded')
  ) THEN RAISE EXCEPTION 'Invalid payment transition'; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER platform_payments_protect BEFORE UPDATE ON platform_payments FOR EACH ROW EXECUTE FUNCTION protect_platform_payment();

CREATE TABLE admin_broadcasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL REFERENCES users(id),
  confirmed_by uuid REFERENCES users(id),
  title text NOT NULL CHECK(length(title) BETWEEN 1 AND 120),
  message text NOT NULL CHECK(length(message) BETWEEN 1 AND 3500),
  audience text NOT NULL CHECK(audience IN ('all','published','drafts','selected')),
  status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','queued','completed','cancelled')),
  recipient_count integer NOT NULL CHECK(recipient_count BETWEEN 0 AND 10000),
  idempotency_key uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  confirmed_at timestamptz,
  completed_at timestamptz,
  UNIQUE(created_by,idempotency_key),
  CHECK(status NOT IN ('queued','completed') OR (confirmed_by IS NOT NULL AND confirmed_at IS NOT NULL))
);
CREATE INDEX admin_broadcasts_recent_idx ON admin_broadcasts(created_at DESC,id DESC);
CREATE TABLE admin_broadcast_recipients (
  broadcast_id uuid NOT NULL REFERENCES admin_broadcasts(id),
  user_id uuid NOT NULL REFERENCES users(id),
  status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','processing','sent','failed','skipped','uncertain')),
  attempts integer NOT NULL DEFAULT 0,
  available_at timestamptz NOT NULL DEFAULT now(),
  locked_at timestamptz,
  sent_at timestamptz,
  telegram_message_id bigint,
  last_error text,
  PRIMARY KEY(broadcast_id,user_id)
);
CREATE INDEX broadcast_recipients_queue_idx ON admin_broadcast_recipients(available_at,broadcast_id) WHERE status='pending';
CREATE TABLE admin_worker_leases (
  name text PRIMARY KEY,
  owner uuid NOT NULL,
  expires_at timestamptz NOT NULL
);
