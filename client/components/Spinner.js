import React from 'react'
import 'Assets/custom.scss'

const Spinner = ({
  fullHeight = false,
  variant = 'primary',
  inline = false,
  size = 24,
  text = '',
  textSize = 16,
  textVariant,
  textColor,
}) => {
  const variantClass = `spinner--${variant}`
  const resolvedTextVariant = textVariant ?? textColor ?? variant
  const textVariantClass = `spinner--${resolvedTextVariant}`

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
      }}
      role="status"
      aria-live="polite"
      aria-label={text || 'Loading'}
    >
      {/* This box makes the spinner take exactly `size` px in layout */}
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

      {text ? (
        <div className={`spinner-text ${textVariantClass}`} style={{ fontSize: textSize, margin: '8px' }}>
          {text}
        </div>
      ) : null}
    </div>
  )
}

export default Spinner