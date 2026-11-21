// Generates the multi-page example sites in public/examples/<id>/.
// Each site lives in its own module next to this file. Run: npm run build:examples
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../../public/examples");
const ids = ["business", "store", "restaurant", "trades", "clinic", "saas", "blog", "crm"];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

function layout(site, file, page) {
  return `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(page.title)} | ${esc(site.name)} · WebTechPros concept</title>
<meta name="description" content="${esc(page.description || site.tagline)}">
<link rel="stylesheet" href="../shared/concept.css">
<link rel="stylesheet" href="site.css">
</head>
<body class="${site.id} page-${file.replace(/\.html$/, "")}">
<div class="concept-bar"><span>WebTechPros design concept · sample business and data</span><a href="/#projects">← Back to WebTechPros</a></div>
${site.header(file)}
<main id="main">
${page.body.trim()}
</main>
${site.footer()}
<script src="../shared/concept.js"></script>
<script src="site.js"></script>
</body>
</html>
`;
}

for (const id of ids) {
  const site = (await import(`./${id}.mjs`)).default;
  const dir = resolve(out, id);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, "site.css"), site.css.trim() + "\n");
  writeFileSync(resolve(dir, "site.js"), site.js.trim() + "\n");
  for (const [file, page] of Object.entries(site.pages))
    writeFileSync(resolve(dir, file), layout(site, file, page));
  console.log(`${id}: ${Object.keys(site.pages).length} pages`);
}
