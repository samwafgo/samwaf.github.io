#!/usr/bin/env node
/**
 * geo-gen.mjs — 从审计结果生成可部署的 GEO 改造资产
 * Vendored from geo-optimize/scripts/geo-gen.mjs (2026-11-13).
 * Local changes: manifest input, source-backed project entities, full page list,
 * optional lastmod, and factual channel links. No machine-specific paths.
 *
 * 用法：
 *   node geo-gen.mjs --audit ./out/www.samwaf.com/audit.json --out ./out/www.samwaf.com/fix \
 *       [--site-name "SamWaf"] [--site-url https://www.samwaf.com] [--type website|docs] \
 *       [--lang zh] [--author "..."] [--license "..."] [--repo "..."] [--facts facts.yaml]
 *
 * 产出：
 *   <out>/robots.txt        放行 AI 爬虫 + 声明 sitemap
 *   <out>/sitemap.xml       从审计采样页生成，含 lastmod
 *   <out>/llms.txt          实体事实清单（需人工补 facts）
 *   <out>/schema.jsonld.json 结构化数据骨架
 *   <out>/llms-partial.json 未确定的字段清单（必须人工填写）
 *
 * 设计原则：
 *   - 不编造事实。凡是需要人工确认的字段，生成占位并列入 llms-partial.json。
 *   - 不写死会过期的数字（star/fork/版本号），除非由 --facts 显式提供。
 */

import fs from "node:fs";
import path from "node:path";

// 运行时版本守卫：fetch / AbortController 需要 Node 18+
const NODE_MAJOR = Number(process.versions.node.split(".")[0]);
if (NODE_MAJOR < 18) {
  console.error(`需要 Node.js 18 或更高版本，当前为 ${process.versions.node}`);
  process.exit(1);
}


/* ---------------------------------------------------------------- 参数 */

function parseArgs(argv) {
  const a = {
    audit: "", out: "", siteName: "", siteUrl: "", type: "website",
    lang: "zh", author: "", license: "", repo: "", facts: "", desc: "", extraUrls: "",
  };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === "--audit") a.audit = argv[++i];
    else if (k === "--out") a.out = argv[++i];
    else if (k === "--site-name") a.siteName = argv[++i];
    else if (k === "--site-url") a.siteUrl = argv[++i];
    else if (k === "--type") a.type = argv[++i];
    else if (k === "--lang") a.lang = argv[++i];
    else if (k === "--author") a.author = argv[++i];
    else if (k === "--license") a.license = argv[++i];
    else if (k === "--repo") a.repo = argv[++i];
    else if (k === "--facts") a.facts = argv[++i];
    else if (k === "--desc") a.desc = argv[++i];
    else if (k === "--extra-urls") a.extraUrls = argv[++i];
  }
  return a;
}

/* ------------------------------------------------------- facts 文件解析 */

/**
 * facts 文件为简单的 key: value 行格式（每行一条，# 开头为注释）。
 * 值里的 [待确认] 标记表示需要人工核实，会被列入 partial 清单。
 */
function parseFacts(file) {
  const facts = {};
  const partial = [];
  if (!file || !fs.existsSync(file)) return { facts, partial };
  const lines = fs.readFileSync(file, "utf8").split("\n");
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    if (!key) continue;
    if (val.includes("[待确认]") || val === "") {
      partial.push({ field: key, current: val || "(空)", why: "需人工核实后填入，未确认前不要发布" });
      facts[key] = val.replace(/\s*\[待确认\]$/, "") || "";
    } else {
      facts[key] = val;
    }
  }
  return { facts, partial };
}

/* ------------------------------------------------------------ 生成器 */

const AI_BOTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User",
  "Claude-SearchBot", "PerplexityBot", "Perplexity-User", "Google-Extended",
  "Applebot-Extended", "Bytespider", "CCBot", "cohere-ai", "meta-externalagent",
  "Diffbot", "omgili", "Timpibot", "YouBot",
];

function genRobots(opts, origin) {
  const L = [];
  L.push("# robots.txt");
  L.push("# 供搜索引擎与 AI 检索爬虫抓取公开内容。");
  L.push("# 生成于 geo-optimize skill；如需屏蔽某类爬虫，在对应段落下加 Disallow。");
  L.push("");
  for (const bot of AI_BOTS) {
    L.push(`User-agent: ${bot}`);
    L.push("Allow: /");
    L.push("");
  }
  L.push("User-agent: *");
  L.push("Allow: /");
  L.push("");
  L.push(`Sitemap: ${origin}/sitemap.xml`);
  L.push("");
  return L.join("\n");
}

