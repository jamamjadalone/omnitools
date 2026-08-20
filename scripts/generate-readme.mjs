/**
 * Generates the tools table section of README.md from data/tools.json.
 * Usage: node scripts/generate-readme.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(join(root, "data", "tools.json"), "utf8"));

const cats = new Map(data.categories.map((c) => [c.id, c]));
const byCat = new Map();
for (const t of data.tools) {
  if (!byCat.has(t.category)) byCat.set(t.category, []);
  byCat.get(t.category).push(t);
}

const badge = (label, color, extra) => {
  const e = extra ? ` ${extra}` : "";
  return `![${label}](https://img.shields.io/badge/${encodeURIComponent(label)}-${color}${e})`;
};

const lines = [];
lines.push(`## Available tools (${data.tools.length})`);
lines.push("");
lines.push("All tools run 100% in your browser — nothing you upload is ever sent to a server.");
lines.push("");
lines.push("| # | Tool | Category | What it does |");
lines.push("|---|------|----------|--------------|");

let n = 0;
for (const [catId, tools] of byCat) {
  for (const t of tools) {
    n += 1;
    const cat = cats.get(t.category)?.name ?? t.category;
    const name = t.isNew ? `${t.name} ${badge("new", "4caf50", "style=flat")}` : t.name;
    lines.push(`| ${n} | [${name}](https://jamamjadalone.github.io/omnitools/tools/${t.slug}/index.html) | ${cat} | ${t.description} |`);
  }
}
lines.push("");

const out = readFileSync(join(root, "README.md"), "utf8");
const start = out.indexOf("## Available tools");
const end = out.indexOf("## License");
const newSection = lines.join("\n");
const updated = start === -1
  ? out.replace("## License", newSection + "\n## License")
  : out.slice(0, start) + newSection + "\n" + out.slice(end);
writeFileSync(join(root, "README.md"), updated);
console.log(`README.md updated: ${data.tools.length} tools in table.`);