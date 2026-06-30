import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
    "/en/guide/": [
        "/en/guide/README.md",
        {
            text: "Website Protection",
            collapsible: true,
            children: [
                "/en/guide/Host.md",
                "/en/guide/Rule.md",
                "/en/guide/IPWhite.md",
                "/en/guide/IPBlack.md",
                "/en/guide/UrlWhite.md",
                "/en/guide/UrlBlack.md",
                "/en/guide/Ldp.md",
                "/en/guide/CC.md",
                "/en/guide/Sensitive.md",
                "/en/guide/FirewallIPBlock.md",
                "/en/guide/CacheRule.md",
                "/en/guide/HttpAuthBase.md",
                "/en/guide/SSL.md",
                "/en/guide/BlockingPage.md",
                "/en/guide/BatchTask.md",
            ],
        },
        {
            text: "Protection Logs",
            collapsible: true,
            children: [
                "/en/guide/AttackLog.md",
            ],
        },
        {
            text: "System Settings",
            collapsible: true,
            children: [
                "/en/guide/AIDetection.md",
                "/en/guide/PrivateInfo.md",
                "/en/guide/OneKeyMod.md",
                "/en/guide/Task.md",
            ],
        },
        {
            text: "Account",
            collapsible: true,
            children: [
                "/en/guide/Otp.md",
            ],
        },
        {
            text: "Tunnel Protection",
            collapsible: true,
            children: [
                "/en/guide/Tunnel.md",
            ],
        },
    ],
    "/en/quickstart/": [
        {
            text: "QuickStart",
            link: "/en/quickstart/readme.md",
        },
        {
            text: "XPPanel Deploy",
            link: "/en/quickstart/xppanel-install.md",
        },
        {
            text: "UpdateLog",
            link: "/en/quickstart/Update.md",
        },
    ],
    "/en/faq/": [
        {
            text: "Faq",
            link: "/en/faq/readme.md",
        },
    ],
    "/en/dev/": [
        {
            text: "Dev Manual",
            link: "/en/dev/readme.md",
        },
    ],
    "/en/api/": [
        {
            text: "API Interface",
            link: "/en/api/",
        },
    ],
});
