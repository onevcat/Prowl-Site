import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

// Build first so links are checked against the current upstream manual headings.
test("details manual links resolve to built pages and anchors", () => {
  const output = new URL("../../dist/", import.meta.url);
  const details = readFileSync(new URL("details/index.html", output), "utf8");
  const links = [...details.matchAll(/href="(\/manual\/[^"#]*)(?:#([^"]+))?"/g)];
  assert.ok(links.length > 0, "Expected manual links on the details page");
  for (const [, pathname, anchor] of links) {
    const manual = readFileSync(new URL(`.${pathname}index.html`, output), "utf8");
    if (anchor) {
      assert.ok(manual.includes(`id="${anchor}"`), `Missing anchor: ${pathname}#${anchor}`);
    }
  }
});
