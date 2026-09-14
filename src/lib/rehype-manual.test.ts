import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import rehypeManual from "./rehype-manual.mjs";

test("manual directory links resolve to index sections from any document", (t) => {
  const root = mkdtempSync(path.join(tmpdir(), "manual-links-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const directory of ["docs/components", "docs/reference", "skills"]) {
    mkdirSync(path.join(root, directory), { recursive: true });
  }
  writeFileSync(path.join(root, "docs/components/canvas.md"), "# Canvas\n");
  const transform = rehypeManual({ contentRoot: root });
  const cases = [
    ["docs/README.md", "components/", "/manual/#component-manuals"],
    ["docs/overview.md", "./components/", "/manual/#component-manuals"],
    ["docs/components/canvas.md", "../components", "/manual/#component-manuals"],
    ["docs/README.md", "reference/", "/manual/#reference-exact-lookups"],
    ["docs/components/canvas.md", "../reference/", "/manual/#reference-exact-lookups"],
    ["docs/overview.md", "./", "/manual/"],
    ["docs/overview.md", "../", "/manual/"],
    ["docs/overview.md", "../skills/", "/manual/"],
    ["docs/README.md", "components/canvas.md#broadcast", "/manual/components/canvas/#broadcast"],
    ["docs/components/canvas.md", "", "/manual/components/canvas/"],
    ["docs/components/canvas.md", "#broadcast", "#broadcast"],
  ];
  for (const [source, href, expected] of cases) {
    const link = { type: "element", tagName: "a", properties: { href }, children: [] };
    const tree = { type: "root", children: [link] };
    transform(tree, { path: path.join(root, source) });
    assert.equal(link.properties.href, expected, `${source}: ${href}`);
  }
  const empty = { type: "root", children: [] };
  transform(empty, { path: path.join(root, "docs/README.md") });
  assert.deepEqual(empty.children, []);
});

// Run after `npm run build` to catch upstream heading changes as well as rewrites.
test("built directory links point to headings in the manual index", () => {
  const output = new URL("../../dist/", import.meta.url);
  const index = readFileSync(new URL("manual/index.html", output), "utf8");
  const overview = readFileSync(new URL("manual/overview/index.html", output), "utf8");
  for (const [html, anchors] of [
    [index, ["component-manuals", "reference-exact-lookups"]],
    [overview, ["component-manuals"]],
  ] as const) {
    for (const anchor of anchors) {
      assert.ok(html.includes(`href="/manual/#${anchor}"`), `Missing directory link: ${anchor}`);
      assert.match(index, new RegExp(`<h[2-4]\\b[^>]*\\bid="${anchor}"`));
    }
    assert.doesNotMatch(html, /href="\/manual\/#(?:components|reference)"/);
  }
});
