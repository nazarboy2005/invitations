import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve("apps/web/public/templates");

test("Bulbul, Parda, Ganch and Yangi Uy retain responsive and reduced-motion paths", () => {
  for (const id of ["bulbul", "parda", "ganch", "yangi-uy"]) {
    const css = readFileSync(path.join(root, id, "template.css"), "utf8");
    const js = readFileSync(path.join(root, id, "template.js"), "utf8");
    assert.match(
      css,
      /@media\s*\(\s*min-width\s*:\s*\d+px\s*\)/,
      `${id} keeps its wider-layout breakpoint`,
    );
    assert.match(
      css,
      /@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/,
      `${id} keeps its reduced-motion CSS path`,
    );
    assert.match(
      js,
      /reducedMotion|prefers-reduced-motion/i,
      `${id} keeps its reduced-motion script path`,
    );
  }

  const bulbulCss = readFileSync(path.join(root, "bulbul", "template.css"), "utf8");
  const bulbulJs = readFileSync(path.join(root, "bulbul", "template.js"), "utf8");
  assert.match(
    bulbulCss,
    /--col\s*:\s*min\(\s*100vw\s*,\s*480px\s*\)/i,
    "Bulbul keeps its phone column bounded by the viewport",
  );
  assert.match(
    bulbulCss,
    /overflow-x\s*:\s*clip/i,
    "Bulbul prevents its centered desktop frame from adding horizontal overflow",
  );
  assert.match(
    bulbulJs,
    /visualViewport\.addEventListener\(["']resize["']\s*,\s*resize/i,
    "Bulbul recalculates its layout when the visual viewport changes",
  );
});
