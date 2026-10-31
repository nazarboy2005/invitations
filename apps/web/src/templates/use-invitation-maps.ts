"use client";
import { publicAsset } from "../lib/public-asset";

import { useEffect, type RefObject } from "react";

/** Install shared guest actions without changing a template's source composition. */
export function useInvitationMaps(frame: RefObject<HTMLIFrameElement | null>) {
  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const install = () => {
      const document = element.contentDocument;
      if (!document?.body || document.querySelector("script[data-invitation-maps]")) return;
      const script = document.createElement("script");
      script.dataset.invitationMaps = "true";
      script.src = publicAsset("/templates/shared/yandex-maps.js");
      document.body.append(script);
    };
    element.addEventListener("load", install);
    install();
    return () => element.removeEventListener("load", install);
  }, [frame]);
}
