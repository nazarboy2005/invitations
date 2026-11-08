import {
  invitationSchema,
  terracottaDataSchema,
  starryDataSchema,
  sharlarDataSchema,
  sakuraDataSchema,
  qogozDataSchema,
  pariDataSchema,
  osmonDataSchema,
  oltinYolDataSchema,
  mountainDataSchema,
  zarrinDataSchema,
  gulbogDataSchema,
  fayzliXonadonDataSchema,
  yubileySahifasiDataSchema,
  muhrliMaktubDataSchema,
  pulauSehatiDataSchema,
  type Invitation,
  type JsonValue,
} from "@taklifnoma/contracts";
import {
  applyOptionalFeatureVisibility,
  normalizeInvitation,
} from "@taklifnoma/contracts/capabilities";
import type { ZodType } from "zod";

// Match the template-specific authoring contracts. Never serialize the open
// templateData record directly: it can retain data from previous templates.
const publicTemplateSchemas: Record<string, ZodType> = {
  "terrakota": terracottaDataSchema,
  "yulduzli-tun": starryDataSchema,
  "sharlar": sharlarDataSchema,
  "sakura-guli": sakuraDataSchema,
  "qogoz-ertagi": qogozDataSchema,
  "parilar-ertagi": pariDataSchema,
  "osmon": osmonDataSchema,
  "oltin-yol": oltinYolDataSchema,
  "toglar-bagrida": mountainDataSchema,
  "zarrin-gullar": zarrinDataSchema,
  "gulbog": gulbogDataSchema,
  "fayzli-xonadon": fayzliXonadonDataSchema,
  "umr-bahori": yubileySahifasiDataSchema,
  "muhrli-maktub": muhrliMaktubDataSchema,
  "kongillar-oroli": pulauSehatiDataSchema,
};

/** Guest-facing data only; never mutate the creator's recoverable saved data. */
export function publicInvitationData(data: unknown): Invitation {
  const invitation = applyOptionalFeatureVisibility(
    normalizeInvitation(invitationSchema.parse(data)),
  );
  const schema = publicTemplateSchemas[invitation.templateId];
  const details = schema?.parse(
    invitation.templateData[invitation.templateId] ?? {},
  ) as JsonValue | undefined;
  return {
    ...invitation,
    content: Object.fromEntries(
      Object.entries(invitation.content).filter(([locale]) =>
        invitation.enabledLocales.includes(
          locale as Invitation["defaultLocale"],
        ),
      ),
    ),
    templateData:
      details === undefined ? {} : { [invitation.templateId]: details },
    music: invitation.music.enabled
      ? invitation.music
      : { enabled: false, assetId: null, url: "", filename: "" },
    gift: invitation.gift.enabled
      ? invitation.gift
      : {
          enabled: false,
          receiptUploadEnabled: false,
          cardNumber: "",
          cardHolder: "",
        },
    dressCode: invitation.dressCode.enabled
      ? invitation.dressCode
      : { enabled: false, style: {}, text: {}, note: {}, colors: [] },
  };
}
