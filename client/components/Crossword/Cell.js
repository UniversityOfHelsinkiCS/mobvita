import React, { useCallback, useContext } from 'react'
import { ThemeContext } from 'styled-components'

import { CrosswordSizeContext } from './context'

// expected props: row, col, answer, crossword, cellSize

/**
 * An individual-letter answer cell within the crossword grid.
 *
 * A `Cell` lives inside the SVG for a [`Crossword`](#crossword), and renders at
 * a location determined by the `row`, `col`, and `cellSize` properties from
 * `cellData` and `renderContext`.
 */
export default function Cell({ cellData, onClick, focus, highlight }) {
  const { cellSize, cellPadding, cellInner, cellHalf, fontSize } = useContext(CrosswordSizeContext)
  const {
    // gridBackground,
    cellBackground,
    cellBorder,
    textColor,
    numberColor,
    focusBackground,
    highlightBackground,
    correctBackground,
  } = useContext(ThemeContext)

  const handleClick = useCallback(
    event => {
      event.preventDefault()
      if (onClick) {
        onClick(cellData)
      }
    },
    [cellData, onClick]
  )

  const { row, col, guess, number, questionCorrect } = cellData

  const color = questionCorrect
    ? correctBackground
    : focus
    ? focusBackground
    : highlight
    ? highlightBackground
    : cellBackground

  const x = col * cellSize
  const y = row * cellSize

  return (
    <g
      onClick={questionCorrect ? null : handleClick}
      style={{ cursor: 'default', fontSize: `${fontSize}px` }}
    >
      <rect
        x={x + cellPadding}
        y={y + cellPadding}
        width={cellInner}
        height={cellInner}
        fill={color}
        stroke={cellBorder}
        strokeWidth={cellSize / 50}
      />
      {number && (
        <text
          x={x + cellPadding * 4}
          y={y + cellPadding * 4}
          textAnchor="start"
          dominantBaseline="hanging"
          style={{ fontSize: '50%', fill: numberColor }}
        >
          {number}
        </text>
      )}
      <text
        x={x + cellHalf}
        y={y + cellHalf * 1.3} // +1 for visual alignment?
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: textColor }}
      >
        {guess}
      </text>
    </g>
  )
}
