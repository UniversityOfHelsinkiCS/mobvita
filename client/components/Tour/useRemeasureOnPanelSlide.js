import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { triggerResize } from './utils'

// The panels tour steps point into: the left sidebar drawer and the right helper sidebar (assistant).
const SLIDING_PANELS = '[data-cy=sidebar-panel], .helper-sidebar'

/**
 * Re-measures the running tour step whenever a side panel finishes sliding in or out.
 *
 * Joyride measures a step's target when the step mounts, and again on window resize / scroll (and on
 * a size change of the target). The panels slide with a CSS `transform`, which triggers none of
 * those. The tours open a panel and wait a fixed SIDEBAR_SLIDE_MS before showing the step inside it,
 * but on a busy machine the slide can still be under way — or not yet started — when the step mounts,
 * and the spotlight then stays at the panel's off-screen position (e.g. x -358 for the drawer).
 * Firing the resize Joyride listens to at `transitionend` measures the panel where it actually ended.
 */
const useRemeasureOnPanelSlide = () => {
  const run = useSelector(({ tour }) => Boolean(tour?.run))

  useEffect(() => {
    if (!run) return undefined

    const handleTransitionEnd = event => {
      if (event.propertyName !== 'transform') return
      if (!(event.target instanceof Element) || !event.target.matches(SLIDING_PANELS)) return
      triggerResize()
    }

    // Capture on the document: the panels mount independently of the tour, and the event's own
    // listeners can't stop it reaching here.
    document.addEventListener('transitionend', handleTransitionEnd, true)
    return () => document.removeEventListener('transitionend', handleTransitionEnd, true)
  }, [run])
}

export default useRemeasureOnPanelSlide
