// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import rehypeManual from "./src/lib/rehype-manual.mjs";

const manualRoot = fileURLToPath(new URL("./src/content/manual", import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: "https://prowl.onev.cat",
  trailingSlash: "ignore",
  markdown: {
    shikiConfig: { theme: "poimandres", wrap: false },
    rehypePlugins: [rehypeHeadingIds, [rehypeManual, { contentRoot: manualRoot }]],
  },
});
