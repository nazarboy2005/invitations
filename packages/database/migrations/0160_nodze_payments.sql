-- Publication purchases are distinct from the existing manual register and guest gifts.
CREATE TABLE payment_orders (
  id uuid PRIMARY KEY,
  invitation_id uuid NOT NULL,
  owner_id uuid NOT NULL REFERENCES users(id),
  template_id text NOT NULL REFERENCES templates(id),
  template_name text NOT NULL,
  identity_snapshot text NOT NULL,
  amount_minor bigint NOT NULL CHECK(amount_minor BETWEEN 1 AND 1000000000000),
  currency text NOT NULL CHECK(currency='UZS'),
  request_body text NOT NULL,
  idempotency_key text NOT NULL UNIQUE,
  payment_id uuid UNIQUE,
  status text NOT NULL DEFAULT 'CREATED' CHECK(status IN ('CREATED','PENDING','PROCESSING','SUCCEEDED','FAILED','CANCELLED','EXPIRED','REJECTED','REFUND_PENDING','PARTIALLY_REFUNDED','REFUNDED')),
  checkout_url text,
  verified_at timestamptz,
  fulfilled_at timestamptz,
  publication_error text,
  sync_after timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY(invitation_id,owner_id) REFERENCES invitations(id,owner_id),
  CHECK(status<>'SUCCEEDED' OR verified_at IS NOT NULL),
  CHECK(fulfilled_at IS NULL OR verified_at IS NOT NULL)
);
CREATE UNIQUE INDEX payment_orders_active_invitation ON payment_orders(invitation_id)
  WHERE status NOT IN ('FAILED','CANCELLED','EXPIRED');
CREATE INDEX payment_orders_owner ON payment_orders(owner_id,created_at DESC);
CREATE INDEX payment_orders_reconcile ON payment_orders(sync_after) WHERE fulfilled_at IS NULL;
CREATE TABLE payment_webhook_events (
  event_id uuid PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES payment_orders(id),
  body_hash text NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now()
);
CREATE FUNCTION protect_payment_order_snapshot() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF (NEW.invitation_id,NEW.owner_id,NEW.template_id,NEW.template_name,NEW.identity_snapshot,NEW.amount_minor,NEW.currency,NEW.request_body,NEW.idempotency_key)
    IS DISTINCT FROM (OLD.invitation_id,OLD.owner_id,OLD.template_id,OLD.template_name,OLD.identity_snapshot,OLD.amount_minor,OLD.currency,OLD.request_body,OLD.idempotency_key) THEN
    RAISE EXCEPTION 'Payment order snapshot is immutable';
  END IF;
  IF OLD.payment_id IS NOT NULL AND NEW.payment_id IS DISTINCT FROM OLD.payment_id THEN
    RAISE EXCEPTION 'Nodze payment identity is immutable';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER payment_orders_protect BEFORE UPDATE ON payment_orders FOR EACH ROW EXECUTE FUNCTION protect_payment_order_snapshot();

CREATE VIEW admin_payment_records AS
  SELECT id,invitation_id,owner_id,template_name,amount_minor,status,reference,note,revision,created_at,received_at,'manual'::text AS method,NULL::text AS provider_status FROM platform_payments
  UNION ALL
  SELECT id,invitation_id,owner_id,template_name,amount_minor,
    CASE WHEN status='SUCCEEDED' THEN 'received' WHEN status='REFUNDED' THEN 'refunded' WHEN status='FAILED' THEN 'failed' WHEN status IN ('CANCELLED','EXPIRED') THEN 'cancelled' ELSE 'pending' END,
    COALESCE(payment_id::text,''),'Nodze / Click'::text,1,created_at,verified_at,'nodze'::text,status FROM payment_orders;
