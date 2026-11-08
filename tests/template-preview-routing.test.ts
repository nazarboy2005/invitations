import assert from "node:assert/strict";
import test from "node:test";
import {
  TEMPLATES,
  publicTemplateId,
  templateById,
} from "../packages/contracts/src/index";

test("every catalog preview link resolves to its original renderer definition", () => {
  for (const template of TEMPLATES) {
    const slug = publicTemplateId(template.id);
    assert.equal(
      templateById(slug)?.id,
      template.id,
      `Public preview: ${slug}`,
    );
    assert.equal(
      templateById(slug),
      templateById(template.id),
      `Legacy preview: ${template.id}`,
    );
  }
});

test("To‘rt fasl resolves through both public and historical links", () => {
  assert.equal(templateById("tort-fasl")?.id, "tort-fasl");
  assert.equal(templateById("taklifla-tort-fasl")?.id, "tort-fasl");
});

test("unknown template links do not resolve to an unrelated design", () => {
  for (const id of ["", "missing-template", "toString", "__proto__"]) {
    assert.equal(templateById(id), undefined);
  }
});
