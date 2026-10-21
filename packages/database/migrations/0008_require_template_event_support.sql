CREATE FUNCTION enforce_template_event_support()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  affected_template_id text;
BEGIN
  IF TG_TABLE_NAME = 'templates' THEN
    affected_template_id := NEW.id;
  ELSIF TG_OP = 'DELETE' THEN
    affected_template_id := OLD.template_id;
  ELSE
    affected_template_id := NEW.template_id;
  END IF;

  IF EXISTS (SELECT 1 FROM templates WHERE id = affected_template_id)
     AND NOT EXISTS (
       SELECT 1 FROM template_supported_event_types
       WHERE template_id = affected_template_id
     ) THEN
    RAISE EXCEPTION 'Template % must support at least one event type', affected_template_id;
  END IF;

  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER templates_require_supported_event_type
AFTER INSERT OR UPDATE ON templates
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION enforce_template_event_support();

CREATE CONSTRAINT TRIGGER template_event_support_cannot_be_empty
AFTER INSERT OR UPDATE OR DELETE ON template_supported_event_types
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION enforce_template_event_support();
