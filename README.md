# SamWaf 文档站

运行 `npm run build` 构建到 `docs/.vuepress/dist/`。无需新增依赖或机器专用路径。

本地插件 `docs/.vuepress/local-seo.ts` 为实际 Markdown 路由生成逐页 description、canonical、OG、JSON-LD，并只配对存在的中英页面。用页面 frontmatter 的 `description` 覆盖自动摘要；新页面应有清楚的首段与标题。同一句摘要用于多页时构建会报错。404 使用 noindex，不进入 manifest 或 sitemap。主题内置 SEO/sitemap 已关闭，避免重复标签。

API 的 `operations.html` 中英入口均在构建时从 `docs/.vuepress/public/swagger.json` 生成；接口路径和摘要保留规范原文。更新规范后重新构建即可。

每次构建结束会写出 `dist/geo-pages.json`（`{ "pages": [{ "url", "title", "description", "lastmod" }] }`），只包含实际生成且可索引的页面。`lastmod` 优先使用 Git 更新时间，没有 Git 记录或由规范生成的内容使用源文件修改时间。随后调用仓库内 `scripts/geo-gen.mjs`（源自 geo-optimize 技能，2026-11-13 vendored，保留出处并修正文档实体语义），从完整 manifest 更新 robots.txt、sitemap.xml、llms.txt、schema.jsonld.json。事实来源维护在 `scripts/geo.facts`，SamWaf 软件许可证取官方后端仓库 Apache LICENSE，与本仓库 package 的 MIT 分开。

构建的 `postbuild` 自动检查完整静态产物的 metadata、实际语言路由、接口索引和生成资产，也可单独运行 `npm run verify:geo`。部署时发布完整 `docs/.vuepress/dist/`，包括上述 GEO 资产；线上抓取与重定向应在部署后再检查。
