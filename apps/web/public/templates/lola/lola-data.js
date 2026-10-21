(() => {
  "use strict";
  const invitation = window.MARHAMAT_REMOTE;
  if (!invitation || !location.pathname.includes("/lola/")) return;

  const fitSinglePerson = (localized) => {
    if (typeof localized.bride !== "string" || !localized.bride.trim()) {
      localized.bride = localized.groom || "";
    }
  };

  fitSinglePerson(invitation);
  for (const localized of Object.values(invitation.i18n || {})) {
    if (!localized || typeof localized !== "object") continue;
    fitSinglePerson(localized);
  }

  // Language changes update the frame's payload without reloading the source.
  // Patch that cloned payload before the shared runtime consumes it as well.
  window.addEventListener("message", (event) => {
    if (event.origin !== location.origin || event.data?.type !== "marxaba:update") return;
    const payload = event.data.payload;
    if (!payload) return;
    fitSinglePerson(payload);
    for (const localized of Object.values(payload.i18n || {})) {
      if (localized && typeof localized === "object") fitSinglePerson(localized);
    }
  });
})();
