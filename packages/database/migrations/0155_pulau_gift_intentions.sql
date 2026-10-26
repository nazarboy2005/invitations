CREATE TABLE pulau_gift_intentions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id uuid NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  guest_id uuid REFERENCES invitation_guests(id) ON DELETE SET NULL,
  sender_name text NOT NULL CHECK (char_length(sender_name) BETWEEN 1 AND 100),
  amount_minor bigint NOT NULL CHECK (amount_minor BETWEEN 1 AND 1000000000000),
  currency_label text NOT NULL CHECK (char_length(currency_label) BETWEEN 1 AND 30),
  message text NOT NULL DEFAULT '' CHECK (char_length(message) <= 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX pulau_gift_intentions_recent_idx ON pulau_gift_intentions(invitation_id, created_at DESC, id DESC);
