import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkRevitaStatus } from 'Utilities/common'
import { clearServerError } from 'Utilities/redux/serverErrorReducer'

const RECHECK_INTERVAL_MS = 5 * 1000

// 'offline', 'server-down' or 'online'; while the server is down, re-checks /revitaStatus.
// Only our own backend is contacted: the browser's online/offline events cover the network.
const useConnectionStatus = () => {
  const dispatch = useDispatch()
  const serverError = useSelector(({ serverError }) => serverError.serverError)
  const [online, setOnline] = useState(navigator.onLine)
  const checkingRef = useRef(false)

  useEffect(() => {
    const update = () => setOnline(navigator.onLine)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  useEffect(() => {
    if (!serverError || !online) return undefined
    let cancelled = false

    // Clears the server error once /revitaStatus says OK; skips hidden tabs and overlapping calls.
    const recheck = async () => {
      if (checkingRef.current || document.visibilityState !== 'visible') return
      checkingRef.current = true
      try {
        const { data } = await checkRevitaStatus()
        if (!cancelled && data === 'OK') dispatch(clearServerError())
      } catch {
        // Still unreachable; the next check retries.
      } finally {
        checkingRef.current = false
      }
    }

    const intervalId = setInterval(recheck, RECHECK_INTERVAL_MS)
    document.addEventListener('visibilitychange', recheck)
    return () => {
      cancelled = true
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', recheck)
    }
  }, [serverError, online, dispatch])

  if (!online) return 'offline'
  return serverError ? 'server-down' : 'online'
}

export default useConnectionStatus
