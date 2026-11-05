import {
  imageSlot as s,
  staticContent,
  type StaticImageDesign,
} from "../static-design";

/** Light botanical stationery; coordinates are final 1500 × 2100 pixels. */
export const saharIfori: StaticImageDesign = {
  folder: "sahar-ifori",
  background: "background.png",
  ink: "#586049",
  qrInk: "#586049",
  qrPaper: "#fffaf1",
  qr: { x: 275, y: 1765, size: 190 },
  calligraphy: true,
  composition: `<svg class="composition" width="1500" height="2100" viewBox="0 0 1500 2100" fill="none" stroke="#b39b73" stroke-width="1.4">
    <path d="M620 347h100m60 0h100 M738 347q12-17 24 0-12 17-24 0Z" opacity=".7"/>
    <path d="M310 1190h360m160 0h360 M310 1405h880 M600 1230v135 M900 1230v135" opacity=".6"/>
    <path d="M730 1190q20-13 40 0-20 13-40 0Z M255 1750h35m-35 0v35m225-35h-35m35 0v35m-225 185h35m-35 0v-35m225 35h-35m35 0v-35" opacity=".7"/>
  </svg>`,
  slots(invitation, locale) {
    const { c, upper, month, year, day, weekday, time, address, and, labels } =
      staticContent(invitation, locale);
    const left = { align: "left" as const };
    return [
      s("eventLabel", upper(c.eventLabel), 440, 250, 720, 55, 30, 24, {
        tracking: 5,
      }),
      s("people.0", c.people[0] ?? "", 360, 390, 880, 175, 157, 64, {
        font: "calligraphy",
        lineHeight: 1.2,
      }),
      s("and", and, 710, 580, 180, 60, 54, 44, {
        italic: true,
        color: "#ab8c6d",
      }),
      s("people.1", c.people[1] ?? "", 360, 665, 880, 175, 157, 64, {
        font: "calligraphy",
        lineHeight: 1.2,
      }),
      s("greeting", c.greeting, 300, 900, 900, 60, 36, 28, { italic: true }),
      s(
        "message",
        c.message,
        300,
        c.greeting.trim() ? 985 : 925,
        900,
        c.greeting.trim() ? 155 : 215,
        39,
        29,
        { lineHeight: 1.3 },
      ),
      s("date.month", month, 310, 1235, 260, 55, 37, 27, { tracking: 3 }),
      s("date.weekday", weekday, 310, 1310, 260, 40, 30, 23, { italic: true }),
      s("date.day", day, 635, 1215, 230, 160, 137, 105),
      s("date.year", year, 930, 1235, 260, 55, 38, 30, { tracking: 4 }),
      s("time", time, 930, 1310, 260, 40, 32, 26, { italic: true }),
      s(
        "venueLabel",
        c.venueName ? labels.venue : "",
        275,
        1465,
        685,
        40,
        25,
        22,
        { ...left, tracking: 4 },
      ),
      s("venueName", c.venueName, 275, 1525, 685, 90, 48, 33, {
        ...left,
        lineHeight: 1.12,
      }),
      s("address", address, 275, 1630, 670, 100, 32, 25, {
        ...left,
        lineHeight: 1.25,
      }),
      s("qrLabel", labels.qr, 515, 1780, 420, 55, 37, 29, {
        ...left,
        italic: true,
      }),
      s("qrHint", labels.scan, 515, 1845, 400, 80, 27, 23, {
        ...left,
        lineHeight: 1.25,
      }),
      s("hosts", c.hosts, 515, 1930, 420, 40, 28, 23, {
        ...left,
        italic: true,
      }),
    ];
  },
};
