import test from "node:test";
import assert from "node:assert/strict";
import {
  formatDate,
  calendarWeekdays,
  eventInstant,
  eventWallDate,
} from "../apps/web/src/templates/date-format";
const full = { day: "numeric", month: "long", year: "numeric" } as const;
test("Uzbek dates render explicit Latin/Cyrillic wording regardless of browser ICU", () => {
  assert.equal(
    formatDate("2026-12-16T18:00", "uz-Latn", "Asia/Tashkent", full),
    "16 dekabr 2026",
  );
  assert.equal(
    formatDate("2026-12-16T18:00", "uz-Cyrl", "Asia/Tashkent", full),
    "16 декабр 2026",
  );
  assert.equal(
    formatDate("2026-12-16T18:00", "uz-Latn", "Asia/Tashkent", {
      weekday: "long",
    }),
    "Chorshanba",
  );
  assert.deepEqual(calendarWeekdays("uz-Latn"), [
    "Du",
    "Se",
    "Ch",
    "Pa",
    "Ju",
    "Sh",
    "Ya",
  ]);
});
test("event-local wall dates are stable and offset instants use event timezone", () => {
  assert.equal(
    eventInstant("2026-12-16T18:00", "Asia/Tashkent")?.toISOString(),
    "2026-12-16T13:00:00.000Z",
  );
  assert.equal(
    eventWallDate("2026-12-16T22:00:00Z", "Asia/Tashkent")?.toISOString(),
    "2026-12-17T12:00:00.000Z",
  );
  assert.equal(
    formatDate("2026-12-16T18:00", "uz-Latn", "Asia/Tashkent", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    "18:00",
  );
  assert.equal(
    formatDate("2026-12-16T22:00:00Z", "uz-Latn", "Asia/Tashkent", full),
    "17 dekabr 2026",
  );
  assert.equal(formatDate("invalid", "en", "Asia/Tashkent", full), "");
});
