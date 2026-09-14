import type { APIRoute } from "astro";
import { render } from "astro:content";
import { loadManual, displayTitle, stripInline } from "../../lib/manual";

/** Convert markdown to searchable plain text: keep code, drop markers. */
function plainText(markdown: string): string {
  return markdown
    .replace(/^---[\s\S]*?---\n/, "")
    .replace(/```[^\n]*\n([\s\S]*?)```/g, "$1")
    .replace(/^\s*[#>|*-]+\s?/gm, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export const GET: APIRoute = async () => {
  const { groups } = await loadManual();
  const items = [];
  for (const group of groups) {
    for (const doc of group.docs) {
      const { headings } = await render(doc.entry);
      items.push({
        href: doc.href,
        title: displayTitle(doc),
        group: group.label,
        lead: doc.lead,
        keywords: doc.keywords,
        headings: headings
          .filter((h) => h.depth >= 2 && h.depth <= 3)
          .map((h) => ({ depth: h.depth, slug: h.slug, text: stripInline(h.text) })),
        text: plainText(doc.entry.body ?? ""),
      });
    }
  }
  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
