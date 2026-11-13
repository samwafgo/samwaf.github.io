import { execFileSync } from "node:child_process";
import { readFile, stat, writeFile } from "node:fs/promises";
import { createPage, type HeadConfig, type Page, type Plugin } from "vuepress";

const origin = "https://doc.samwaf.com";
const official = "https://www.samwaf.com/";
const repository = "https://github.com/samwafgo/SamWaf";
const license = `${repository}/blob/main/LICENSE`;
const softwareId = `${official}#samwaf`;
const methods = new Set(["get", "post", "put", "patch", "delete", "head", "options", "trace"]);

function plainText(html: string): string {
  return html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(x[\da-f]+|\d+);/gi, (_, code: string) =>
      String.fromCodePoint(code[0].toLowerCase() === "x" ? parseInt(code.slice(1), 16) : Number(code)),
    )
    .replace(/&(nbsp|amp|quot|apos|lt|gt);/g, (_, name: string) =>
      ({ nbsp: " ", amp: "&", quot: '"', apos: "'", lt: "<", gt: ">" })[name]!,
    )
    .replace(/\s+/g, " ")
    .trim();
}

function shorten(value: string, length: number): string {
  if (value.length <= length) return value;
  const cut = value.slice(0, length - 1);
  const boundary = cut.lastIndexOf(" ");
  return `${boundary > length - 25 ? cut.slice(0, boundary) : cut}…`;
}

function descriptionFor(page: Page): string {
  if (typeof page.frontmatter.description === "string" && page.frontmatter.description.trim()) {
    return plainText(page.frontmatter.description);
  }
  const english = page.lang.startsWith("en");
  const title = plainText(page.title || (english ? "SamWaf documentation" : "SamWaf 文档"));
  const paragraphs = [...page.contentRendered.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => plainText(match[1]))
    .filter((text) => text.length >= 20 && !/^https?:\/\/\S+$/.test(text));
  const headings = page.headers.map((header) => plainText(header.title)).filter(Boolean);
  const summary = paragraphs.slice(0, 2).join(" ") || headings.slice(0, 4).join(english ? "; " : "、");
  return shorten(`${title}${english ? ": " : "："}${summary || page.filePathRelative || page.path}`, english ? 240 : 160);
}

function isNotFound(page: Page): boolean {
  return /(?:^|\/)404(?:\.html|\/)?$/.test(page.path) || page.frontmatter.layout === "NotFound";
}

function isIndexable(page: Page): boolean {
  const robots = (page.frontmatter.head || []).some(([tag, attrs]) =>
    tag === "meta" && attrs.name === "robots" && /noindex/i.test(String(attrs.content)),
  );
  return !isNotFound(page) && page.frontmatter.index !== false && !robots &&
    (!!page.filePath || page.frontmatter.geoGenerated === true);
}

function managedHead([tag, attrs]: HeadConfig): boolean {
  return (tag === "link" && (attrs.rel === "canonical" || attrs.hreflang !== undefined)) ||
    (tag === "meta" && (attrs.name === "description" || attrs.name === "robots" ||
      String(attrs.property || "").startsWith("og:"))) ||
    (tag === "script" && attrs.type === "application/ld+json");
}

