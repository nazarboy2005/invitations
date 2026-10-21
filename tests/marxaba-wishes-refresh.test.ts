import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const runtime = readFileSync(
  new URL("../apps/web/public/templates/shared/nikoh/core.js", import.meta.url),
  "utf8",
);

test("Marxaba wish lists refresh from current preview data after iframe updates", () => {
  const refreshFunction = runtime.match(
    /function refreshWishes\(\)\{[^}]+\}/,
  )?.[0];
  assert.ok(refreshFunction, "the runtime exposes a current-data refresh path");
  const data = { wishes: [{ name: "Dilnoza", text: "Old preview" }] };
  const addedWishes = [{ name: "Guest", text: "Locally saved" }];
  const remoteWishes = [{ name: "Approved", text: "From the API" }];
  const createRefresh = new Function(
    "data",
    "addedWishes",
    "remoteWishes",
    `let wishes = []; ${refreshFunction}; return refreshWishes;`,
  ) as (
    data: typeof data,
    addedWishes: typeof addedWishes,
    remoteWishes: typeof remoteWishes,
  ) => () => Array<{ name: string; text: string }>;
  const refresh = createRefresh(data, addedWishes, remoteWishes);

  assert.deepEqual(refresh(), [
    { name: "Dilnoza", text: "Old preview" },
    ...addedWishes,
    ...remoteWishes,
  ]);
  data.wishes = [{ name: "Sardor", text: "Updated preview" }];
  assert.deepEqual(refresh(), [
    { name: "Sardor", text: "Updated preview" },
    ...addedWishes,
    ...remoteWishes,
  ]);

  assert.match(
    runtime,
    /function refreshWishes\(\)\{wishes=\[\.\.\.\(Array\.isArray\(data\.wishes\)\?data\.wishes:\[\]\),\.\.\.addedWishes,\.\.\.remoteWishes\];return wishes;\}/,
    "the rendered list combines current payload wishes with stored and remote guest wishes",
  );
  assert.match(
    runtime,
    /merge\(data,next\);api\.data=data;refreshWishes\(\);fillSlots\(\);renderLists\(\)/,
    "late creator, locale, and preview updates refresh the list before rendering",
  );
  assert.match(
    runtime,
    /renderList\('wishes',refreshWishes\(\)\)/,
    "approved remote wishes render together with the latest payload and local wishes",
  );
});
