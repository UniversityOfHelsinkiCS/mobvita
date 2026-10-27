// lodash's default throttle, ported from its debounce with maxWait = wait so the timing matches:
// leading + trailing calls, at most one per `wait` ms; `cancel()` drops a pending call.
const throttle = (fn, wait) => {
  let lastArgs
  let lastCallTime
  let lastInvokeTime = 0
  let timer

  const invoke = time => {
    const args = lastArgs
    lastArgs = undefined
    lastInvokeTime = time
    fn(...args)
  }

  const shouldInvoke = time =>
    lastCallTime === undefined ||
    time - lastCallTime >= wait ||
    time - lastCallTime < 0 ||
    time - lastInvokeTime >= wait

  const timerExpired = () => {
    const time = Date.now()
    if (shouldInvoke(time)) {
      timer = undefined
      if (lastArgs) invoke(time)
      return
    }
    timer = setTimeout(
      timerExpired,
      Math.min(wait - (time - lastCallTime), wait - (time - lastInvokeTime)),
    )
  }

  const throttled = (...args) => {
    const time = Date.now()
    const invoking = shouldInvoke(time)
    lastArgs = args
    lastCallTime = time
    if (invoking) {
      clearTimeout(timer)
      timer = setTimeout(timerExpired, wait)
      invoke(time)
      return
    }
    if (timer === undefined) timer = setTimeout(timerExpired, wait)
  }

  throttled.cancel = () => {
    clearTimeout(timer)
    lastInvokeTime = 0
    lastArgs = lastCallTime = timer = undefined
  }

  return throttled
}

export default throttle
