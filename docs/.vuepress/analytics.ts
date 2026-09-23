/* 访问统计，与 SamMainHome/assets/analytics.js 同一套规则：
   1) 只在正式域名下加载，本地 dev / 预览不上报；
   2) GA 只给非中文浏览器加载（gtag CDN 国内连不上），百度统计全量加载。
   文档站是 SPA，站内跳转不刷新页面：百度要手动补 _trackPageview，
   GA4 的「增强型衡量」默认会按 history 变化自动记 page_view，不用管。 */
import type { Router } from 'vue-router'

const HOSTS = ['doc.samwaf.com']
const BAIDU_ID = '6f39488892c8b472ed0249cfa12113fa'
const GA_ID = 'G-XESKVB6E44'

declare global {
  interface Window {
    _hmt: unknown[]
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

function load(src: string): void {
  const s = document.createElement('script')
  s.async = true
  s.src = src
  document.head.appendChild(s)
}

export function setupAnalytics(router: Router): void {
  if (!HOSTS.includes(location.hostname)) return

  if (BAIDU_ID) {
    window._hmt = window._hmt || []
    load('https://hm.baidu.com/hm.js?' + BAIDU_ID)

    // 首屏由 hm.js 自己记，之后每次路由变化补一次
    let first = true
    router.afterEach((to, from) => {
      if (first) { first = false; return }
      if (to.path === from.path) return // 只改 hash（页内锚点）不算
      window._hmt.push(['_trackPageview', to.fullPath])
    })
  }

  const lang = ((navigator.languages && navigator.languages[0]) || navigator.language || '').toLowerCase()
  if (GA_ID && !lang.startsWith('zh')) {
    window.dataLayer = window.dataLayer || []
    window.gtag = function () { window.dataLayer.push(arguments) }
    load('https://www.googletagmanager.com/gtag/js?id=' + GA_ID)
    window.gtag('js', new Date())
    window.gtag('config', GA_ID, { anonymize_ip: true })
  }
}
