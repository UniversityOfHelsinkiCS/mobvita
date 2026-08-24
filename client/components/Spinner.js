// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import AppSpinner from 'Components/ui/AppSpinner'
import { colors } from 'Assets/mui_theme/designTokens'

// Shared loading spinner (renders the design-system AppSpinner ring). Keeps the container / text /
// delayedMessage / size / inline / fullHeight behaviour every call site relies on.
// Props:
// - fullHeight: stretch the container to near full viewport height.
// - variant: spinner theme class, e.g. primary, secondary.
// - spinnerColor: optional custom spinner color override.
// - inline: render without taking full width/height.
// - size: spinner size in pixels.
// - text: message shown under the spinner.
// - textDelay: ms to withhold `text` for, so a brief load shows a bare ring instead of a flash of
//   text. Delayed messages are unaffected.
// - delayedMessage: optional messages shown later if loading is slow.
// - textSize: font size for the spinner text.
// - textVariant: theme class for the text.
// - textColor: optional text color/theme override.
const Spinner = ({
  fullHeight = false,
  variant = 'primary',
  spinnerColor,
  inline = false,
  size = 24,
  text = '',
  textDelay = 0,
  delayedMessage = [],
  textSize = 20,
  textVariant = 'primary',
  textColor = colors.green,
}) => {
  const [messageIndex, setMessageIndex] = useState(0)
  const [textDelayElapsed, setTextDelayElapsed] = useState(textDelay <= 0)

  // Deliberately keyed on `textDelay` alone: callers update `text` while the spinner is up (a
  // percentage, say), and restarting the timer on every change would withhold it forever.
  useEffect(() => {
    if (textDelay <= 0) {
      setTextDelayElapsed(true)
      return undefined
    }
    setTextDelayElapsed(false)
    const timeoutId = window.setTimeout(() => setTextDelayElapsed(true), textDelay)
    return () => window.clearTimeout(timeoutId)
  }, [textDelay])

  useEffect(() => {
    const messages = Array.isArray(delayedMessage) ? delayedMessage.filter(Boolean) : []

    setMessageIndex(0)

    if (messages.length === 0) return undefined

    let intervalId

    const timeoutId = window.setTimeout(() => {
      setMessageIndex(1)

      if (messages.length > 1) {
        intervalId = window.setInterval(() => {
          setMessageIndex(index => (index >= messages.length ? 1 : index + 1))
        }, 20000)
      }
    }, 25000)

    return () => {
      window.clearTimeout(timeoutId)
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [text, delayedMessage?.join('||')])

  // Full-height spinners are route loaders over the app's blue application content (colors.panel),
  // where the default sage-green washes out — default them to cream.
  const resolvedSpinnerColor = spinnerColor || (fullHeight ? colors.card : undefined)

  const variantClass = `spinner--${variant}`
  // `textColor` is applied directly rather than through a `spinner--*` class: those classes still
  // resolve to bootstrap variables (`--bs-primary`) left over from the bootstrap removal.
  const textVariantClass = `spinner--${textVariant}`
  const messages = Array.isArray(delayedMessage) ? delayedMessage.filter(Boolean) : []
  const primaryText = textDelayElapsed ? text : ''
  const displayText = messageIndex === 0 ? primaryText : messages[messageIndex - 1]

  return (
    <div
      className={[
        'spinner-container',
        inline ? 'spinner-container--inline' : '',
        variantClass,
      ].join(' ')}
      style={{
        height: inline ? 'auto' : fullHeight ? '90vh' : '100%',
        width: inline ? 'auto' : '100%',
      }}
      role="status"
      aria-live="polite"
      aria-label={typeof displayText === 'string' ? displayText : 'Loading'}
    >
      <AppSpinner size={size} {...(resolvedSpinnerColor ? { color: resolvedSpinnerColor } : {})} />

      {displayText ? (
        <div
          className={`spinner-text ${textVariantClass}`}
          style={{ fontSize: textSize, margin: '8px', color: textColor }}
        >
          {displayText}
        </div>
      ) : null}
    </div>
  )
}

export default Spinner
