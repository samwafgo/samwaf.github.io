import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
    "/guide/": [
        "/guide/README.md",
        {
            text: "网站防护",
            collapsible: true,
            children: [
                "/guide/Host.md",
                "/guide/Rule.md",
                "/guide/IPWhite.md",
                "/guide/IPBlack.md",
                "/guide/UrlWhite.md",
                "/guide/UrlBlack.md",
                "/guide/Ldp.md",
                "/guide/CC.md",
                "/guide/Sensitive.md",
                "/guide/FirewallIPBlock.md",
                "/guide/CacheRule.md",
                "/guide/HttpAuthBase.md",
                "/guide/SSL.md",
                "/guide/BlockingPage.md",
                "/guide/BatchTask.md",
            ],
        },
        {
            text: "防护日志",
            collapsible: true,
            children: [
                "/guide/AttackLog.md",
            ],
        },
        {
            text: "系统设置",
            collapsible: true,
            children: [
                "/guide/AIDetection.md",
                "/guide/PrivateInfo.md",
                "/guide/OneKeyMod.md",
                "/guide/Task.md",
            ],
        },
        {
            text: "账号管理",
            collapsible: true,
            children: [
                "/guide/Otp.md",
            ],
        },
        {
            text: "隧道防护",
            collapsible: true,
            children: [
                "/guide/Tunnel.md",
            ],
        },
    ],
    "/quickstart/": [
        {
            text: "快速上手",
            link: "/quickstart/readme.md",
        },
        {
            text: "小皮面板安装",
            link: "/quickstart/xppanel-install.md",
        },
        {
            text: "升级日志",
            link: "/quickstart/Update.md",
        },
    ],
    "/faq/": [
        {
            text: "常见问题",
            link: "/faq/readme.md",
        },
    ],
    "/dev/": [
        {
            text: "开发手册",
            link: "/dev/readme.md",
        },
    ],
});
