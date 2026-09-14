import assert from "node:assert/strict";
import { test } from "node:test";
import { highlight } from "./manual-search.ts";

test("multi-term highlights never search generated markup", () => {
  assert.equal(
    highlight("Custom Commands (buttons + hotkeys)", ["command", "a"]),
    "Custom <mark>Command</mark>s (buttons + hotkeys)",
  );
  assert.equal(highlight("mark & amp", ["mark", "a", "amp"]), "<mark>mark</mark> &amp; <mark>amp</mark>");
});

test("overlapping and repeated terms form a single highlight", () => {
  assert.equal(highlight("abc", ["ab", "bc", "ab"]), "<mark>abc</mark>");
  assert.equal(highlight("abc", ["bc", "ab"]), "<mark>abc</mark>");
});

test("matches preserve casing and cover both text boundaries", () => {
  assert.equal(highlight("Command and COMMAND", ["command"]), "<mark>Command</mark> and <mark>COMMAND</mark>");
});

test("text and matches are escaped, and query punctuation stays literal", () => {
  assert.equal(highlight("<a>&\"'", ["<a>", "&", "\"'"]), "<mark>&lt;a&gt;&amp;&quot;&#39;</mark>");
  assert.equal(highlight("a+b [x]", ["a+b", "[x]"]), "<mark>a+b</mark> <mark>[x]</mark>");
});

test("empty input, empty terms and unmatched text produce escaped plain text", () => {
  assert.equal(highlight("", ["a"]), "");
  assert.equal(highlight("<x>", [""]), "&lt;x&gt;");
  assert.equal(highlight("<x>", []), "&lt;x&gt;");
  assert.equal(highlight("<x>", ["z"]), "&lt;x&gt;");
});
