import { defineClientConfig } from 'vuepress/client'
import OpenApiDoc from './components/OpenApiDoc.vue'

export default defineClientConfig({
  enhance({ app }) {
    app.component('OpenApiDoc', OpenApiDoc)
  },
})
