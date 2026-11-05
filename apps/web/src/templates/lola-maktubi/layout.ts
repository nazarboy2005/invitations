import {
  imageSlot as s,
  staticContent,
  type StaticImageDesign,
} from "../static-design";

export const lolaMaktubi: StaticImageDesign = {
  folder: "lola-maktubi",
  background: "background.png",
  ink: "#612735",
  qrInk: "#612735",
  qrPaper: "#fff9ef",
  qr: { x: 210, y: 1725, size: 205 },
  calligraphy: true,
  composition: `<svg class="composition" width="1500" height="2100" viewBox="0 0 1500 2100" fill="none" stroke="#823743" stroke-width="1.5">
    <path d="M210 323h110m18 0 7-5 7 5-7 5Z M210 1115h665 M210 1330h665 M370 1150v140" opacity=".65"/>
    <path d="M210 1690h80 M190 1713h-5v40m0 144v40h40m172 0h30v-30m0-154v-40h-5" opacity=".65"/>
  </svg>`,
  slots(invitation, locale) {
    const { c, upper, month, year, day, weekday, time, address, and, labels } =
      staticContent(invitation, locale);
    const left = { align: "left" as const };
    return [
      s("eventLabel", upper(c.eventLabel), 210, 230, 735, 55, 30, 24, {
        ...left,
        tracking: 5,
      }),
      s("people.0", c.people[0] ?? "", 210, 370, 780, 170, 148, 64, {
        ...left,
        font: "calligraphy",
        lineHeight: 1.22,
      }),
      s("and", and, 218, 544, 110, 65, 53, 45, { ...left, italic: true }),
      s("people.1", c.people[1] ?? "", 210, 620, 780, 170, 148, 64, {
        ...left,
        font: "calligraphy",
        lineHeight: 1.22,
      }),
      s("greeting", c.greeting, 210, 835, 705, 65, 35, 27, {
        ...left,
        italic: true,
      }),
      s(
        "message",
        c.message,
        210,
        c.greeting.trim() ? 920 : 860,
        705,
        c.greeting.trim() ? 145 : 205,
        38,
        28,
        { ...left, lineHeight: 1.35 },
      ),
      s("date.day", day, 210, 1140, 140, 150, 133, 100, left),
      s("date.month", `${month} ${year}`, 415, 1158, 460, 60, 38, 28, {
        ...left,
        tracking: 2,
      }),
      s("time", `${weekday} · ${time}`, 415, 1230, 460, 62, 37, 28, {
        ...left,
        italic: true,
      }),
      s(
        "venueLabel",
        c.venueName ? labels.venue : "",
        210,
        1385,
        705,
        40,
        25,
        22,
        { ...left, tracking: 4 },
      ),
      s("venueName", c.venueName, 210, 1440, 705, 95, 50, 33, {
        ...left,
        lineHeight: 1.12,
      }),
      s("address", address, 210, 1548, 705, 115, 33, 25, {
        ...left,
        lineHeight: 1.28,
      }),
      s("qrLabel", labels.qr, 460, 1750, 400, 60, 38, 29, {
        ...left,
        italic: true,
      }),
      s("qrHint", labels.scan, 460, 1820, 380, 90, 28, 24, {
        ...left,
        lineHeight: 1.3,
      }),
      s("hosts", c.hosts, 210, 1950, 680, 65, 31, 25, {
        ...left,
        italic: true,
      }),
    ];
  },
};
