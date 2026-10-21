UPDATE invitations AS invitation
SET data = jsonb_set(
  invitation.data,
  '{contacts}',
  jsonb_build_object(
    'phoneNumber', COALESCE((
      SELECT contact->>'value'
      FROM jsonb_array_elements(
        CASE
          WHEN jsonb_typeof(invitation.data->'contacts') = 'array'
            THEN invitation.data->'contacts'
          ELSE '[]'::jsonb
        END
      ) WITH ORDINALITY AS legacy(contact, position)
      WHERE contact->>'type' = 'phone'
        AND NULLIF(BTRIM(contact->>'value'), '') IS NOT NULL
      ORDER BY position
      LIMIT 1
    ), ''),
    'telegramUsername', COALESCE((
      SELECT contact->>'value'
      FROM jsonb_array_elements(
        CASE
          WHEN jsonb_typeof(invitation.data->'contacts') = 'array'
            THEN invitation.data->'contacts'
          ELSE '[]'::jsonb
        END
      ) WITH ORDINALITY AS legacy(contact, position)
      WHERE contact->>'type' = 'telegram'
        AND NULLIF(BTRIM(contact->>'value'), '') IS NOT NULL
      ORDER BY position
      LIMIT 1
    ), '')
  ),
  true
),
updated_at = now()
WHERE jsonb_typeof(invitation.data->'contacts') IS DISTINCT FROM 'object';
