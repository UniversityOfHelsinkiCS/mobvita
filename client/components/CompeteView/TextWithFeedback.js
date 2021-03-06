import React, { useMemo } from 'react'
import ExerciseWord from './CurrentSnippet/ExerciseWord'
import Word from './PreviousSnippets/Word'

const TextWithFeedback = ({ snippet, exercise = false, answers, ...props }) => {
  let lowestLinePosition = 0
  const openLinePositions = [1, 2, 3, 4, 5]
  const reservedLinePositions = {}
  let inChunk = false
  let chunkIsOneVerb = false

  const lineColors = ['blue', 'green', 'black', 'purple', 'cyan']

  const createNestedSpan = (element, id, position, counter) => {
    const spanStyle = {
      borderBottom: openLinePositions.includes(position)
        ? '1px solid transparent'
        : `1px solid ${lineColors[position - 1]}`,
      paddingBottom: `${position * 2}px`,
      display: 'inline-block',
      whiteSpace: 'pre',
    }

    if (counter > 0) {
      const newElement = (
        <span key={`${id}-${position}`} style={spanStyle}>
          {element}
        </span>
      )
      return createNestedSpan(newElement, id, position + 1, counter - 1)
    }

    return element
  }

  const reserveLinePosition = patternId => {
    reservedLinePositions[patternId] = openLinePositions.shift()
    lowestLinePosition = Math.max(...Object.values(reservedLinePositions))
  }

  const freeLinePosition = patternId => {
    openLinePositions.push(reservedLinePositions[patternId])
    openLinePositions.sort()
    delete reservedLinePositions[patternId]
    lowestLinePosition = Math.max(...Object.values(reservedLinePositions))
  }

  const createChunkStyle = chunkPosition => {
    const chunkStart = chunkPosition === 'start'
    const chunkEnd = chunkPosition === 'end'
    const chunkBorder = chunkIsOneVerb ? '1px red dashed' : '1px red solid'
    const sidePadding = exercise ? '5px' : '2px'
    const chunkStyle = {
      borderBottom: chunkBorder,
      borderTop: chunkBorder,
      borderLeft: chunkStart ? chunkBorder : 'none',
      borderRight: chunkEnd ? chunkBorder : 'none',
      paddingTop: exercise ? '3px' : 0,
      paddingBottom: exercise ? '4px' : '1px',
      paddingLeft: chunkStart ? sidePadding : 'none',
      paddingRight: chunkEnd ? sidePadding : 'none',
    }
    if (chunkStart) chunkStyle.borderRadius = '4px 0 0 4px'
    if (chunkEnd) chunkStyle.borderRadius = '0 4px 4px 0'
    return chunkStyle
  }

  const createElement = (word, chunkPosition) => {
    let element = exercise ? (
      <ExerciseWord key={word.ID} word={word} {...props} />
    ) : (
      <Word
        key={word.ID}
        word={word}
        answer={answers[word.ID]}
        tiedAnswer={answers[word.tiedTo]}
        {...props}
      />
    )
    if (inChunk) {
      const chunkStyle = createChunkStyle(chunkPosition)

      element = (
        <span key={`${word.ID}-chunk`} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
          <span style={chunkStyle}>{element}</span>
        </span>
      )
    }
    if (lowestLinePosition === 0 && !inChunk) return element
    element = createNestedSpan(element, word.ID, 1, lowestLinePosition)
    return element
  }

  const createdText = useMemo(
    () =>
      snippet &&
      snippet.map(word => {
        const { pattern } = word

        const chunkPosition = word.chunk && word.chunk.split('_')[1]

        if (pattern) {
          Object.entries(pattern)
            .filter(([, position]) => position === 'pattern_start')
            .forEach(([id]) => reserveLinePosition(id))
        }

        if (chunkPosition === 'start') {
          inChunk = true
          if (word.analytic_chunk) {
            chunkIsOneVerb = true
          }
        }

        const element = createElement(word, chunkPosition)

        if (pattern) {
          Object.entries(pattern)
            .filter(([, position]) => position === 'pattern_end')
            .forEach(([id]) => freeLinePosition(id))
        }

        if (chunkPosition === 'end') {
          inChunk = false
          chunkIsOneVerb = false
        }

        return element
      }),
    [snippet, answers]
  )

  return <span>{createdText}</span>
}

export default TextWithFeedback
