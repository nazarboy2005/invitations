CREATE TABLE service_favorites (
 user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 service_slug text NOT NULL,
 saved_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY (user_id, service_slug)
);
