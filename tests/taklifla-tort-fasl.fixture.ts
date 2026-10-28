import { writeFileSync } from "node:fs";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";
import { makeFasllarPayload } from "../apps/web/src/templates/taklifla-tort-fasl/adapter";
const invitation = createTemplatePreviewSample("taklifla-tort-fasl");
const message = makeFasllarPayload(invitation, "uz-Latn", "", {
  invitationId: "fasllar-qa",
  preview: true,
  silentPlayback: true,
});
writeFileSync(".tmp-fasllar-fixture.json", JSON.stringify(message));