function setHead(page: Page, pages: Page[]): void {
  const english = page.lang.startsWith("en");
  const url = new URL(page.path, origin).href;
  const description = page.frontmatter.description as string;
  const indexable = isIndexable(page);
  const head: HeadConfig[] = (page.frontmatter.head || []).filter((item) => !managedHead(item));
  if (!indexable) {
    head.push(["meta", { name: "robots", content: "noindex, follow" }]);
    page.frontmatter.head = head;
    return;
  }
  const title = page.title || (english ? "SamWaf Documentation" : "SamWaf 文档");
  head.push(
    ["link", { rel: "canonical", href: url }],
    ["meta", { property: "og:title", content: title }],
    ["meta", { property: "og:description", content: description }],
    ["meta", { property: "og:url", content: url }],
    ["meta", { property: "og:type", content: page.frontmatter.home ? "website" : "article" }],
    ["meta", { property: "og:site_name", content: "SamWaf Documentation" }],
    ["meta", { property: "og:locale", content: english ? "en_US" : "zh_CN" }],
    ["meta", { property: "og:image", content: `${origin}/images/logo.png` }],
  );
  // Only pair routes backed by generated, indexable pages.
  const chinesePath = english ? page.path.replace(/^\/en\//, "/") : page.path;
  const chinese = pages.find((item) => item.path === chinesePath && isIndexable(item));
  const translated = pages.find((item) => item.path === `/en${chinesePath}` && isIndexable(item));
  if (chinese && translated) {
    head.push(
      ["link", { rel: "alternate", hreflang: "zh-CN", href: new URL(chinese.path, origin).href }],
      ["link", { rel: "alternate", hreflang: "en-US", href: new URL(translated.path, origin).href }],
    );
  }
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite", "@id": `${origin}/#website`, url: `${origin}/`,
        name: "SamWaf Documentation", inLanguage: ["zh-CN", "en-US"], about: { "@id": softwareId },
      },
      {
        "@type": ["SoftwareApplication", "SoftwareSourceCode"], "@id": softwareId,
        name: "SamWaf", url: official, codeRepository: repository, license,
        applicationCategory: "SecurityApplication", sameAs: [repository],
      },
      {
        "@type": page.frontmatter.home ? "WebPage" : "TechArticle", "@id": `${url}#article`,
        url, headline: title, description, inLanguage: page.lang,
        isPartOf: { "@id": `${origin}/#website` }, about: { "@id": softwareId },
        mainEntityOfPage: url,
      },
    ],
  };
  head.push(["script", { type: "application/ld+json" }, JSON.stringify(schema).replace(/</g, "\\u003c")]);
  page.frontmatter.head = head;
}

function tableText(value: unknown): string {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\{/g, "&#123;").replace(/\}/g, "&#125;").replace(/\|/g, "&#124;")
    .replace(/`/g, "&#96;").replace(/[\r\n]+/g, " ");
}

function apiIndex(spec: { paths: Record<string, Record<string, { summary?: string; tags?: string[] }>> }, english: boolean): string {
  const intro = english
    ? "This index lists HTTP methods, paths, tags and summaries from the bundled Swagger specification. Tags and summaries retain the original language of the specification; they are not English translations."
    : "本索引从随站点发布的 Swagger 规范生成，按原文展示 HTTP 方法、接口路径、分类和摘要；参数与响应结构请查看原始规范或交互文档。";
  const rows = Object.entries(spec.paths).sort(([a], [b]) => a.localeCompare(b)).flatMap(([path, operations]) =>
    Object.entries(operations).filter(([method]) => methods.has(method)).map(([method, operation]) =>
      `| ${method.toUpperCase()} | <code v-pre>${tableText(path)}</code> | ${tableText(operation.tags?.join(" / "))} | ${tableText(operation.summary)} |`,
    ),
  );
  return `# ${english ? "API operation index" : "API 接口索引"}\n\n${intro}\n\n` +
    (english
      ? "Paths below are the exact keys in `swagger.json`; `basePath` is not prepended again. Use the address of your own SamWaf management service for calls.\n\n[Raw Swagger specification](/swagger.json) · [Authentication and interactive documentation](./) · [Conventions and scenarios](/en/dev/openapi-cookbook.html)\n\n| Method | Path (verbatim) | Tags (source language) | Summary (source language) |\n"
      : "下列路径直接取自 `swagger.json` 的 paths 键，不再次拼接 `basePath`。实际调用使用自行部署的 SamWaf 管理端地址。\n\n[原始 Swagger 规范](/swagger.json) · [认证说明与交互文档](./) · [通用约定与场景手册](/dev/openapi-cookbook.html)\n\n| 方法 | 路径（原文） | 分类（原文） | 摘要（原文） |\n") +
    `| --- | --- | --- | --- |\n${rows.join("\n")}\n`;
}

