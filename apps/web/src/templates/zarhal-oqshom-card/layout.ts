import {
  imageSlot as s,
  staticContent,
  type StaticImageDesign,
} from "../static-design";

export const zarhalOqshom: StaticImageDesign = {
  folder: "zarhal-oqshom-card",
  background: "background.svg",
  ink: "#ead6ae",
  qrInk: "#28251e",
  qrPaper: "#f9edcf",
  qr: { x: 1050, y: 1685, size: 205 },
  displayFont: true,
  composition: `<svg class="composition" width="1500" height="2100" viewBox="0 0 1500 2100" fill="none" stroke="#bf9b5e" stroke-width="1.5">
    <path d="M240 1300h1020 M240 1515h1020 M450 1340v130 M960 1340v130 M240 1905h1020" opacity=".65"/>
    <path d="M1028 1663h249v249h-249Z M1020 1655h265v265h-265Z"/>
    <path d="M1010 1940h285m-266 10h247m-218 10h189" opacity=".45"/>
  </svg>`,
  slots(invitation, locale) {
    const { c, upper, month, year, day, time, address, and, labels } =
      staticContent(invitation, locale);
    return [
      s("eventLabel", upper(c.eventLabel), 260, 400, 980, 65, 31, 25, {
        font: "display",
        tracking: 9,
      }),
      s("people.0", upper(c.people[0] ?? ""), 215, 565, 1010, 155, 117, 58, {
        font: "display",
        align: "left",
        tracking: 6,
      }),
      s("and", and, 295, 743, 140, 95, 80, 60, {
        italic: true,
        color: "#b89156",
      }),
      s("people.1", upper(c.people[1] ?? ""), 435, 830, 850, 150, 117, 58, {
        font: "display",
        align: "right",
        tracking: 6,
      }),
      s("greeting", c.greeting, 300, 1045, 900, 60, 35, 28, { italic: true }),
      s(
        "message",
        c.message,
        300,
        c.greeting.trim() ? 1125 : 1065,
        900,
        c.greeting.trim() ? 135 : 195,
        39,
        29,
        { lineHeight: 1.3 },
      ),
      s("date.day", day, 240, 1335, 175, 145, 130, 100, { font: "display" }),
      s("date.month", month, 490, 1350, 420, 65, 43, 30, {
        font: "display",
        tracking: 4,
      }),
      s("date.year", year, 490, 1425, 420, 50, 34, 28, { tracking: 8 }),
      s("time", time, 995, 1355, 265, 80, 62, 46, { font: "display" }),
      s("timeLabel", labels.time, 995, 1440, 265, 35, 23, 21, {
        font: "display",
        tracking: 5,
      }),
      s(
        "venueLabel",
        c.venueName ? labels.venue : "",
        240,
        1570,
        720,
        40,
        25,
        22,
        { align: "left", font: "display", tracking: 4 },
      ),
      s("venueName", c.venueName, 240, 1625, 710, 100, 46, 32, {
        align: "left",
        lineHeight: 1.12,
      }),
      s("address", address, 240, 1740, 710, 125, 32, 25, {
        align: "left",
        lineHeight: 1.25,
      }),
      s("hosts", c.hosts, 240, 1940, 730, 65, 30, 24, {
        align: "left",
        italic: true,
      }),
      s("qrHint", labels.scan, 1005, 1565, 300, 75, 25, 22, {
        lineHeight: 1.2,
      }),
    ];
  },
};
