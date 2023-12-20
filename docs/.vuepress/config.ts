import { defaultTheme } from 'vuepress'
import { gitPlugin } from '@vuepress/plugin-git'

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
      description: 'Sam网站应用入侵防御系统'
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
    locales: {
      '/': {
        selectLanguageName: '简体中文',
		copyright: 'Copyright @2023 SamWaf-All Rights Reserved.', 
		displayFooter: true,  
		editLinkText: '在 GitHub 上编辑此页',
		contributorsText: '贡献者',
		lastUpdatedText: '最近更新时间',
      },
      '/en/': {
        selectLanguageName: 'English',
		copyright: 'Copyright @2023 SamWaf-All Rights Reserved.',
		displayFooter: true, 
		editLinkText: 'Edit this page on GitHub', 
		contributorsText: 'contributors',
		lastUpdatedText: 'LastUpdateTime',
      },
    },
  }),
   plugins: [
    gitPlugin({
      // options
    }),
  ],
}