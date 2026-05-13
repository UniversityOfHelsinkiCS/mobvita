/* eslint-disable no-unused-vars */
import React from 'react'
import direction from 'Assets/images/direction.png'

export const tourSign = () => (
  <img
    src={direction}
    alt="start"
    style={{ maxWidth: '20%', maxHeight: '20%', marginTop: '25px', marginLeft: '5px' }}
  />
)

export const getSafeTarget = (target, fallbackTarget = 'body') => {
  if (typeof target !== 'string' || target === 'body') return target
  if (document.querySelector(target) instanceof HTMLElement) return target
  const fallback = document.querySelector(fallbackTarget)
  return fallback instanceof HTMLElement ? fallbackTarget : 'body'
}

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

export const triggerResize = () => window.dispatchEvent(new Event('resize'))