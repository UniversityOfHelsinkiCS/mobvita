const PRELOAD_RELOAD_KEY = 'preloadErrorReloadAt'

let reloadingForPreloadError = false

// A lazy chunk failed to load (stale tab after a deploy, network blip): reload once to refetch.
// A repeat failure within 10 s of that reload is left to throw, so a broken deploy reaches Sentry.
const handlePreloadError = event => {
  if (!reloadingForPreloadError) {
    try {
      if (Date.now() - Number(sessionStorage.getItem(PRELOAD_RELOAD_KEY) || 0) < 10000) return
      sessionStorage.setItem(PRELOAD_RELOAD_KEY, String(Date.now()))
    } catch {
      return
    }
    reloadingForPreloadError = true
    window.location.reload()
  }
  event.preventDefault()
}

// Installs the failed-chunk reload.
export const watchForDeploys = () => {
  window.addEventListener('vite:preloadError', handlePreloadError)
}
