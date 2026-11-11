-- Approved launch prices in UZS minor units (100 minor units = 1 so'm).
-- Static image invitations stay free. Existing order/payment quotes are immutable.
DO $$
BEGIN
  IF (
    SELECT count(*) FROM templates
    WHERE id IN ('osmon', 'ganch', 'baxmal-saroy', 'palov', 'xatna', 'shirin-bayram')
      AND format = 'web'
  ) <> 6 THEN
    RAISE EXCEPTION 'All six launch price exceptions must exist as website templates';
  END IF;
END $$;

UPDATE templates
SET price_minor = CASE
      WHEN id IN ('osmon', 'ganch', 'baxmal-saroy') THEN 9900000
      WHEN id IN ('palov', 'xatna', 'shirin-bayram') THEN 3900000
      ELSE 4900000
    END,
    currency = 'UZS',
    updated_at = now()
WHERE format = 'web';
