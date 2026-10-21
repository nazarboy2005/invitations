"use client";

import type { ComponentProps } from "react";
import { MarxabaInvitation } from "./renderer";

type Props = Omit<ComponentProps<typeof MarxabaInvitation>, "templateId">;

/** Oltin Kuz keeps its captured markup and motion inside the shared Marxaba adapter. */
export function OltinKuzInvitation(props: Props) {
  return <MarxabaInvitation {...props} templateId="oltin-kuz" />;
}