function genSitemap(opts, origin, pages) {
  const L = [];
  L.push('<?xml version="1.0" encoding="UTF-8"?>');
  L.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  for (const p of pages) {
    L.push("  <url>");
    L.push(`    <loc>${escapeXml(p.url)}</loc>`);
    if (p.lastmod) L.push(`    <lastmod>${escapeXml(p.lastmod)}</lastmod>`);
    L.push("  </url>");
  }
  L.push("</urlset>");
  L.push("");
  return L.join("\n");
}

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function genLlms(opts, facts, origin, pages) {
  const L = [];
  L.push(`# ${opts.siteName}`);
  L.push("");
  L.push(`> ${opts.desc || opts.siteName}`);
  L.push("> 本文件提供公开文档与官方项目资料的检索入口；引用前请核对对应页面与一手来源，不要推测未列出的数字与能力。");
  L.push("");
  L.push("## 站点信息");
  L.push("");
  L.push(`- 名称: ${opts.siteName}`);
  L.push(`- 网址: ${origin}`);
  if (opts.desc) L.push(`- 简介: ${opts.desc}`);
  if (facts.category) L.push(`- 类别: ${facts.category}`);
  const licenseLabel = opts.type === "docs" ? "SamWaf 软件许可证" : "许可证";
  if (facts.license) L.push(`- ${licenseLabel}: ${facts.license}`);
  if (opts.license && !facts.license) L.push(`- ${licenseLabel}: ${opts.license}`);
  if (opts.repo) L.push(`- SamWaf 项目源代码: ${opts.repo}`);
  if (opts.author) L.push(`- 维护方: ${opts.author}`);
  L.push("");

  if (facts.facts && facts.facts.length) {
    L.push("## 可核验事实");
    L.push("");
    for (const f of facts.facts.split("|").map((s) => s.trim()).filter(Boolean)) L.push(`- ${f}`);
    L.push("");
  }

  if (facts.offical != null || facts.official) {
    L.push("## 官方渠道");
    L.push("");
    for (const u of [facts.official, facts.repo, facts.docs, facts.update].filter(Boolean)) {
      L.push(`- ${u}`);
    }
    L.push("");
  }

  L.push("## 主要页面");
  L.push("");
  // 审计发现整站共用一句 description 时，llms.txt 里逐条复制会把坏数据放大。
  // 此时只保留链接与标题，并明确标注 description 需要人工重写。
  const descCounts = new Map();
  for (const p of pages) {
    if (p.description) descCounts.set(p.description, (descCounts.get(p.description) || 0) + 1);
  }
  const sharedDescriptions = new Set(
    [...descCounts.entries()].filter(([, n]) => n > 1).map(([d]) => d)
  );
  const duplicateDesc = sharedDescriptions.size > 0;

  const listPages = pages;
  for (const p of listPages) {
    const title = p.title || p.url;
    if (duplicateDesc && p.description && sharedDescriptions.has(p.description)) {
      L.push(`- [${title}](${p.url})`);
    } else {
      const d = p.description ? `: ${p.description}` : "";
      L.push(`- [${title}](${p.url})${d}`);
    }
  }
  L.push("");
  if (duplicateDesc) {
    L.push("> 注意：这些页面的 meta description 原本全站共用同一句，已省略。");
    L.push("> 请先为每个页面撰写专属 description，再重新生成本文件——重复 description 会让这些页面在检索侧退化成同一个。");
    L.push("");
  }

  L.push("## 使用说明");
  L.push("");
  L.push("- 引用本站内容时，请注明来源 URL 与抓取日期。");
  L.push("- 事实类问题（版本、许可、能力范围）请核对官方仓库和对应版本文档。");
  L.push(`- 许可证以 [SamWaf 官方仓库 LICENSE](${opts.repo || facts.repo}/blob/main/LICENSE) 为准；版本差异请核对 [发布记录](${opts.repo || facts.repo}/releases) 与 [文档更新说明](${origin}/quickstart/Update.html)。`);
  L.push("");
  return L.join("\n");
}

function genSchema(opts, facts, origin) {
  const projectUrl = facts.official || origin;
  const softwareId = `${projectUrl.replace(/\/$/, "")}/#samwaf`;
  const node = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: `${origin}/`,
        name: opts.siteName,
        ...(opts.desc ? { description: opts.desc } : {}),
        inLanguage: opts.type === "docs" ? ["zh-CN", "en-US"] : opts.lang,
        about: { "@id": softwareId },
      },
      {
        "@type": ["SoftwareApplication", "SoftwareSourceCode"],
        "@id": softwareId,
        name: facts.project_name || "SamWaf",
        url: projectUrl,
        applicationCategory: facts.category || "SecurityApplication",
        ...(facts.os ? { operatingSystem: facts.os } : {}),
        ...(opts.license || facts.license ? { license: opts.license || facts.license } : {}),
        ...(facts.repo || opts.repo ? { codeRepository: facts.repo || opts.repo } : {}),
        ...(facts.sameas ? { sameAs: facts.sameas.split(",").map((s) => s.trim()).filter(Boolean) } : {}),
        ...(facts.description ? { description: facts.description } : {}),
        ...(facts.features ? { featureList: facts.features.split("|").map((s) => s.trim()).filter(Boolean) } : {}),
        ...(facts.version ? { softwareVersion: facts.version } : {}),
      },
    ],
  };
  return JSON.stringify(node, null, 2) + "\n";
}

