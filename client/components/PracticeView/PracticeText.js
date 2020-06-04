import React, { useRef, useState, useEffect, useMemo } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { Spinner } from 'react-bootstrap'
import WordInput from './WordInput'

const PracticeText = (props) => {
  const snippets = useSelector(({ snippets }) => snippets)
  const textComponent = useRef(null)
  const [previousHeight, setPreviousHeight] = useState(0)
  const practiceSnippet = useSelector(({ snippets }) => (
    snippets.focused && snippets.focused.practice_snippet), shallowEqual)

  useEffect(() => {
    if (textComponent.current) {
      setPreviousHeight(textComponent.current.clientHeight)
    }
  }, [practiceSnippet])

  let lowestLinePosition = 0
  const openLinePositions = [1, 2, 3]
  const reservedLinePositions = { }
  let inChunk = false

  const lineColors = ['blue', 'green', 'black']

  const createNestedSpan = (element, id, position, counter) => {
    const spanStyle = {
      borderBottom: openLinePositions.includes(position)
        ? 'none'
        : `1px solid ${lineColors[position - 1]}`,
      paddingBottom: `${4 + 3 * position}px`,
    }

    if (counter > 0) {
      const newElement = <span key={`${id}-${position}`} style={spanStyle}>{element}</span>
      return createNestedSpan(newElement, id, position + 1, counter - 1)
    }

    return element
  }

  const reserveLinePosition = (patternId) => {
    reservedLinePositions[patternId] = openLinePositions.shift()
    lowestLinePosition = Math.max(...Object.values(reservedLinePositions))
  }

  const freeLinePosition = (patternId) => {
    openLinePositions.push(reservedLinePositions[patternId])
    openLinePositions.sort()
    delete reservedLinePositions[patternId]
    lowestLinePosition = Math.max(...Object.values(reservedLinePositions))
  }

  const createElement = (word, chunkPosition) => {
    let element = <WordInput key={word.ID} word={word} {...props} />
    if (inChunk) {
      let chunkClassName = 'chunk-all'
      if (chunkPosition === 'start') chunkClassName = 'chunk-all chunk-start'
      if (chunkPosition === 'end') chunkClassName = 'chunk-all chunk-end'
      element = <span className={chunkClassName}>{element}</span>
    }
    if (lowestLinePosition === 0 && !inChunk) return element
    element = createNestedSpan(element, word.ID, 1, lowestLinePosition)
    return element
  }

  const createText = useMemo(() => practiceSnippet && practiceSnippet.map((word) => {
    let patternPosition
    let patternId
    if (word.pattern) [, patternPosition, patternId] = word.pattern.split('_')

    const chunkPosition = word.chunk && word.chunk.split('_')[1]

    if (patternPosition === 'start') {
      reserveLinePosition(patternId)
    }

    if (chunkPosition === 'start') {
      inChunk = true
    }

    const element = createElement(word, chunkPosition)

    if (patternPosition === 'end') {
      freeLinePosition(patternId)
    }

    if (chunkPosition === 'end') {
      inChunk = false
    }

    return element
  }), [practiceSnippet])

  if (snippets.pending || !practiceSnippet) {
    return (
      <div className="spinner-container" style={{ minHeight: previousHeight }}>
        <Spinner animation="border" variant="primary" size="lg" />
      </div>
    )
  }

  return (
    <div ref={textComponent}>
      {createText}
    </div>
  )
}

export default PracticeText
