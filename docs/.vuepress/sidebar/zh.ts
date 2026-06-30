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
            text: "数据分析",
            collapsible: true,
            children: [
                "/guide/Analysis.md",
                "/guide/Spider.md",
            ],
        },
        {
            text: "防护日志",
            collapsible: true,
            children: [
                "/guide/VisitLog.md",
                "/guide/AttackLog.md",
                "/guide/LogFileWrite.md",
            ],
        },
        {
            text: "隧道防护",
            collapsible: true,
            children: [
                "/guide/Tunnel.md",
            ],
        },
        {
            text: "应用管理",
            collapsible: true,
            children: [
                "/guide/Application.md",
            ],
        },
        {
            text: "账号管理",
            collapsible: true,
            children: [
                "/guide/Account.md",
                "/guide/AccountLog.md",
                "/guide/Otp.md",
            ],
        },
        {
            text: "系统设置",
            collapsible: true,
            children: [
                "/guide/VpConfig.md",
                "/guide/FileManage.md",
                "/guide/IPLocation.md",
                "/guide/SysLog.md",
                "/guide/SystemConfig.md",
                "/guide/PrivateInfo.md",
                "/guide/DataRetention.md",
                "/guide/Owasp.md",
                "/guide/AIDetection.md",
                "/guide/RuntimeInfo.md",
                "/guide/OneKeyMod.md",
                "/guide/Task.md",
                "/guide/SqlQuery.md",
            ],
        },
        {
            text: "通知管理",
            collapsible: true,
            children: [
                "/guide/NotifyChannel.md",
                "/guide/NotifySubscription.md",
                "/guide/NotifyLog.md",
            ],
        },
        {
            text: "开放平台",
            collapsible: true,
            children: [
                "/guide/OpenPlatform.md",
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
