import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar(
	{ 
		"/guide/": [
			{
				text: '操作手册',
				children: [
					'/guide/README.md',
					'/guide/HOST.md',
					'/guide/Rule.md',
					'/guide/IPWhite.md',
					'/guide/IPBlack.md',
					'/guide/UrlWhite.md',
					'/guide/UrlBlack.md',
					'/guide/Ldp.md',
					'/guide/CC.md',
					'/guide/AttackLog.md',
					'/guide/Sensitive.md',
					'/guide/SSLConfig.md',
					'/guide/SSLOrder.md',
					'/guide/SslExpire.md',
					]
			}
		],	
		"/quickstart/": [
			{
				text: "快速上手",
				link: "/quickstart/readme.md"
			},
			{
				text: "升级日志",
				link: "/quickstart/Update.md"
			}
		],
		"/faq/": [
			{
				text: "常见问题",
				link: "/faq/readme.md"
			}
		],
		"/dev/": [
			{
				text: "开发手册",
				link: "/dev/readme.md"
			}
		]
	}
);