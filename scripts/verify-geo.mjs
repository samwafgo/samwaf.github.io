#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(root, "docs/.vuepress/dist");
const origin = "https://doc.samwaf.com";
const { pages } = JSON.parse(await fs.readFile(path.join(dist, "geo-pages.json"), "utf8"));
assert(Array.isArray(pages) && pages.length > 0, "manifest must contain pages");
const decode = (value) => value.replace(/&#(x[\da-f]+|\d+);/gi, (_, n) =>
  String.fromCodePoint(n[0].toLowerCase() === "x" ? parseInt(n.slice(1), 16) : Number(n)))
  .replace(/&(amp|quot|apos|lt|gt|nbsp);/g, (_, key) => ({ amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " })[key]);
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], decode(m[2])]));
const readPage = (url) => {
  const route = decodeURI(new URL(url).pathname);
  return fs.readFile(path.join(dist, route.endsWith("/") ? `${route}index.html` : route), "utf8");
};
const byUrl = new Map(pages.map((p) => [p.url, p]));
const descriptions = new Set();
const alternates = new Map();
let paired = 0;
for (const page of pages) {
  assert.equal(new URL(page.url).origin, origin);
  assert(!/\/404(?:\.html|\/)?$/.test(page.url), `404 in manifest: ${page.url}`);
  assert(page.title && page.description && Number.isFinite(Date.parse(page.lastmod)), `incomplete manifest: ${page.url}`);
  assert(!descriptions.has(page.description), `duplicate description: ${page.url}`);
  descriptions.add(page.description);
  const html = await readPage(page.url);
  const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1];
  assert(head, `missing static head: ${page.url}`);
  const meta = [...head.matchAll(/<meta\b[^>]*>/gi)].map((m) => attrs(m[0]));
  const links = [...head.matchAll(/<link\b[^>]*>/gi)].map((m) => attrs(m[0]));
  const desc = meta.filter((m) => m.name === "description");
  assert.equal(desc.length, 1, `description count: ${page.url}`);
  assert.equal(desc[0].content, page.description, `description mismatch: ${page.url}`);
  assert.equal(links.filter((m) => m.rel === "canonical").length, 1, `canonical count: ${page.url}`);
  assert.equal(links.find((m) => m.rel === "canonical").href, page.url);
  for (const key of ["title", "description", "url", "image", "type", "site_name", "locale"]) {
    assert.equal(meta.filter((m) => m.property === `og:${key}`).length, 1, `og:${key} count: ${page.url}`);
  }
  assert.equal(meta.find((m) => m.property === "og:description").content, page.description);
  assert.equal(meta.find((m) => m.property === "og:url").content, page.url);
  assert(!meta.some((m) => m.name === "robots" && /noindex/i.test(m.content)), `indexable noindex: ${page.url}`);
  const schema = [...head.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  assert.equal(schema.length, 1, `JSON-LD count: ${page.url}`);
  const graph = JSON.parse(schema[0][1])["@graph"];
  assert(graph.some((node) => node.codeRepository === "https://github.com/samwafgo/SamWaf" && node.url === "https://www.samwaf.com/"));
  assert(graph.some((node) => node.url === page.url && ["TechArticle", "WebPage"].includes(node["@type"])));
  assert(!graph.some((node) => node["@type"] === "Organization"), "unverified Organization entity");
  assert.equal([...html.matchAll(/<h1\b/gi)].length, 1, `H1 count: ${page.url}`);
  const alternate = links.filter((m) => m.hreflang);
  const pathname = new URL(page.url).pathname;
  const chinesePath = pathname.replace(/^\/en\//, "/");
  const chinese = `${origin}${chinesePath}`;
  const english = `${origin}/en${chinesePath}`;
  const hasPair = byUrl.has(chinese) && byUrl.has(english);
  assert.equal(alternate.length, hasPair ? 2 : 0, `language pair count: ${page.url}`);
  if (hasPair) {
    assert(alternate.some((m) => m.hreflang === "zh-CN" && m.href === chinese));
    assert(alternate.some((m) => m.hreflang === "en-US" && m.href === english));
    paired++;
  }
  for (const link of alternate) assert(byUrl.has(link.href), `hreflang target missing: ${link.href}`);
  alternates.set(page.url, alternate);
}
for (const [url, links] of alternates) {
  for (const link of links) assert(alternates.get(link.href).some((other) => other.href === url), `non-reciprocal hreflang: ${url}`);
}
const missing = await fs.readFile(path.join(dist, "404.html"), "utf8");
assert(/name="robots"[^>]*content="noindex, follow"/.test(missing), "404 must be noindex");
assert(!/rel="canonical"/.test(missing), "404 must not advertise a canonical");
const sitemap = await fs.readFile(path.join(dist, "sitemap.xml"), "utf8");
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1]));
assert.deepEqual(locations.slice().sort(), pages.map((p) => p.url).sort(), "sitemap must equal full manifest");
const spec = JSON.parse(await fs.readFile(path.join(root, "docs/.vuepress/public/swagger.json"), "utf8"));
const methods = new Set(["get", "post", "put", "patch", "delete", "head", "options", "trace"]);
const operations = Object.entries(spec.paths).flatMap(([route, obj]) => Object.keys(obj).filter((m) => methods.has(m)).map((method) => [method.toUpperCase(), route]));
for (const lang of ["", "/en"]) {
  const api = await readPage(`${origin}${lang}/api/`);
  assert(api.includes("X-API-Key") && api.includes("operations.html") && api.includes("openapi-cookbook.html"), `API reference links: ${lang}`);
  const index = await readPage(`${origin}${lang}/api/operations.html`);
  const rows = [...index.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((m) =>
    [...m[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map((cell) => decode(cell[1].replace(/<[^>]*>/g, "")).trim()));
  for (const [method, route] of operations) assert(rows.some((row) => row[0] === method && row[1] === route), `operation absent: ${lang} ${method} ${route}`);
  assert.equal(rows.filter((row) => row.length > 0).length, operations.length, `operation row count: ${lang}`);
  const home = await readPage(`${origin}${lang}/`);
  assert(home.includes('href="https://github.com/samwafgo/SamWaf/blob/main/LICENSE"'), `license target: ${lang}`);
  assert(!/href="(?:\.\/)?LICENSE"/.test(home), `relative license target: ${lang}`);
}
const robots = await fs.readFile(path.join(dist, "robots.txt"), "utf8");
for (const bot of ["GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot", "Bytespider"]) assert(robots.includes(`User-agent: ${bot}`));
assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
const llms = await fs.readFile(path.join(dist, "llms.txt"), "utf8");
for (const page of pages) assert(llms.includes(page.url), `llms URL missing: ${page.url}`);
const schema = JSON.parse(await fs.readFile(path.join(dist, "schema.jsonld.json"), "utf8"));
assert(schema["@graph"].some((node) => node.name === "SamWaf" && node.codeRepository === "https://github.com/samwafgo/SamWaf"));
assert(!schema["@graph"].some((node) => node["@type"] === "Organization"));
console.log(`GEO verified: ${pages.length} pages, ${paired / 2} reciprocal language pairs, ${operations.length} API operations per index; unique static metadata, H1, 404 exclusion and full generated assets passed.`);
