#!/usr/bin/env node
// Sync the Prowl manual sources (docs/ and skills/) into src/content/manual.
//
// Source selection (first match wins):
//   1. PROWL_DOCS_SOURCE=remote        -> sparse git clone of onevcat/Prowl (main)
//   2. PROWL_DOCS_SOURCE=<abs path>    -> that Prowl checkout
//   3. ../Prowl exists                 -> the sibling checkout (local development)
//   4. otherwise                       -> remote
//
// The synced files are generated artifacts and are gitignored. `manifest.json`
// records where they came from so the site can show the source commit.

import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_URL = "https://github.com/onevcat/Prowl.git";
const REPO_REF = process.env.PROWL_DOCS_REF || "main";
const SYNC_DIRS = ["docs", "skills"];

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(siteRoot, "src", "content", "manual");

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

function git(cwd, ...args) {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

async function resolveSource() {
  const requested = process.env.PROWL_DOCS_SOURCE;
  if (requested && requested !== "remote") {
    const dir = path.resolve(requested);
    if (!(await exists(path.join(dir, "docs")))) {
      throw new Error(`PROWL_DOCS_SOURCE=${requested} has no docs/ directory`);
    }
    return { kind: "local", dir };
  }
  if (requested !== "remote") {
    const sibling = path.resolve(siteRoot, "..", "Prowl");
    if (await exists(path.join(sibling, "docs"))) return { kind: "local", dir: sibling };
  }
  return { kind: "remote" };
}

async function cloneRemote() {
  const dir = await (async () => {
    const base = path.join(tmpdir(), `prowl-docs-${process.pid}`);
    await rm(base, { recursive: true, force: true });
    await mkdir(base, { recursive: true });
    return base;
  })();
  console.log(`[sync-docs] cloning ${REPO_URL}@${REPO_REF} (sparse: ${SYNC_DIRS.join(", ")})`);
  execFileSync(
    "git",
    ["clone", "--quiet", "--depth=1", "--filter=blob:none", "--sparse", "--branch", REPO_REF, REPO_URL, dir],
    { stdio: "inherit" },
  );
  git(dir, "sparse-checkout", "set", ...SYNC_DIRS);
  return dir;
}

async function main() {
  const source = await resolveSource();
  const dir = source.kind === "local" ? source.dir : await cloneRemote();

  let commit = "unknown";
  let dirty = false;
  try {
    commit = git(dir, "rev-parse", "HEAD");
    dirty = source.kind === "local" && git(dir, "status", "--porcelain", "--", ...SYNC_DIRS) !== "";
  } catch {
    // Not a git checkout; keep "unknown".
  }

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  for (const sub of SYNC_DIRS) {
    const from = path.join(dir, sub);
    if (!(await exists(from))) continue;
    await cp(from, path.join(outDir, sub), {
      recursive: true,
      filter: (src) => {
        const base = path.basename(src);
        if (base.startsWith(".")) return false;
        return true;
      },
    });
  }

  let syncMeta = null;
  try {
    syncMeta = JSON.parse(await readFile(path.join(dir, "docs", ".sync-meta.json"), "utf8"));
  } catch {
    // Optional file.
  }

  const manifest = {
    source: source.kind,
    sourcePath: source.kind === "local" ? dir : `${REPO_URL}#${REPO_REF}`,
    commit,
    dirty,
    syncedAt: new Date().toISOString(),
    docsVerifiedAt: syncMeta?.last_synced_date ?? null,
    docsVerifiedCommit: syncMeta?.last_synced_commit ?? null,
  };
  await writeFile(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

  if (source.kind === "remote") await rm(dir, { recursive: true, force: true });
  console.log(`[sync-docs] ${source.kind} ${commit.slice(0, 10)}${dirty ? " (dirty)" : ""} -> ${path.relative(siteRoot, outDir)}`);
}

main().catch((error) => {
  console.error(`[sync-docs] failed: ${error.message}`);
  process.exit(1);
});
