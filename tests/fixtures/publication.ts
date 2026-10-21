import {
  createInvitation,
  defaultLocalizedInvitationContent,
} from "../../packages/contracts/src/index";
export function completeInvitation() {
  const invitation = createInvitation("anor");
  invitation.eventType = "wedding";
  invitation.content["uz-Latn"] = defaultLocalizedInvitationContent(
    "wedding",
    "uz-Latn",
  );
  invitation.startsAt = "2027-06-14T18:30";
  invitation.timezone = "Asia/Tashkent";
  invitation.content["uz-Latn"].people = ["Nodir test", "Madina test"];
  invitation.content["uz-Latn"].venueName = "Test venue";
  invitation.content["uz-Latn"].address = "Test address";
  return invitation;
}
