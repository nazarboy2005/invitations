ALTER TABLE admin_audit_log DROP CONSTRAINT admin_audit_log_action_check;
ALTER TABLE admin_audit_log ADD CONSTRAINT admin_audit_log_action_check CHECK (action IN (
  'template.update','category.create','category.update','music.create','music.update',
  'user.suspend','user.restore','user.revoke_sessions','payment.create','payment.update',
  'broadcast.create','broadcast.confirm','broadcast.cancel',
  'invitation.create','invitation.update','invitation.publish','invitation.archive',
  'invitation.delete','invitation.extend_deadline','invitation.moderate','invitation.upload',
  'invitation.review_correction'
));