export const localSeoPlugin = (): Plugin => ({
  name: "samwaf-local-seo",
  extendsPage(page) {
    page.frontmatter.description = descriptionFor(page);
    if (!page.frontmatter.home) {
      // Hope renders the page title itself; retain existing Markdown anchors.
      const normalizeHeadings = (html: string): string => {
        let first = true;
        return html.replace(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/gi, (_, attrs: string, body: string) => {
          const isTitle = first && plainText(body) === plainText(page.title);
          first = false;
          if (isTitle) return `<span ${attrs.match(/\bid=("[^"]*"|'[^']*')/)?.[0] || ""} aria-hidden="true"></span>`;
          return `<h2${attrs}>${body}</h2>`;
        });
      };
      page.contentRendered = normalizeHeadings(page.contentRendered);
      if (page.sfcBlocks.template) {
        page.sfcBlocks.template.contentStripped = normalizeHeadings(page.sfcBlocks.template.contentStripped);
      }
    }
  },
  async onInitialized(app) {
    const spec = JSON.parse(await readFile(app.dir.public("swagger.json"), "utf8"));
    for (const english of [false, true]) {
      app.pages.push(await createPage(app, {
        path: english ? "/en/api/operations.html" : "/api/operations.html",
        content: apiIndex(spec, english),
        frontmatter: { lang: english ? "en-US" : "zh-CN", geoGenerated: true, sidebar: false },
      }));
    }
    const seen = new Map<string, string>();
    for (const page of app.pages) {
      setHead(page, app.pages);
      if (!isIndexable(page)) continue;
      const description = page.frontmatter.description as string;
      if (seen.has(description)) {
        throw new Error(`Duplicate SEO description: ${seen.get(description)} and ${page.path}. Set a page-specific frontmatter description.`);
      }
      seen.set(description, page.path);
    }
  },
  async onGenerated(app) {
    // rc.26 serializes head attributes verbatim. Keep client data raw and escape static HTML.
    const escapeAttribute = (value: unknown): string => String(value)
      .replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    await Promise.all(app.pages.map(async (page) => {
      const html = await readFile(page.htmlFilePath, "utf8");
      const end = html.indexOf("</head>");
      let head = html.slice(0, end);
      const configs: HeadConfig[] = [
        ...(page.frontmatter.head || []),
        ["meta", { name: "description", content: page.frontmatter.description as string }],
      ];
      for (const [tag, attrs] of configs) {
        const entries = Object.entries(attrs).filter(([, value]) => value !== false);
        const serialize = (escape: boolean): string => `<${tag}${entries.map(([key, value]) =>
          value === true ? ` ${key}` : ` ${key}="${escape ? escapeAttribute(value) : value}"`,
        ).join("")}>`;
        head = head.replace(serialize(false), serialize(true));
      }
      head = head.replace(/<title>([\s\S]*?)<\/title>/, (_, title: string) => `<title>${escapeAttribute(title)}</title>`);
      await writeFile(page.htmlFilePath, `${head}${html.slice(end)}`);
    }));
    const pages = await Promise.all(app.pages.filter(isIndexable).map(async (page) => {
      await stat(page.htmlFilePath);
      const git = page.data.git as { updatedTime?: number } | undefined;
      const source = page.filePath || app.dir.public("swagger.json");
      const modified = git?.updatedTime || (await stat(source)).mtimeMs;
      return {
        url: new URL(page.path, origin).href,
        title: page.title || "SamWaf Documentation",
        description: page.frontmatter.description,
        lastmod: new Date(modified).toISOString(),
      };
    }));
    pages.sort((a, b) => a.url.localeCompare(b.url));
    const manifest = app.dir.dest("geo-pages.json");
    await writeFile(manifest, `${JSON.stringify({ pages }, null, 2)}\n`);
    execFileSync(process.execPath, [
      app.dir.source("../scripts/geo-gen.mjs"), "--audit", manifest, "--out", app.dir.dest(),
      "--site-name", "SamWaf 文档", "--site-url", origin, "--type", "docs",
      "--repo", repository, "--license", license,
      "--desc", "SamWaf 的部署、配置、开发与开放平台 API 文档。",
      "--facts", app.dir.source("../scripts/geo.facts"),
    ], { stdio: "inherit" });
  },
});
