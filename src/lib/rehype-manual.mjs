// Rehype plugin for the Manual: rewrite relative `.md` links to site routes,
// tag the metadata paragraphs (Keywords / Related) and the lead blockquote,
// and wrap tables so wide reference tables scroll instead of overflowing.
import fs from "node:fs";
import path from "node:path";
import { visit } from "unist-util-visit";

const GITHUB_BLOB = "https://github.com/onevcat/Prowl/blob/main/";

/** Absolute path of the synced manual root, injected by astro.config. */
export default function rehypeManual({ contentRoot }) {
  const root = path.resolve(contentRoot);

  const routeFor = (absolute) => {
    const rel = path.relative(root, absolute).split(path.sep).join("/");
    if (rel.startsWith("..")) return null;
    return "/manual/" + manualSlug(rel) + "/";
  };

  return (tree, file) => {
    const filePath = file.path || file.history?.[0];
    const inManual = filePath && !path.relative(root, filePath).startsWith("..");
    if (!inManual) return;
    const fileDir = path.dirname(filePath);

    visit(tree, "element", (node, index, parent) => {
      if (node.tagName === "a" && typeof node.properties?.href === "string") {
        const href = node.properties.href;
        if (/^(https?:|mailto:|#)/.test(href)) {
          if (/^https?:/.test(href)) {
            node.properties.target = "_blank";
            node.properties.rel = "noopener";
          }
          return;
        }
        const [target, hash] = href.split("#");
        const absolute = path.resolve(fileDir, target || path.basename(filePath));
        const relToRoot = path.relative(root, absolute).split(path.sep).join("/");
        const outside = relToRoot.startsWith("..");
        const isSyncedFile = !outside && relToRoot.endsWith(".md") && fs.existsSync(absolute);
        const isSyncedDir = !outside && !relToRoot.endsWith(".md") && fs.existsSync(absolute);
        if (isSyncedFile) {
          node.properties.href = routeFor(absolute) + (hash ? "#" + hash : "");
        } else if (isSyncedDir) {
          // Directory links such as `components/` -> manual index section.
          node.properties.href = "/manual/#" + relToRoot.replace(/\/$/, "").replace(/^docs\//, "");
        } else {
          // Anything else lives in the Prowl repository outside the synced
          // tree (e.g. ../MirrorClient/README.md). The synced root mirrors the
          // repository root, so the relative path maps onto GitHub directly.
          const repoRel = relToRoot.replace(/^(\.\.\/)+/, "");
          node.properties.href = GITHUB_BLOB + repoRel + (hash ? "#" + hash : "");
          node.properties.target = "_blank";
          node.properties.rel = "noopener";
        }
        return;
      }

      if (node.tagName === "p" && Array.isArray(node.children)) {
        const first = node.children[0];
        const label = first?.tagName === "strong" ? textOf(first).trim().toLowerCase() : "";
        if (label === "keywords:") {
          addClass(node, "doc-keywords");
          // "**Keywords:** a, b, c" -> one chip per keyword.
          const text = node.children.slice(1).map(textOf).join("");
          node.children = [
            first,
            ...text
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean)
              .map((k) => ({ type: "element", tagName: "span", properties: { className: ["chip"] }, children: [{ type: "text", value: k }] })),
          ];
        }
        if (label === "related:") addClass(node, "doc-related");
        return;
      }

      if (/^h[2-4]$/.test(node.tagName) && node.properties?.id) {
        node.children.push({
          type: "element",
          tagName: "a",
          properties: { className: ["heading-anchor"], href: "#" + node.properties.id, "aria-label": "Link to this section" },
          children: [{ type: "text", value: "#" }],
        });
        return;
      }

      if (node.tagName === "table" && parent && typeof index === "number") {
        parent.children[index] = {
          type: "element",
          tagName: "div",
          properties: { className: ["table-wrap"] },
          children: [node],
        };
        return;
      }
    });

    // The first blockquote right after the H1 is the document lead.
    const body = tree.children.filter((n) => n.type === "element");
    const h1 = body.findIndex((n) => n.tagName === "h1");
    if (h1 >= 0) {
      for (let i = h1 + 1; i < body.length; i += 1) {
        if (body[i].tagName !== "blockquote") break;
        addClass(body[i], "doc-lead");
      }
    }
  };
}

/** `docs/components/canvas.md` -> `components/canvas`; `docs/README.md` -> `` ; `skills/prowl-cli/SKILL.md` -> `skills/prowl-cli`. */
export function manualSlug(relPath) {
  let slug = relPath.replace(/\.md$/, "");
  if (slug.startsWith("docs/")) slug = slug.slice("docs/".length);
  if (slug.endsWith("/README")) slug = slug.slice(0, -"/README".length);
  if (slug === "README") slug = "";
  if (slug.endsWith("/SKILL")) slug = slug.slice(0, -"/SKILL".length);
  return slug;
}

function textOf(node) {
  if (node.type === "text") return node.value;
  return (node.children || []).map(textOf).join("");
}

function addClass(node, name) {
  node.properties = node.properties || {};
  const current = node.properties.className;
  node.properties.className = Array.isArray(current) ? [...current, name] : current ? [current, name] : [name];
}
