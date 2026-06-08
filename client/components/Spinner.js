import React, { useEffect, useState } from 'react'

const Spinner = ({
  fullHeight = false,
  variant = 'primary',
  spinnerColor,
  inline = false,
  size = 24,
  text = '',
  delayedMessage = [],
  textSize = 20,
  textVariant = 'primary',
  textColor,
}) => {
  const [messageIndex, setMessageIndex] = useState(0)

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
        }, 2000)
      }
    }, 2000)

    return () => {
      window.clearTimeout(timeoutId)
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [text, delayedMessage?.join('||')])

  const variantClass = `spinner--${variant}`
  const resolvedTextVariant = textVariant ?? textColor ?? variant
  const textVariantClass = `spinner--${resolvedTextVariant}`
  const messages = Array.isArray(delayedMessage) ? delayedMessage.filter(Boolean) : []
  const displayText = messageIndex === 0 ? text : messages[messageIndex - 1]

  const scale = size / 80

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
        ...(spinnerColor ? { '--spinner-color': spinnerColor } : {}),
      }}
      role="status"
      aria-live="polite"
      aria-label={typeof displayText === 'string' ? displayText : 'Loading'}
    >
      <div
        className="spinner-roller-box"
        style={{
          width: size,
          height: size,
          position: 'relative',
          display: 'inline-block',
          flex: '0 0 auto',
        }}
      >
        <div
          className="lds-roller"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
          }}
        >
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      {displayText ? (
        <div
          className={`spinner-text ${textVariantClass}`}
          style={{ fontSize: textSize, margin: '8px' }}
        >
          {displayText}
        </div>
      ) : null}
    </div>
  )
}

export default Spinner
