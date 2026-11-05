import { imageSlots, IMAGE_LOCATION_QR } from "./ivory-rose-card/layout";
import { ivoryRoseComposition } from "./ivory-rose-card/composition";
import { zumradNaqshSlots, ZUMRAD_NAQSH_QR } from "./zumrad-naqsh/layout";
import { lolaMaktubi } from "./lola-maktubi/layout";
import { moviyRavoq } from "./moviy-ravoq-card/layout";
import { zarhalOqshom } from "./zarhal-oqshom-card/layout";
import { saharIfori } from "./sahar-ifori/layout";
import type { StaticImageDesign } from "./static-design";

/** Server-side, explicit allowlist; private asset paths never come from requests. */
export const STATIC_IMAGE_DESIGNS: Readonly<Record<string, StaticImageDesign>> =
  {
    "ivory-rose-card": {
      folder: "ivory-rose-card",
      background: "background.png",
      ink: "#55513d",
      qrInk: "#454337",
      qrPaper: "#fffdf7",
      qr: IMAGE_LOCATION_QR,
      calligraphy: true,
      composition: ivoryRoseComposition,
      slots: imageSlots,
    },
    "zumrad-naqsh": {
      folder: "zumrad-naqsh",
      background: "background.svg",
      ink: "#f1e6c7",
      qrInk: "#12392f",
      qrPaper: "#fffdf7",
      qr: ZUMRAD_NAQSH_QR,
      slots: zumradNaqshSlots,
    },
    "lola-maktubi": lolaMaktubi,
    "moviy-ravoq-card": moviyRavoq,
    "zarhal-oqshom-card": zarhalOqshom,
    "sahar-ifori": saharIfori,
  };
