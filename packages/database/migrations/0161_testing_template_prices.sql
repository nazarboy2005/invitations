-- User-requested test pricing: 1,000 soums = 100,000 minor units.
-- Preserve historical manual payments and immutable online order snapshots.
UPDATE templates SET price_minor=100000,currency='UZS',updated_at=now();
