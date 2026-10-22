"use client";

import { useEffect, useState } from "react";

export function AccountLinkLabel({ signedIn }: { signedIn: boolean }) {
  const [miniApp, setMiniApp] = useState(false);
  useEffect(() => {
    setMiniApp(Boolean(window.Telegram?.WebApp?.initData));
  }, []);
  return signedIn || miniApp ? "Taklifnomalarim" : "Kirish";
}

