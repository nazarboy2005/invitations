import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
test("Anor initializes frames on hydration as well as subsequent loads", () => {
  const source = readFileSync(
    new URL("../apps/web/src/templates/anor/renderer.tsx", import.meta.url),
    "utf8",
  );
  assert.match(
    source,
    /useEffect\(\(\) => \{[\s\S]*?sendData\(\);\s*\}, \[sendData\]\)/,
  );
  assert.match(source, /onLoad=\{sendData\}/);
  assert.doesNotMatch(source, /if \(loadedLocale !== frameLocale\) return/);
});
