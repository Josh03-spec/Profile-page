#!/usr/bin/env node
/**
 * Smoke checks for the static profile page.
 *
 * Catches the class of bugs that broke this page before:
 *   1. A local src/href that points at a file that does not exist (renamed/missing image).
 *   2. An <img> without an alt attribute.
 *   3. Zero or multiple <h1> headings.
 *   4. Balanced structural markup is covered by `html-validate` (npm run lint:html).
 *
 * Usage: node scripts/check-assets.mjs
 */

import { readFile, access } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pages = ["index.html"];

const errors = [];
const checkedAssets = new Set();

/** Strip query strings and fragments so `a.png?v=2` maps to `a.png`. */
const clean = (url) => url.split("#")[0].split("?")[0];

const isRemote = (url) =>
  /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(url) || url.startsWith("#");

for (const page of pages) {
  const html = await readFile(join(root, page), "utf8");

  // --- 1. local references resolve -----------------------------------------
  const refPattern = /\b(?:src|href)\s*=\s*"([^"]*)"/gi;
  for (const [, rawUrl] of html.matchAll(refPattern)) {
    const url = rawUrl.trim();
    if (!url || isRemote(url)) continue;

    const target = clean(url);
    if (!target) continue;

    const absolute = join(root, decodeURIComponent(target.replace(/^\//, "")));
    try {
      await access(absolute);
      checkedAssets.add(target);
    } catch {
      errors.push(`${page}: missing file for reference "${rawUrl}"`);
    }
  }

  // --- 2. every <img> has a (possibly empty) alt ---------------------------
  for (const [tag] of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt\s*=\s*"/i.test(tag)) {
      errors.push(`${page}: <img> without alt attribute -> ${tag.slice(0, 90)}`);
    }
  }

  // --- 3. exactly one <h1> ------------------------------------------------
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  if (h1Count !== 1) {
    errors.push(`${page}: expected exactly one <h1>, found ${h1Count}`);
  }

  // --- 4. no leftover CRLF line endings ----------------------------------
  if (/\r\n/.test(html)) {
    errors.push(`${page}: contains CRLF line endings (expected LF)`);
  }
}

if (errors.length > 0) {
  console.error(`\n✖ ${errors.length} problem(s) found:\n`);
  for (const error of errors) console.error(`  • ${error}`);
  process.exit(1);
}

console.log(`✔ ${pages.join(", ")} OK — ${checkedAssets.size} local asset(s) resolve, alt text present, one <h1>.`);
