CREATE TABLE template_favorites (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id text NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  saved_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, template_id)
);
