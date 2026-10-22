"use client";

import { useEffect, useRef } from "react";

export function InvitationViewTracker({
  invitationId,
}: {
  invitationId: string;
}) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    void fetch(
      `/api/public/invitations/${encodeURIComponent(invitationId)}/view`,
      {
        method: "POST",
        cache: "no-store",
        keepalive: true,
      },
    ).catch(() => {
      // A view metric must never interfere with opening the invitation.
    });
  }, [invitationId]);

  return null;
}
