-- A sequence gives every new pin a distinct order, including rapid re-pins.
CREATE SEQUENCE template_pin_order_seq;
ALTER TABLE templates ADD COLUMN pinned_order bigint
  CHECK (pinned_order IS NULL OR pinned_order > 0);
ALTER SEQUENCE template_pin_order_seq OWNED BY templates.pinned_order;
CREATE UNIQUE INDEX templates_pinned_order_idx ON templates(pinned_order)
  WHERE pinned_order IS NOT NULL;
