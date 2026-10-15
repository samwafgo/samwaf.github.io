import { defineClientConfig } from 'vuepress/client'
import OpenApiDoc from './components/OpenApiDoc.vue'
import { setupAnalytics } from './analytics.js'
import { setupChatSupport } from './chatSupport.js'

export default defineClientConfig({
  enhance({ app, router }) {
    app.component('OpenApiDoc', OpenApiDoc)
    if (!__VUEPRESS_SSR__) {
      setupAnalytics(router)
      setupChatSupport()
    }
  },
})
