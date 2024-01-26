import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar(
{
	"/en/": 
	[
		"",
		{
		  text: "Home",
		  children: ['/en/README.md','/en/Update.md']
		}, 
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
		  '/en/guide/Question.md']
		}
	] 
});
