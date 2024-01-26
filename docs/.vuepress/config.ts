import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    '/en/': {
      lang: 'en-US',
      title: 'SamWaf Web Application Firewall',
      description: 'Web Application Firewall'

    },
    '/': {
      lang: 'zh-CN',
      title: 'SamWaf 网站防火墙',
      description: 'SamWaf 网站防火墙',

    },
  },

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
