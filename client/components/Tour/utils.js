/* eslint-disable no-unused-vars */
import React from 'react'
import direction from 'Assets/images/direction.png'

// Decorative "start" sign rendered inside welcome/end tour steps.
export const tourSign = () => (
  <img
    src={direction}
    alt="start"
    style={{ maxWidth: '20%', maxHeight: '20%', marginTop: '25px', marginLeft: '5px' }}
  />
)

// Resolves a Joyride step target safely: if the selector isn't in the DOM,
// fall back to `fallbackTarget`, and ultimately to `'body'`.
export const getSafeTarget = (target, fallbackTarget = 'body') => {
  if (typeof target !== 'string' || target === 'body') return target
  if (document.querySelector(target) instanceof HTMLElement) return target
  const fallback = document.querySelector(fallbackTarget)
  return fallback instanceof HTMLElement ? fallbackTarget : 'body'
}

// Clicks the close icon of the first visible Semantic-UI modal. Returns
// whether a modal was actually closed.
export const closeVisibleModal = () => {
  const closeButton = Array.from(document.querySelectorAll('.ui.modal .close.icon')).find(
    el => el instanceof HTMLElement && el.offsetParent !== null,
  )
  if (closeButton instanceof HTMLElement) {
    closeButton.click()
    return true
  }
  return false
}

// Fires a synthetic window resize so Joyride re-measures after DOM mutations.
export const triggerResize = () => window.dispatchEvent(new Event('resize'))

// Resolves the role/screen key used to look up a STEP_ORDER list.
export const resolveOrderKey = ({ bigScreen, teacherView }) =>
  `${bigScreen ? 'desktop' : 'mobile'}${teacherView ? 'Teacher' : 'Student'}`

// Builds the concrete step list for a tour. Blueprints may be plain objects
// or functions that receive `ctx` (bigScreen, teacherView, ...). Targets are
// passed through unchanged so Joyride can resolve them lazily when each
// step is shown — pre-resolving against the current DOM would freeze
// late-mounting targets (e.g. async-loaded story buttons) to `'body'`.
// `fallbackTarget` is accepted but ignored; kept for call-site compatibility.
export const buildSteps = (stepBlueprints, order, ctx = {}) =>
  order.map(id => {
    const bp = stepBlueprints[id]
    return typeof bp === 'function' ? bp(ctx) : bp
  })
