-- User correction: static image invitations cost 5,000 UZS per event.
-- Keep historical order quotes and already finalized invitations unchanged.
UPDATE templates
SET price_minor = 500000, currency = 'UZS', updated_at = now()
WHERE format = 'image';
