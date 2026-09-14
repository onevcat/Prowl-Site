import { getCollection, type CollectionEntry } from "astro:content";
import { manualSlug } from "./rehype-manual.mjs";

export type ManualEntry = CollectionEntry<"manual">;

export interface ManualDoc {
  entry: ManualEntry;
  /** Route slug without leading/trailing slash; "" is the index. */
  slug: string;
  href: string;
  /** Path inside the Prowl repository, e.g. docs/components/canvas.md. */
  sourcePath: string;
  title: string;
  lead: string;
  keywords: string[];
  group: string;
}

export interface ManualGroup {
  id: string;
  label: string;
  docs: ManualDoc[];
}

export interface ManualManifest {
  source: "local" | "remote";
  sourcePath: string;
  commit: string;
  dirty: boolean;
  syncedAt: string;
  docsVerifiedAt: string | null;
  docsVerifiedCommit: string | null;
}

/** Curated reading order. Docs not listed here are appended to "More". */
const GROUPS: { id: string; label: string; slugs: string[] }[] = [
  { id: "start", label: "Start here", slugs: ["", "overview", "concepts"] },
  {
    id: "layout",
    label: "Layout & navigation",
    slugs: [
      "components/view-modes",
      "components/canvas",
      "components/shelf",
      "components/repositories-and-worktrees",
      "components/workspaces",
      "components/terminal",
      "components/command-palette",
    ],
  },
  {
    id: "agents",
    label: "Agents",
    slugs: [
      "components/active-agents",
      "components/agent-island",
      "components/agent-profiles",
      "components/agent-detection",
      "components/notifications",
    ],
  },
  {
    id: "automation",
    label: "Automation",
    slugs: ["components/custom-actions", "components/workflows", "components/handoff", "components/cli"],
  },
  { id: "review", label: "Review & ship", slugs: ["components/diff-view", "components/github-pull-requests"] },
  { id: "app", label: "App", slugs: ["components/settings", "components/updates"] },
  { id: "reference", label: "Reference", slugs: ["reference/keyboard-shortcuts", "reference/settings-fields"] },
  {
    id: "skills",
    label: "Bundled agent skills",
    slugs: [
      "skills/prowl-cli",
      "skills/prowl-workflow",
      "skills/prowl-workflow/references/authoring",
      "skills/prowl-workflow/references/actions",
      "skills/prowl-workflow/references/runbook",
    ],
  },
  { id: "experimental", label: "Experimental", slugs: ["remote-mirror", "remote-mirror-wire"] },
];

const MORE_GROUP = { id: "more", label: "More", slugs: [] as string[] };

function titleOf(body: string, fallback: string): string {
  const match = body.match(/^#\s+(.+?)\s*$/m);
  return match ? stripInline(match[1]) : fallback;
}

function leadOf(body: string): string {
  const lines = body.split("\n");
  const h1 = lines.findIndex((l) => /^#\s+/.test(l));
  if (h1 === -1) return "";
  const quotes: string[][] = [];
  let current: string[] | null = null;
  for (let i = h1 + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (/^>\s?/.test(line)) {
      if (!current) {
        current = [];
        quotes.push(current);
      }
      current.push(line.replace(/^>\s?/, ""));
    } else if (line.trim() === "") {
      current = null;
    } else {
      break;
    }
  }
  // Skip environment notes such as "Workflow UI is enabled by default…" when a
  // second, descriptive blockquote follows.
  const candidates = quotes.map((q) => stripInline(q.join(" ").trim()));
  const descriptive = candidates.filter((c) => !/^Workflow UI is enabled/i.test(c));
  return (descriptive[0] ?? candidates[0] ?? "").trim();
}

function keywordsOf(body: string): string[] {
  const match = body.match(/^\*\*Keywords:\*\*\s*(.+)$/m);
  if (!match) return [];
  return match[1]
    .split(",")
    .map((k) => stripInline(k).trim())
    .filter(Boolean);
}

/** Remove inline markdown markers so titles and leads read as plain text. */
export function stripInline(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

let cache: Promise<{ docs: ManualDoc[]; groups: ManualGroup[] }> | null = null;

export function loadManual() {
  if (!cache) cache = build();
  return cache;
}

async function build() {
  const entries = await getCollection("manual");
  const groupOf = new Map<string, string>();
  for (const g of GROUPS) for (const s of g.slugs) groupOf.set(s, g.id);

  const docs: ManualDoc[] = entries.map((entry) => {
    // glob() slugifies ids (docs/README.md -> docs/readme); the real path is filePath.
    const filePath = (entry.filePath ?? entry.id).split("\\").join("/");
    const sourcePath = filePath.replace(/^.*?src\/content\/manual\//, "");
    const slug = manualSlug(sourcePath);
    const body = entry.body ?? "";
    return {
      entry,
      slug,
      href: slug ? `/manual/${slug}/` : "/manual/",
      sourcePath,
      title: titleOf(body, slug.split("/").pop() || "Manual"),
      lead: leadOf(body),
      keywords: keywordsOf(body),
      group: groupOf.get(slug) ?? MORE_GROUP.id,
    };
  });

  const bySlug = new Map(docs.map((d) => [d.slug, d]));
  const groups: ManualGroup[] = [];
  for (const g of [...GROUPS, MORE_GROUP]) {
    const ordered = g.slugs.map((s) => bySlug.get(s)).filter((d): d is ManualDoc => Boolean(d));
    const extras =
      g.id === MORE_GROUP.id
        ? docs.filter((d) => d.group === MORE_GROUP.id).sort((a, b) => a.slug.localeCompare(b.slug))
        : [];
    const all = [...ordered, ...extras];
    if (all.length) groups.push({ id: g.id, label: g.label, docs: all });
  }
  return { docs, groups };
}

/** Flat reading order used for previous / next links. */
export async function manualSequence(): Promise<ManualDoc[]> {
  const { groups } = await loadManual();
  return groups.flatMap((g) => g.docs);
}

export async function loadManifest(): Promise<ManualManifest | null> {
  try {
    const mod = await import("../content/manual/manifest.json");
    return (mod.default ?? mod) as ManualManifest;
  } catch {
    return null;
  }
}

export function displayTitle(doc: ManualDoc): string {
  return doc.slug === "" ? "Manual index" : doc.title.replace(/^Reference:\s*/, "");
}
