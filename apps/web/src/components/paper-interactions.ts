import type { MouseEvent, PointerEvent } from "react";

/** Shared single-open behavior; pointer focus must not consume a phone's first tap. */
export function paperInteractions({
  id,
  isActive,
  select,
  keyboardPaperFocused,
}: {
  id: string;
  isActive: () => boolean;
  select: (id: string | null) => void;
  keyboardPaperFocused: () => boolean;
}) {
  let pointerPressed = false;
  return {
    onPointerDown() {
      pointerPressed = true;
    },
    onPointerCancel() {
      pointerPressed = false;
    },
    onPointerEnter(
      event: Pick<PointerEvent<HTMLAnchorElement>, "pointerType">,
    ) {
      if (event.pointerType !== "touch" && !keyboardPaperFocused()) select(id);
    },
    onPointerMove(event: Pick<PointerEvent<HTMLAnchorElement>, "pointerType">) {
      // A real pointer movement may take over from keyboard focus; scrolling
      // a stationary pointer over another paper must not steal that focus.
      if (event.pointerType !== "touch" && !isActive()) select(id);
    },
    onPointerLeave(
      event: Pick<
        PointerEvent<HTMLAnchorElement>,
        "pointerType" | "currentTarget"
      >,
    ) {
      if (
        isActive() &&
        event.pointerType !== "touch" &&
        !event.currentTarget.matches(":focus-visible")
      )
        select(null);
    },
    onFocus() {
      if (!pointerPressed) select(id);
    },
    onBlur() {
      pointerPressed = false;
      if (isActive()) select(null);
    },
    onClick(
      event: Pick<
        MouseEvent<HTMLAnchorElement>,
        "metaKey" | "ctrlKey" | "shiftKey" | "altKey" | "preventDefault"
      >,
    ) {
      pointerPressed = false;
      if (
        !isActive() &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.altKey
      ) {
        event.preventDefault();
        select(id);
      }
    },
  };
}
