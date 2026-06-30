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
            text: "Data Analysis",
            collapsible: true,
            children: [
                "/en/guide/Analysis.md",
                "/en/guide/Spider.md",
            ],
        },
        {
            text: "Protection Logs",
            collapsible: true,
            children: [
                "/en/guide/VisitLog.md",
                "/en/guide/AttackLog.md",
                "/en/guide/LogFileWrite.md",
            ],
        },
        {
            text: "Tunnel Protection",
            collapsible: true,
            children: [
                "/en/guide/Tunnel.md",
            ],
        },
        {
            text: "App Management",
            collapsible: true,
            children: [
                "/en/guide/Application.md",
            ],
        },
        {
            text: "Account",
            collapsible: true,
            children: [
                "/en/guide/Account.md",
                "/en/guide/AccountLog.md",
                "/en/guide/Otp.md",
            ],
        },
        {
            text: "System Settings",
            collapsible: true,
            children: [
                "/en/guide/VpConfig.md",
                "/en/guide/FileManage.md",
                "/en/guide/IPLocation.md",
                "/en/guide/SysLog.md",
                "/en/guide/SystemConfig.md",
                "/en/guide/PrivateInfo.md",
                "/en/guide/DataRetention.md",
                "/en/guide/Owasp.md",
                "/en/guide/AIDetection.md",
                "/en/guide/RuntimeInfo.md",
                "/en/guide/OneKeyMod.md",
                "/en/guide/Task.md",
                "/en/guide/SqlQuery.md",
            ],
        },
        {
            text: "Notification",
            collapsible: true,
            children: [
                "/en/guide/NotifyChannel.md",
                "/en/guide/NotifySubscription.md",
                "/en/guide/NotifyLog.md",
            ],
        },
        {
            text: "Open Platform",
            collapsible: true,
            children: [
                "/en/guide/OpenPlatform.md",
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
