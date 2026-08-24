import React, { forwardRef } from 'react'
import { images } from 'Utilities/common'

/**
 * DifficultyLevel — story difficulty as a single level icon.
 *
 * Same scale as DifficultyStars (1-3, or 'low'/'average'/'high'), drawn as one icon instead of a
 * row of stars. To use different art, change `LEVEL_ICONS`; nothing else needs touching.
 */
const LEVEL_ICONS = {
  low: images.level1,
  average: images.level2,
  high: images.level3,
}

// The backend sends either the number or the word, so accept both.
const LEVELS = {
  1: 'low',
  low: 'low',
  2: 'average',
  average: 'average',
  3: 'high',
  high: 'high',
}

// forwardRef so it can sit directly inside a Tooltip/Popper: MUI hands the ref to the component,
// not to the element it returns, and a plain function component would drop it.
const DifficultyLevel = forwardRef(({ difficulty, size = 20, style, ...props }, ref) => {
  const level = LEVELS[difficulty]

  return (
    <img
      ref={ref}
      src={LEVEL_ICONS[level]}
      alt=""
      data-cy={`difficulty-level-${level}`}
      style={{ width: size, height: size, flexShrink: 0, objectFit: 'contain', ...style }}
      {...props}
    />
  )
})

DifficultyLevel.displayName = 'DifficultyLevel'

export default DifficultyLevel
