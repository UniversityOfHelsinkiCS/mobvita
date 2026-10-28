import React, { useCallback, useContext } from 'react'

import { styled } from '@mui/material/styles'

import { CrosswordContext, CrosswordThemeContext } from './context'

// `$` props only drive the style and are kept off the DOM element.
const ClueWrapper = styled('div', { shouldForwardProp: prop => !prop.startsWith('$') })(
  ({ $highlight, $highlightBackground }) => ({
    cursor: 'default',
    backgroundColor: $highlight ? $highlightBackground : 'transparent',
  }),
)

// Single clue row; highlights when selected and marks itself correct when solved.
export default function Clue({ direction, number, children, correct, className, ...props }) {
  const { highlightBackground } = useContext(CrosswordThemeContext)
  const { focused, selectedDirection, selectedNumber, onClueSelected } =
    useContext(CrosswordContext)

  const handleClick = useCallback(
    event => {
      event.preventDefault()
      if (onClueSelected) {
        onClueSelected(direction, number)
      }
    },
    [direction, number, onClueSelected]
  )

  return (
    <ClueWrapper
      $highlightBackground={highlightBackground}
      $highlight={focused && direction === selectedDirection && number === selectedNumber}
      {...props}
      className={[`clue${correct ? ' correct' : ''}`, className].filter(Boolean).join(' ')}
      onClick={handleClick}
      aria-label={`clue-${number}-${direction}`}
    >
      {number}: {children}
    </ClueWrapper>
  )
}
