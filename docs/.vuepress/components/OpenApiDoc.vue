<template>
  <div ref="swaggerEl" class="swagger-wrapper" />
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const swaggerEl = ref(null)
let swaggerInstance = null

function initSwagger() {
  if (!swaggerEl.value) return
  if (swaggerInstance) {
    swaggerInstance = null
  }
  swaggerEl.value.innerHTML = ''
  swaggerInstance = window.SwaggerUIBundle({
    el: swaggerEl.value,
    url: '/swagger.json',
    deepLinking: true,
    presets: [
      window.SwaggerUIBundle.presets.apis,
      window.SwaggerUIBundle.SwaggerUIStandalonePreset,
    ],
  })
}

function ensureCss() {
  const cssId = 'swagger-ui-css'
  if (!document.getElementById(cssId)) {
    const link = document.createElement('link')
    link.id = cssId
    link.rel = 'stylesheet'
    link.href = '/swagger-ui/swagger-ui.css'
    document.head.appendChild(link)
  }
}

onMounted(() => {
  ensureCss()
  // 脚本已缓存（SPA 切换回来），直接初始化；否则动态加载
  if (typeof window.SwaggerUIBundle !== 'undefined') {
    initSwagger()
  } else {
    const scriptId = 'swagger-ui-bundle-js'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = '/swagger-ui/swagger-ui-bundle.js'
      script.onload = initSwagger
      document.body.appendChild(script)
    }
  }
})

onUnmounted(() => {
  swaggerInstance = null
})
</script>

<style>
.swagger-wrapper {
  min-height: 600px;
}
</style>
