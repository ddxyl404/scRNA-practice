#!/usr/bin/env node
/**
 * After a GITHUB_PAGES build: copy index.html → 404.html so client-side
 * routes still resolve on GitHub Pages, and write .nojekyll.
 */
import { copyFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), ".vercel/output/static");
if (!existsSync(root)) {
  console.error("[pages-postbuild] missing", root);
  process.exit(1);
}

const index = join(root, "index.html");
if (!existsSync(index)) {
  console.error("[pages-postbuild] missing index.html — prerender may have failed");
  process.exit(1);
}

copyFileSync(index, join(root, "404.html"));
writeFileSync(join(root, ".nojekyll"), "");
console.log("[pages-postbuild] wrote 404.html and .nojekyll in", root);
