import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";
import { makeTungiSaroyPayload } from "../apps/web/src/templates/taklifla-tungi-saroy/adapter";
import { makeTovusPayload } from "../apps/web/src/templates/taklifla-tovus/adapter";
const records = ["taklifla-tungi-saroy", "taklifla-tovus"].map((id) => {
  const invitation = createTemplatePreviewSample(id);
  const options = {
    invitationId: "qa-luxury",
    preview: true,
    sampleWishes: true,
    silentPlayback: true,
  };
  return {
    id,
    invitation,
    message: id.endsWith("tovus")
      ? makeTovusPayload(invitation, "uz-Latn", "", options)
      : makeTungiSaroyPayload(invitation, "uz-Latn", options),
  };
});
console.log(JSON.stringify(records));
