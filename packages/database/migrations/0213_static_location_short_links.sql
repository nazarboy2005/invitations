CREATE TABLE static_location_short_links (
  code text PRIMARY KEY CHECK (code ~ '^[0-9A-Za-z]{8}$'),
  target_url text NOT NULL UNIQUE CHECK (target_url ~ '^https://yandex[.]uz/maps/'),
  created_at timestamptz NOT NULL DEFAULT now()
);
