-- Independent of edit_deadline_at: an admin extension does not approve a new date.
ALTER TABLE invitations ADD COLUMN approved_event_date text;
UPDATE invitations SET approved_event_date=left(data->>'startsAt',10)
WHERE identity_locked_at IS NOT NULL OR status='published';
CREATE INDEX invitation_change_requests_queue_idx
ON invitation_change_requests(status,created_at DESC);
