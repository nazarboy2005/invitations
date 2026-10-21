UPDATE invitations
SET data=jsonb_set(data, '{gift}', (data->'gift')-'bankName'), updated_at=now()
WHERE data->'gift' ? 'bankName';
