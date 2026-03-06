import { hopeTheme } from "vuepress-theme-hope";
import { enNavbar, zhNavbar } from "./navbar/index.js";
import { enSidebar, zhSidebar } from "./sidebar/index.js"; 

export default hopeTheme({
  logo: "/images/logo.png",
  repo: "https://github.com/samwafgo/samwaf.github.io",
  docsDir: "docs",
  docsBranch: 'main',
  locales: {
   
    "/en/": {
	  selectLanguageName: 'English',
	  copyright: 'Copyright @2024 SamWaf-All Rights Reserved.',
	  displayFooter: true,
	  editLinkText: 'Edit this page on GitHub',
	  contributorsText: 'contributors',
	  lastUpdatedText: 'LastUpdateTime',
      // navbar
      navbar: enNavbar,

      // sidebar
      sidebar: enSidebar,

      footer: "", 

      metaLocales: {
        editLink: "Edit this page on GitHub",
      },
    },

    /**
     * Chinese locale config
     */
    "/": {
	  selectLanguageName: '简体中文',
	  copyright: 'Copyright @2024 SamWaf-All Rights Reserved.',
	  displayFooter: true,
	  editLinkText: '在 GitHub 上编辑此页',
	  contributorsText: '贡献者',
	  lastUpdatedText: '最近更新时间',
      // navbar
      navbar: zhNavbar,

      // sidebar
      sidebar: zhSidebar,

      footer: "",
 

      // page meta
      metaLocales: {
        editLink: "在 GitHub 上编辑此页",
      },
    },
  },

  encrypt: {
    config: {
      "/demo/encrypt.html": ["1234"],
      "/zh/demo/encrypt.html": ["1234"],
    },
  },

  plugins: {
    components: {
      components: ["Badge", "VPCard"],
    },
  },

  markdown: {
    align: true,
    attrs: true,
    codeTabs: true,
    component: true,
    demo: true,
    figure: true,
    imgLazyload: true,
    imgSize: true,
    include: true,
    mark: true,
    stylize: [
      {
        matcher: "Recommended",
        replacer: ({ tag }) => {
          if (tag === "em")
            return {
              tag: "Badge",
              attrs: { type: "tip" },
              content: "Recommended",
            };
        },
      },
    ],
    sub: true,
    sup: true,
    tabs: true,
    vPre: true,
    flowchart: true,
    mermaid: true,
  },
});
