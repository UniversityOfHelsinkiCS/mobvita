import { useLayoutEffect, useRef } from 'react'

// The card's word is set as large as will span its container and no larger. Below the floor it is
// left to wrap instead of shrinking into illegibility.
const MAX_FONT_SIZE = 36
const MIN_FONT_SIZE = 18

/**
 * useFittedTitle — sizes a card's word to the width of its container.
 *
 * Returns a ref for the text element. The element is measured unwrapped at the maximum size, then
 * scaled by how far it overshoots: text width is near enough linear in font size for one pass to
 * land, and the result is floored to a whole pixel so it reads as a step rather than a smudge.
 *
 * The size is written straight to the node rather than held in state — it is derived from layout,
 * so routing it through a render would measure, re-render, and measure again.
 */
const useFittedTitle = text => {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    const container = el?.parentElement
    if (!el || !container) return

    const style = window.getComputedStyle(container)
    const available =
      container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
    if (!available || available <= 0) return

    el.style.whiteSpace = 'nowrap'
    el.style.fontSize = `${MAX_FONT_SIZE}px`

    const needed = el.scrollWidth
    if (needed > available) {
      const scaled = Math.floor((MAX_FONT_SIZE * available) / needed)
      el.style.fontSize = `${Math.max(MIN_FONT_SIZE, scaled)}px`
      // Only a word that is still too wide at the floor is allowed to wrap.
      el.style.whiteSpace = scaled < MIN_FONT_SIZE ? 'normal' : 'nowrap'
    }
  }, [text])

  return ref
}

export default useFittedTitle