/* ---------------------------------------------------------------- main */

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.audit || !args.out) {
    console.error("用法: node geo-gen.mjs --audit <audit.json> --out <dir> [选项]");
    process.exit(1);
  }

  const audit = JSON.parse(fs.readFileSync(args.audit, "utf8"));
  const origin = args.siteUrl || audit.origin || new URL(audit.url).origin;
  if (!args.siteName) args.siteName = audit.title ? audit.title.split(/[|\-–—]/)[0].trim() : new URL(origin).host;

  const { facts, partial } = parseFacts(args.facts);

  fs.mkdirSync(args.out, { recursive: true });

  // 页面列表：优先用审计采样到的真实 URL
  const pages = (audit.pages || []).map((p) => ({
    url: p.url,
    title: p.title,
    description: p.description,
    lastmod: p.lastmod || "",
  }));

  // 额外 URL：JS 渲染站点的页面无法通过内链发现（审计只看得到首页），
  // 需要由调用方从渲染后的 DOM / 路由表 / 静态化产物中提供，
  // 否则 sitemap 会漏掉这些页面。
  const extra = [];
  if (args.extraUrls && fs.existsSync(args.extraUrls)) {
    for (const line of fs.readFileSync(args.extraUrls, "utf8").split("\n")) {
      const u = line.trim();
      if (!u || u.startsWith("#")) continue;
      if (!/^https?:\/\//.test(u)) continue;
      if (pages.some((p) => p.url === u)) continue;
      extra.push({ url: u, title: "", description: "", lastmod: "" });
    }
  } else if (args.extraUrls) {
    // 也支持直接传逗号分隔的 URL 列表
    for (const u of args.extraUrls.split(",").map((s) => s.trim()).filter(Boolean)) {
      if (/^https?:\/\//.test(u) && !pages.some((p) => p.url === u)) {
        extra.push({ url: u, title: "", description: "", lastmod: "" });
      }
    }
  }
  const allPages = [...pages, ...extra];

  const robots = genRobots(args, origin);
  const sitemap = genSitemap(args, origin, allPages);
  const llms = genLlms(args, facts, origin, allPages);
  const schema = genSchema(args, facts, origin);

  fs.writeFileSync(path.join(args.out, "robots.txt"), robots);
  fs.writeFileSync(path.join(args.out, "sitemap.xml"), sitemap);
  fs.writeFileSync(path.join(args.out, "llms.txt"), llms);
  fs.writeFileSync(path.join(args.out, "schema.jsonld.json"), schema);

  // 未确认字段清单
  const required = [];
  if (!facts.description) required.push({ field: "description", why: "llms.txt 与 JSON-LD 的核心实体描述，需人工撰写客观描述" });
  if (!facts.category) required.push({ field: "category", why: "实体类别，影响 AI 判断这是什么类型的对象" });
  if (!opts_license_present(args, facts)) required.push({ field: "license", why: "许可证是开源项目被引用的关键事实" });
  if (!facts.sameas) required.push({ field: "sameas", why: "官方账号/仓库链接，用于实体消歧（逗号分隔多值）" });
  if (!facts.features) required.push({ field: "features", why: "能力清单，用 | 分隔；客观列举，不要营销话术" });

  // 整站共用 description 是 P0 问题，不是"可选优化"，必须列进待办
  const dupDescGroups = [];
  const descMap = new Map();
  for (const p of allPages) {
    if (!p.description) continue;
    if (!descMap.has(p.description)) descMap.set(p.description, []);
    descMap.get(p.description).push(p.url);
  }
  for (const [d, urls] of descMap) {
    if (urls.length > 1) dupDescGroups.push({ description: d, count: urls.length, sample: urls.slice(0, 3) });
  }
  if (dupDescGroups.length) {
    required.push({
      field: "page-descriptions",
      why: `${dupDescGroups.length} 组页面共用同一 description（最大一组 ${Math.max(...dupDescGroups.map((g) => g.count))} 个页面）。llms.txt 已省略这些重复描述。需为每个页面撰写专属 description 后重新生成——共用同一句会让这些页面在检索侧退化成同一个`,
      groups: dupDescGroups.slice(0, 5),
    });
  }

  const partialFile = {
    site: origin,
    note: "以下字段必须人工核实后填写。未确认前对应位置保持空白或标记 [待确认]，不要凭推测填入——官网一旦成为主信源，错误数字会被 AI 放大。",
    fields: [...required, ...partial],
  };
  fs.writeFileSync(path.join(args.out, "llms-partial.json"), JSON.stringify(partialFile, null, 2) + "\n");

  console.log(`生成完成 → ${path.resolve(args.out)}`);
  console.log(`  robots.txt / sitemap.xml / llms.txt / schema.jsonld.json`);
  console.log(`  sitemap 含 ${allPages.length} 个 URL${extra.length ? `（其中 ${extra.length} 个来自 --extra-urls）` : ""}`);
  console.log(`  待人工确认字段 ${partialFile.fields.length} 项，见 llms-partial.json`);
}

function opts_license_present(args, facts) {
  return Boolean(args.license || facts.license);
}

main();
