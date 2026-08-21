import React from 'react'
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

const DifficultyLevel = ({ difficulty, size = 20, style, ...props }) => {
  const level = LEVELS[difficulty]

  return (
    <img
      src={LEVEL_ICONS[level]}
      alt=""
      data-cy={`difficulty-level-${level}`}
      style={{ width: size, height: size, flexShrink: 0, objectFit: 'contain', ...style }}
      {...props}
    />
  )
}

export default DifficultyLevel
