-- The captured Shirin Bayram source supports birthdays only. Remove any
-- legacy compatibility rows left by earlier catalog initialization.
DELETE FROM template_supported_event_types
WHERE template_id = 'shirin-bayram'
  AND event_type <> 'birthday';

INSERT INTO template_supported_event_types (template_id, event_type)
VALUES ('shirin-bayram', 'birthday')
ON CONFLICT DO NOTHING;
