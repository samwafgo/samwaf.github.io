import './styles/chat-support.css'

const SERVER = 'https://work.samwaf.com'
const SITE_ID = 'samwaf_docs'
const FALLBACK_URL = 'https://service.samwaf.com/'
const FRAME_ID = 'samwaf-chat-frame'
const FALLBACK_ID = 'samwaf-chat-fallback'
const READY_TIMEOUT = 10000
const MOBILE_MAX_WIDTH = 480

interface SamChatMessage {
  namespace?: string
  action?: string
  state?: string
  fullscreen?: boolean
}

function chatEnabled(): boolean {
  if (typeof window === 'undefined' || !window.location) return false
  if (window.location.hostname === 'doc.samwaf.com') return true
  try {
    if (new URLSearchParams(window.location.search).has('chatpreview')) return true
    if (window.localStorage.getItem('samwaf_chat_preview') === '1') return true
  } catch {
    /* localStorage 不可用时保持关闭 */
  }
  return false
}

export function setupChatSupport(): void {
  if (!chatEnabled() || document.getElementById(FRAME_ID)) return

  const root = document.documentElement
  const expectedOrigin = new URL(SERVER).origin
  const iframe = document.createElement('iframe')
  iframe.id = FRAME_ID
  iframe.title = '在线客服'
  iframe.setAttribute('data-sc', 'closed')
  iframe.setAttribute('data-full', '0')
  iframe.src = `${SERVER}/widget-frame.html?server=${encodeURIComponent(SERVER)}&site_id=${encodeURIComponent(SITE_ID)}&launcher=consult`
  root.classList.add('samwaf-chat-enabled')

  let ready = false
  let full = false
  let fallbackTimer = 0
  let scheduled = 0
  let appearance = ''
  let topButton: HTMLElement | null = null

  const syncAppearance = (): void => {
    scheduled = 0
    const compact = window.innerWidth <= MOBILE_MAX_WIDTH
    const dark = root.dataset.theme === 'dark'
    iframe.classList.toggle('narrow', compact)

    const current = document.querySelector<HTMLElement>('.vp-back-to-top-button')
    if (current !== topButton) {
      buttonObserver.disconnect()
      topButton = current
      if (topButton) buttonObserver.observe(topButton, { attributes: true, attributeFilter: ['class', 'style', 'hidden'] })
    }
    const topVisible = !!topButton && !topButton.hidden && getComputedStyle(topButton).display !== 'none' && getComputedStyle(topButton).visibility !== 'hidden'
    root.classList.toggle('samwaf-chat-has-top', topVisible)

    const next = `${compact}:${dark}`
    if (ready && next !== appearance) {
      iframe.contentWindow?.postMessage({ namespace: 'samchat-host', action: 'appearance', compact, dark }, expectedOrigin)
      appearance = next
    }
  }

  const scheduleAppearance = (): void => {
    if (!scheduled) scheduled = window.requestAnimationFrame(syncAppearance)
  }
  const buttonObserver = new MutationObserver(scheduleAppearance)
  const bodyObserver = new MutationObserver(scheduleAppearance)
  const themeObserver = new MutationObserver(scheduleAppearance)

  const showFallback = (): void => {
    if (ready || document.getElementById(FALLBACK_ID)) return
    const a = document.createElement('a')
    a.id = FALLBACK_ID
    a.href = FALLBACK_URL
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    a.textContent = '咨询'
    a.setAttribute('aria-label', '在新窗口打开在线咨询')
    document.body.appendChild(a)
    requestAnimationFrame(() => a.classList.add('show'))
  }

  const onMessage = (event: MessageEvent): void => {
    if (event.origin !== expectedOrigin || event.source !== iframe.contentWindow) return
    let data = event.data as SamChatMessage | string
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data) as SamChatMessage
      } catch {
        return
      }
    }
    if (!data || data.namespace !== 'samchat') return
    if (data.action === 'ready') {
      ready = true
      appearance = ''
      window.clearTimeout(fallbackTimer)
      iframe.classList.add('ready')
      document.getElementById(FALLBACK_ID)?.remove()
      syncAppearance()
      return
    }
    if (data.action !== 'resize') return
    if (typeof data.fullscreen === 'boolean') full = data.fullscreen
    iframe.setAttribute('data-full', full ? '1' : '0')
    iframe.setAttribute('data-sc', data.state === 'open' ? 'open' : 'closed')
  }

  iframe.addEventListener('error', showFallback)
  window.addEventListener('message', onMessage)
  window.addEventListener('resize', scheduleAppearance)
  bodyObserver.observe(document.body, { childList: true, subtree: true })
  themeObserver.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
  document.body.appendChild(iframe)
  syncAppearance()
  fallbackTimer = window.setTimeout(showFallback, READY_TIMEOUT)
}
