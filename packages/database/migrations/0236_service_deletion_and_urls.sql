-- Preserve the import history when a service is renamed or permanently deleted.
ALTER TABLE service_import_jobs DROP CONSTRAINT service_import_jobs_service_slug_fkey;
ALTER TABLE service_import_jobs ADD CONSTRAINT service_import_jobs_service_slug_fkey
  FOREIGN KEY (service_slug) REFERENCES service_listings(slug) ON UPDATE CASCADE ON DELETE SET NULL;

-- Keep the existing audit vocabulary and allow durable deletion records.
DO $$
DECLARE definition text;
BEGIN
  SELECT pg_get_constraintdef(oid) INTO definition FROM pg_constraint
    WHERE conrelid='admin_audit_log'::regclass AND conname='admin_audit_log_action_check';
  ALTER TABLE admin_audit_log DROP CONSTRAINT admin_audit_log_action_check;
  EXECUTE 'ALTER TABLE admin_audit_log ADD CONSTRAINT admin_audit_log_action_check '
    || regexp_replace(definition, '\)$', ' OR action = ''service.delete'')');
END $$;
