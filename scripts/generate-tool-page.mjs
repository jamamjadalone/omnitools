#!/usr/bin/env node
/* =========================================================================
   OmniTools — tool page generator
   Renders a complete tools/<slug>/index.html from templates/tool-template/
   plus a per-tool JSON spec. Keeps markup 100% consistent with the
   existing 10 tools.
   Usage: node scripts/generate-tool-page.mjs <spec-file.json>
   ========================================================================= */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const template = readFileSync(join(root, "templates", "tool-template", "index.html"), "utf8");

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function faqHtml(items) {
  return items
    .map(
      (f) =>
        `<div class="faq-item">\n          <button class="faq-question" aria-expanded="false">${esc(f.q)} <svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></button>\n          <div class="faq-answer"><p>${f.a}</p></div>\n        </div>`
    )
    .join("\n      ");
}

function build(spec) {
  let out = template
    .replaceAll("__TOOLNAME__", spec.name)
    .replaceAll("__SLUG__", spec.slug)
    .replaceAll("__DESC__", esc(spec.description))
    .replaceAll("__CATNAME__", esc(spec.categoryName))
    .replaceAll("__CATID__", spec.category)
    .replaceAll("__TOOLID__", spec.id)
    .replaceAll("__ICON__", spec.icon);

  out = out.replace("<!-- TOOL_BODY -->", spec.body || "");
  out = out.replace("<!-- HOWTO -->", (spec.howto || []).map((s) => `      <li>${s}</li>`).join("\n"));
  out = out.replace("<!-- FEATURES -->", (spec.features || []).map((s) => `      <li>${s}</li>`).join("\n"));
  out = out.replace("<!-- FAQ -->", faqHtml(spec.faq || []));

  const extraScripts = (spec.extraScripts || [])
    .map((s) => `  <script src="${s}"></script>`)
    .join("\n");
  if (extraScripts) {
    out = out.replace('<script src="script.js"></script>', extraScripts + '\n  <script src="script.js"></script>');
  }
  return out;
}

const specFile = process.argv[2];
if (!specFile) {
  console.error("Usage: node scripts/generate-tool-page.mjs <spec-file.json>");
  process.exit(1);
}
const spec = JSON.parse(readFileSync(specFile, "utf8"));
const outDir = join(root, "tools", spec.slug);
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "index.html"), build(spec), "utf8");
console.log(`Wrote tools/${spec.slug}/index.html`);