import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar(
{
	"/": 
	[
		"",
		{
		  text: "首页",
		  children: ['/README.md','/Update.md']
		}, 
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
		  '/guide/Question.md']
		}
	] 
}
);
