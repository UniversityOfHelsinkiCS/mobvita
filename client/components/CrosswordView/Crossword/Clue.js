import React, { useCallback, useContext } from 'react'

import styled, { ThemeContext } from 'styled-components'

import { CrosswordContext } from './context'

const ClueWrapper = styled.div.attrs(props => ({
  className: `clue${props.correct ? ' correct' : ''}`,
}))`
  cursor: default;
  background-color: ${props => (props.highlight ? props.highlightBackground : 'transparent')};
`

export default function Clue({ direction, number, children, correct, ...props }) {
  const { highlightBackground } = useContext(ThemeContext)
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
      highlightBackground={highlightBackground}
      highlight={focused && direction === selectedDirection && number === selectedNumber}
      correct={correct}
      {...props}
      onClick={handleClick}
      aria-label={`clue-${number}-${direction}`}
    >
      {number}: {children}
    </ClueWrapper>
  )
}
