import { defaultTheme } from 'vuepress'
import { gitPlugin } from '@vuepress/plugin-git'
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance";




export default {
	locales: { 
    // 键名是该语言所属的子路径
    // 作为特例，默认语言可以使用 '/' 作为其路径。
    '/en/': {
      lang: 'en-US',
      title: 'SamWaf',
      description: 'Web Application Firewall'
	  
    },
    '/': {
      lang: 'zh-CN',
      title: 'SamWaf',
      description: 'Sam网站应用入侵防御系统',
	  
    },
	 
  },
  theme: defaultTheme({
    // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
    repo: 'https://github.com/samwafgo/samwaf.github.io',
	docsDir: 'docs',
    // 假如文档放在一个特定的分支下：
    docsBranch: 'main',
    // 默认是 false, 设置为 true 来启用
    editLinks: true,
	// Public 文件路径
    //logo: '/images/logo.svg',
    locales: {
      '/': {
        selectLanguageName: '简体中文',
		copyright: 'Copyright @2023 SamWaf-All Rights Reserved.', 
		displayFooter: true,  
		editLinkText: '在 GitHub 上编辑此页',
		contributorsText: '贡献者',
		lastUpdatedText: '最近更新时间',
		navbar: [ 
		  {
			text: '首页',
			link: '/',
		  }, 
		  {
			text: '操作手册',
			link: '/guide/',
		  }, 
		],
		sidebar: {
		   '/': [
			{
			  text: '首页',
			  children: ['/README.md'],
			}, ],
           '/guide/': [
			{
			  text: '操作手册',
			  children: ['/guide/README.md', '/guide/HOST.md', '/guide/Rule.md', '/guide/Question.md'],
			},
		  ],
        }
      },
      '/en/': {
        selectLanguageName: 'English',
		copyright: 'Copyright @2023 SamWaf-All Rights Reserved.',
		displayFooter: true, 
		editLinkText: 'Edit this page on GitHub', 
		contributorsText: 'contributors',
		lastUpdatedText: 'LastUpdateTime',
		navbar: [ 
		  {
			text: 'Home',
			link: '/',
		  }, 
		  {
			text: 'Guide',
			link: '/guide/',
		  }, 
		],
      },
    },
  }),
   plugins: [
    gitPlugin({
      // options
    }),
	mdEnhancePlugin({
      // Enable flowchart
      flowchart: true,
	  // Enable hint box
      hint: true,
	  // 启用 mermaid
      mermaid: true,
    }),
  ],
}