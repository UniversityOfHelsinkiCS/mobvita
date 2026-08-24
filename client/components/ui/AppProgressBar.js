import React from 'react'
import { colors } from 'Assets/mui_theme/designTokens'

/**
 * AppProgressBar — the 2026 progress bar: a pill with a pale-green track and a sage-green fill.
 *
 * `value` is 0–100. Pass `label` (string/node) to overlay a centered caption (e.g. "3 / 6"); it
 * reads well over both the track and the fill. `trackColor` / `fillColor` / `height` are
 * overridable; extra props spread onto the root, `labelProps` onto the caption span, and
 * `fillProps` onto the moving fill itself (for a `data-cy` hook or a squared-off radius).
 *
 * Pass `segments` (a count) for the discrete variant: the bar becomes that many equal blocks and
 * `value` fills them by rounding to the nearest whole block. Omit it for the continuous bar.
 */

const AppProgressBar = ({
  value = 0,
  segments,
  label,
  labelProps,
  fillProps,
  height = '1.5em',
  trackColor = colors.progressBarTrack,
  fillColor = colors.progressBarFill,
  style,
  ...rest
}) => {
  const pct = Math.min(100, Math.max(0, value))

  if (segments > 0) {
    const filled = Math.round((pct / 100) * segments)

    return (
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        {...rest}
        style={{ display: 'flex', height, borderRadius: 999, overflow: 'hidden', ...style }}
      >
        {Array.from({ length: segments }, (_, i) => (
          <div key={i} style={{ flex: 1, backgroundColor: i < filled ? fillColor : trackColor }} />
        ))}
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'relative',
        height,
        borderRadius: 999,
        backgroundColor: trackColor,
        overflow: 'hidden',
        ...style,
      }}
      {...rest}
    >
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        {...fillProps}
        style={{
          height: '100%',
          width: `${pct}%`,
          backgroundColor: fillColor,
          borderRadius: 999,
          transition: 'width 0.4s ease',
          ...(fillProps && fillProps.style),
        }}
      />
      {label != null && (
        <span
          {...labelProps}
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            transform: 'translateY(-50%)',
            textAlign: 'center',
            lineHeight: 1,
            fontWeight: 600,
            fontSize: '0.85em',
            color: colors.ink,
            ...(labelProps && labelProps.style),
          }}
        >
          {label}
        </span>
      )}
    </div>
  )
}

export default AppProgressBar
