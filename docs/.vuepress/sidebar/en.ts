import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar(
	{ 
		"/en/guide/": [
			{
				text: 'Manual',
				children: [
					'/en/guide/README.md',
					'/en/guide/HOST.md',
					'/en/guide/Rule.md',
					'/en/guide/IPWhite.md',
					'/en/guide/IPBlack.md',
					'/en/guide/UrlWhite.md',
					'/en/guide/UrlBlack.md',
					'/en/guide/Ldp.md',
					'/en/guide/CC.md',
					'/en/guide/AttackLog.md',
					'/en/guide/Sensitive.md',
					'/en/guide/SSLConfig.md',
					'/en/guide/SslExpire.md',
					]
			}
		],	
		"/en/quickstart/": [
			{
				text: "QuickStart",
				link: "/en/quickstart/readme.md"
			},
			{
				text: "UpdateLog",
				link: "/en/quickstart/Update.md"
			}
		],
		"/en/faq/": [
			{
				text: "Faq",
				link: "/en/faq/readme.md"
			}
		]
	}
);