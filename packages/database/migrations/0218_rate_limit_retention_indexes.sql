CREATE INDEX rate_limits_window_start_idx ON rate_limits(window_start);
CREATE INDEX auth_requests_expiry_idx ON auth_requests(expires_at);
CREATE INDEX miniapp_exchanges_expiry_idx ON miniapp_exchanges(expires_at);
