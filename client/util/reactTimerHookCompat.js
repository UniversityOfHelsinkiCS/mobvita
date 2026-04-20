import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useStopwatch } from 'react-timer-hook'

const makeZeroOffset = () => {
  const now = new Date()
  return new Date(now.getTime())
}

// Compatibility wrapper for the subset of react-compound-timer controls used in this codebase.
export const useTimer = ({
  initialTime = 0,
  direction = 'forward',
  startImmediately = false,
  timeToUpdate = 1000,
  onExpire,
}) => {
  const normalizedInitialTime = initialTime == null ? 0 : initialTime
  const [baseMs, setBaseMs] = useState(normalizedInitialTime)
  const initialTimeRef = useRef(normalizedInitialTime)
  const checkpointsRef = useRef([])
  const prevTimeRef = useRef(direction === 'backward' ? normalizedInitialTime : 0)
  const expiredRef = useRef(false)

  const stopwatch = useStopwatch({
    autoStart: startImmediately,
    interval: timeToUpdate,
  })

  const { totalMilliseconds, isRunning, start, pause, reset: resetStopwatch } = stopwatch

  const currentTime = useMemo(() => {
    if (direction === 'backward') {
      return baseMs - totalMilliseconds
    }

    return totalMilliseconds
  }, [baseMs, direction, totalMilliseconds])

  const setTime = useCallback(
    (nextMs) => {
      const value = nextMs == null ? 0 : Number(nextMs)
      const safeValue = Number.isNaN(value) ? 0 : value
      const shouldRestart = isRunning

      setBaseMs(safeValue)
      prevTimeRef.current = direction === 'backward' ? safeValue : 0
      expiredRef.current = safeValue <= 0

      resetStopwatch(makeZeroOffset(), shouldRestart)
    },
    [direction, isRunning, resetStopwatch]
  )

  const reset = useCallback(() => {
    setTime(initialTimeRef.current)
  }, [setTime])

  const getTime = useCallback(() => currentTime, [currentTime])

  const setCheckpoints = useCallback((checkpoints) => {
    checkpointsRef.current = Array.isArray(checkpoints) ? checkpoints : []
  }, [])

  useEffect(() => {
    const previous = prevTimeRef.current
    const current = currentTime

    checkpointsRef.current.forEach(({ time, callback }) => {
      if (typeof callback !== 'function') return

      if (direction === 'backward') {
        if (previous > time && current <= time) {
          callback()
        }
      } else if (previous < time && current >= time) {
        callback()
      }
    })

    if (
      direction === 'backward' &&
      typeof onExpire === 'function' &&
      !expiredRef.current &&
      previous > 0 &&
      current <= 0
    ) {
      expiredRef.current = true
      onExpire()
    }

    prevTimeRef.current = current
  }, [currentTime, direction, onExpire])

  const controls = useMemo(
    () => ({
      start,
      stop: pause,
      reset,
      setTime,
      getTime,
      setCheckpoints,
    }),
    [getTime, pause, reset, setCheckpoints, setTime, start]
  )

  return { controls }
}
