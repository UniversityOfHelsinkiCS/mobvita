/* global __COMMIT__ */
import { basePath, inProduction, isStaging } from 'Utilities/common'
import { hasPendingWrites } from 'Utilities/apiConnection'

const PRELOAD_RELOAD_KEY = 'preloadErrorReloadAt'
const VERSION_CHECK_INTERVAL_MS = 5 * 60 * 1000

let newDeployAvailable = false

// Flags the tab as stale when the served version.json names a different commit than this bundle.
const checkForNewDeploy = async () => {
  if (newDeployAvailable || document.visibilityState !== 'visible') return
  try {
    const response = await fetch(`${basePath}version.json`, { cache: 'no-store' })
    if (!response.ok) return
    const { commit } = await response.json()
    if (commit && commit !== __COMMIT__) newDeployAvailable = true
  } catch {
    // Offline or mid-deploy; the next check retries.
  }
}

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

// Installs the failed-chunk reload and, on production and staging, the check for a newer deploy.
export const watchForDeploys = () => {
  window.addEventListener('vite:preloadError', handlePreloadError)
  if (!inProduction && !isStaging) return
  setInterval(checkForNewDeploy, VERSION_CHECK_INTERVAL_MS)
  document.addEventListener('visibilitychange', checkForNewDeploy)
}

// Main-menu links call this after navigate(): after a new deploy, the new page loads in full.
// Skipped while a save is in flight so it is not cancelled; the next menu click retries.
export const reloadIfNewDeploy = () => {
  if (newDeployAvailable && !hasPendingWrites()) window.location.reload()
}
