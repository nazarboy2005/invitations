-- gen_random_uuid() is built in on supported PostgreSQL 13+ releases.
CREATE TABLE users (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), telegram_user_id bigint NOT NULL UNIQUE,
 display_name text NOT NULL, telegram_username text, phone_number text,
 phone_source text CHECK (phone_source IS NULL OR phone_source = 'telegram_contact'), phone_shared_at timestamptz,
 is_admin boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE telegram_connections (
 user_id uuid PRIMARY KEY REFERENCES users(id), telegram_chat_id bigint NOT NULL,
 status text NOT NULL DEFAULT 'active', updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE sessions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id), token_hash text NOT NULL UNIQUE,
 user_agent text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now(), last_seen_at timestamptz NOT NULL DEFAULT now(),
 expires_at timestamptz NOT NULL, absolute_expires_at timestamptz NOT NULL, revoked_at timestamptz
);
CREATE INDEX sessions_user_idx ON sessions(user_id);
CREATE TABLE auth_requests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), token_hash text NOT NULL UNIQUE, browser_hash text NOT NULL,
 code text NOT NULL, user_id uuid REFERENCES users(id), state text NOT NULL DEFAULT 'pending' CHECK (state IN ('pending','identified','confirmed','consumed')),
 expires_at timestamptz NOT NULL, confirmed_at timestamptz, consumed_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX auth_requests_browser_idx ON auth_requests(browser_hash,created_at);
CREATE INDEX auth_requests_user_idx ON auth_requests(user_id,expires_at);
CREATE TABLE telegram_updates (update_id bigint PRIMARY KEY, received_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE miniapp_exchanges (init_hash text PRIMARY KEY, expires_at timestamptz NOT NULL);
CREATE TABLE templates (
 id text PRIMARY KEY, name text NOT NULL, published boolean NOT NULL DEFAULT true, price_minor bigint NOT NULL CHECK (price_minor >= 0),
 currency text NOT NULL DEFAULT 'UZS', replacement_template_id text REFERENCES templates(id), updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO templates(id,name,price_minor) VALUES ('suzani','Suzani',15000000),('shirin-bayram','Shirin bayram',15000000);
CREATE TABLE invitations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), owner_id uuid NOT NULL REFERENCES users(id), template_id text NOT NULL REFERENCES templates(id),
 status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','archived')), data jsonb NOT NULL, slug text UNIQUE,
 first_published_at timestamptz, identity_locked_at timestamptz, edit_deadline_at timestamptz, archived_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX invitations_owner_idx ON invitations(owner_id,updated_at DESC);
CREATE TABLE invitation_change_requests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), invitation_id uuid NOT NULL REFERENCES invitations(id), requested_by uuid NOT NULL REFERENCES users(id),
 change_type text NOT NULL, proposed_changes jsonb NOT NULL, reason text NOT NULL, status text NOT NULL DEFAULT 'pending',
 reviewed_by uuid REFERENCES users(id), reviewed_at timestamptz, review_note text, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE invitation_audit_log (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), invitation_id uuid NOT NULL REFERENCES invitations(id), actor_id uuid REFERENCES users(id),
 action text NOT NULL, previous_values jsonb, new_values jsonb, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE invitation_guests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), invitation_id uuid NOT NULL REFERENCES invitations(id), display_name text NOT NULL,
 token_hash text NOT NULL UNIQUE, locale text, max_party_size integer NOT NULL DEFAULT 1 CHECK(max_party_size > 0), revoked_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX guests_invitation_idx ON invitation_guests(invitation_id);
CREATE TABLE wishes (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), invitation_id uuid NOT NULL REFERENCES invitations(id), guest_id uuid REFERENCES invitation_guests(id),
 name text NOT NULL, message text NOT NULL, status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','hidden','deleted')),
 created_at timestamptz NOT NULL DEFAULT now(), moderated_at timestamptz, moderated_by uuid REFERENCES users(id), deleted_at timestamptz
);
CREATE INDEX wishes_invitation_idx ON wishes(invitation_id,status,created_at);
CREATE TABLE rsvp_responses (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), invitation_id uuid NOT NULL REFERENCES invitations(id), guest_id uuid REFERENCES invitation_guests(id),
 name text NOT NULL, status text NOT NULL CHECK(status IN ('yes','no','maybe')), party_size integer NOT NULL CHECK(party_size BETWEEN 0 AND 100),
 note text, response_token_hash text UNIQUE, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX rsvp_invitation_idx ON rsvp_responses(invitation_id);
CREATE TABLE media_assets (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), owner_id uuid NOT NULL REFERENCES users(id), draft_id uuid,
 object_key text NOT NULL UNIQUE, url text, filename text NOT NULL, mime_type text NOT NULL, size_bytes bigint NOT NULL CHECK(size_bytes >= 0),
 visibility text NOT NULL DEFAULT 'private' CHECK(visibility IN ('private','public')), status text NOT NULL DEFAULT 'pending', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE jobs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), type text NOT NULL, payload jsonb NOT NULL, idempotency_key text UNIQUE,
 status text NOT NULL DEFAULT 'queued', attempts integer NOT NULL DEFAULT 0, available_at timestamptz NOT NULL DEFAULT now(), locked_at timestamptz,
 last_error text, created_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz
);
CREATE INDEX jobs_pending_idx ON jobs(status,available_at);
CREATE TABLE rate_limits (
 key text PRIMARY KEY, window_start timestamptz NOT NULL DEFAULT now(), count integer NOT NULL DEFAULT 1 CHECK(count > 0)
);
