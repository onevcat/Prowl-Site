import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Markdown synced from onevcat/Prowl by scripts/sync-docs.mjs (prebuild).
// The source files carry no frontmatter; titles and summaries are derived
// from the body in src/lib/manual.ts.
const manual = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/manual" }),
  schema: z.object({}).passthrough(),
});

export const collections = { manual };
