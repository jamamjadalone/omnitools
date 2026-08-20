#!/usr/bin/env node
/* =========================================================================
   OmniTools — sitemap generator
   Reads data/tools.json and writes sitemap.xml with all tool pages plus
   the static pages and category pages. Run after adding tools.
   Usage: node scripts/generate-sitemap.mjs
   ========================================================================= */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url)) + "/..";
const data = JSON.parse(readFileSync(join(root, "data", "tools.json"), "utf8"));
const base = "https://jamamjadalone.github.io/omnitools";
const today = new Date().toISOString().slice(0, 10);

const urls = [];

const pages = [
  { loc: "/index.html", prio: "1.0", freq: "weekly" },
  { loc: "/categories/index.html", prio: "0.8", freq: "weekly" },
  { loc: "/about/index.html", prio: "0.5", freq: "monthly" },
  { loc: "/contact/index.html", prio: "0.5", freq: "monthly" },
  { loc: "/privacy/index.html", prio: "0.4", freq: "monthly" },
  { loc: "/terms/index.html", prio: "0.4", freq: "monthly" },
  { loc: "/404.html", prio: "0.1", freq: "yearly" },
];
for (const p of pages) {
  urls.push(`  <url>\n    <loc>${base}${p.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.freq}</changefreq>\n    <priority>${p.prio}</priority>\n  </url>`);
}

for (const cat of data.categories) {
  urls.push(`  <url>\n    <loc>${base}/categories/${cat.id}.html</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`);
}

for (const tool of data.tools) {
  urls.push(`  <url>\n    <loc>${base}/tools/${tool.slug}/index.html</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`);
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

writeFileSync(join(root, "sitemap.xml"), xml, "utf8");
console.log(`Wrote sitemap.xml with ${urls.length} URLs (${data.tools.length} tools).`);