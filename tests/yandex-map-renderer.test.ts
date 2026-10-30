import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const source = readFileSync(new URL("../apps/web/public/maps/venue.js", import.meta.url), "utf8");

function render(languages: string[], timeZone = "") {
  const destination = { href: "", remove() {} };
  let script: { src: string } | undefined;
  runInNewContext(source, {
    URL, URLSearchParams,
    location: new URL("https://invitations.example/maps/venue?latitude=41.328372&longitude=69.224814&lang=en"),
    navigator: { languages, language: languages[0] },
    Intl: { DateTimeFormat: () => ({ resolvedOptions: () => ({ timeZone }) }) },
    setTimeout: () => 0, clearTimeout() {},
    document: {
      documentElement: {}, body: { dataset: { yandexKey: "test-public-key" } },
      getElementById: (id: string) => id === "destination" ? destination : {},
      createElement: () => ({}),
      head: { append: (element: { src: string }) => { script = element; } },
    },
  });
  assert.ok(script, "a valid point should load the renderer");
  return { provider: new URL(script.src), destination: new URL(destination.href) };
}

test("embedded map follows supported viewer languages and uses Russian for Uzbek", () => {
  for (const [language, expected] of [
    ["uz-Latn-UZ", "ru_RU"], ["uz-Cyrl", "ru_RU"], ["ru-RU", "ru_RU"],
    ["en-GB", "en_RU"], ["tr-TR", "tr_TR"], ["uk-UA", "uk_UA"],
  ]) assert.equal(render([language]).provider.searchParams.get("lang"), expected, language);
  assert.equal(render(["fr-FR", "tr-TR"]).provider.searchParams.get("lang"), "tr_TR");
});

test("Uzbekistan uses Russian; other timezones are a fallback for unsupported languages", () => {
  for (const [zone, expected] of [
    ["Asia/Tashkent", "ru_RU"], ["Asia/Samarkand", "ru_RU"], ["Europe/Moscow", "ru_RU"],
    ["Europe/Istanbul", "tr_TR"], ["Europe/Kyiv", "uk_UA"], ["Europe/London", "en_RU"],
  ]) assert.equal(render(["de-DE"], zone).provider.searchParams.get("lang"), expected, zone);
  assert.equal(render(["en-US"], "Asia/Tashkent").provider.searchParams.get("lang"), "ru_RU");
  assert.equal(render(["en-US"], "Europe/Moscow").provider.searchParams.get("lang"), "en_RU");
  assert.equal(render([], "").provider.searchParams.get("lang"), "en_RU");
});

test("viewer map language never changes the guest's exact Uzbek destination", () => {
  for (const language of ["uz-UZ", "ru-RU", "en-US", "tr-TR", "uk-UA"]) {
    const { destination } = render([language]);
    assert.equal(destination.hostname, "yandex.uz");
    assert.equal(destination.searchParams.get("lang"), "uz_UZ");
    assert.equal(destination.searchParams.get("pt"), "69.224814,41.328372,pm2rdm");
  }
});
