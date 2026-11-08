import {
  imageSlot as s,
  staticContent,
  type StaticImageDesign,
} from "../static-design";

export const moviyRavoq: StaticImageDesign = {
  folder: "moviy-ravoq",
  background: "background.png",
  ink: "#23467f",
  qrInk: "#23467f",
  qrPaper: "#fffbf1",
  qr: { x: 1055, y: 1730, size: 205 },
  composition: `<svg class="composition" width="1500" height="2100" viewBox="0 0 1500 2100" fill="none" stroke="#42629d" stroke-width="1.5">
    <path d="M500 735h140m220 0h140 M270 1130h960 M270 1405h960 M600 1195v135m300-135v135" opacity=".5"/>
    <path d="M1040 1715h-6v40m240-40h7v40m-247 157v40h6m234 0h7v-40"/>
    <path d="M275 1710h85" opacity=".6"/>
  </svg>`,
  slots(invitation, locale) {
    const { c, upper, month, year, day, weekday, time, address, and, labels } =
      staticContent(invitation, locale);
    return [
      s("greeting", c.greeting, 380, 340, 740, 70, 34, 27, { italic: true }),
      s("eventLabel", upper(c.eventLabel), 350, 440, 800, 55, 30, 24, {
        tracking: 6,
      }),
      s("people.0", c.people[0] ?? "", 245, 550, 1010, 145, 128, 63, {
        italic: true,
      }),
      s("and", and, 685, 701, 130, 70, 52, 42, { italic: true }),
      s("people.1", c.people[1] ?? "", 245, 795, 1010, 145, 128, 63, {
        italic: true,
      }),
      s("message", c.message, 280, 973, 940, 125, 39, 29, { lineHeight: 1.3 }),
      s("date.day", day, 640, 1170, 220, 150, 138, 105),
      s("date.month", month, 610, 1325, 280, 50, 35, 27, { tracking: 3 }),
      s("date.weekday", weekday, 270, 1210, 300, 60, 37, 28, { italic: true }),
      s("date.year", year, 270, 1280, 300, 55, 37, 30, { tracking: 5 }),
      s("time", time, 930, 1200, 300, 80, 63, 46, { tracking: 2 }),
      s("timeLabel", labels.time, 930, 1295, 300, 40, 25, 23, { tracking: 5 }),
      s(
        "venueLabel",
        c.venueName ? labels.venue : "",
        280,
        1455,
        940,
        40,
        25,
        22,
        { tracking: 4 },
      ),
      s("venueName", c.venueName, 260, 1505, 980, 85, 48, 33),
      s("address", address, 285, 1600, 930, 90, 32, 25, { lineHeight: 1.25 }),
      s("hosts", c.hosts, 275, 1750, 680, 75, 35, 27, {
        align: "left",
        italic: true,
      }),
      s("qrLabel", labels.qr, 275, 1840, 680, 45, 31, 27, {
        align: "left",
        italic: true,
      }),
      s("qrHint", labels.scan, 275, 1890, 680, 40, 26, 22, { align: "left" }),
    ];
  },
};
