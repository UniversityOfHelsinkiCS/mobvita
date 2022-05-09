import React, { useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import ExerciseWord from 'Components/PracticeView/CurrentSnippet/ExerciseWord'
import ControlWord from 'Components/ControlledStoryEditView/PreviousSnippets/ControlWord'
import Word from 'Components/CommonStoryTextComponents/PreviousSnippets/Word'
import ControlExerciseWord from '../ControlledStoryEditView/CurrentSnippet/ControlExerciseWord'
import PreviousExerciseWord from './PreviousSnippets/Word/PreviousExerciseWord'

const TextWithFeedback = ({ snippet, exercise = false, answers, mode, hideFeedback, ...props }) => {
  let lowestLinePosition = 0
  const openLinePositions = [1, 2, 3, 4, 5]
  const reservedLinePositions = {}
  let inChunk = false
  let chunkIsOneVerb = false
  const history = useHistory()
  const inControlStoryEditor = history.location.pathname.includes('controlled-story')

  const lineColors = ['blue', 'green', 'black', 'purple', 'cyan']

  const getSidePadding = exercise => {
    if (inControlStoryEditor) return '5px'
    return exercise ? '5px' : '2px'
  }

  const getPaddingTop = exercise => {
    if (inControlStoryEditor) return '3px'
    return exercise ? '3px' : '0px'
  }

  const getPaddingBottom = exercise => {
    if (inControlStoryEditor) return '4px'
    return exercise ? '4px' : '1px'
  }

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
    const sidePadding = getSidePadding(exercise)
    const chunkStyle = {
      borderBottom: chunkBorder,
      borderTop: chunkBorder,
      borderLeft: chunkStart ? chunkBorder : 'none',
      borderRight: chunkEnd ? chunkBorder : 'none',
      paddingTop: getPaddingTop(exercise),
      paddingBottom: getPaddingBottom(exercise),
      paddingLeft: chunkStart ? sidePadding : 'none',
      paddingRight: chunkEnd ? sidePadding : 'none',
    }
    if (chunkStart) {
      chunkStyle.borderRadius = '4px 0 0 4px'
      chunkStyle.marginLeft = '1px'
    }
    if (chunkEnd) {
      chunkStyle.borderRadius = '0 4px 4px 0'
      chunkStyle.marginRight = '1px'
    }
    return chunkStyle
  }

  const getExerciseWordComponent = (word, props) => {
    return inControlStoryEditor ? (
      <PreviousExerciseWord word={word} />
    ) : (
      /*
      <ControlExerciseWord
        hideFeedback={hideFeedback}
        key={word.ID}
        word={word}
        answer={mode !== 'review' && answers[word.ID]}
        tiedAnswer={mode !== 'review' && answers[word.tiedTo]}
        {...props}
      />
      */
      <ExerciseWord key={word.ID} word={word} {...props} />
    )
  }

  const getNonExerciseWordComponent = (hideFeedback, word, props) => {
    return inControlStoryEditor ? (
      <ControlWord
        hideFeedback={hideFeedback}
        key={word.ID}
        word={word}
        answer={mode !== 'review' && answers[word.ID]}
        tiedAnswer={mode !== 'review' && answers[word.tiedTo]}
        {...props}
      />
    ) : (
      <Word
        hideFeedback={hideFeedback}
        key={word.ID}
        word={word}
        answer={mode !== 'review' && answers[word.ID]}
        tiedAnswer={mode !== 'review' && answers[word.tiedTo]}
        {...props}
      />
    )
  }

  const createElement = (word, chunkPosition, hideFeedback) => {
    let element = exercise
      ? getExerciseWordComponent(word, props)
      : getNonExerciseWordComponent(hideFeedback, word, props)

    if (hideFeedback) return element

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

  const createdText = answers
    ? useMemo(
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

            const element = createElement(word, chunkPosition, hideFeedback)

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
    : snippet.map(word => {
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

        const element = createElement(word, chunkPosition, hideFeedback)

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
      })

  return (
    <span style={inControlStoryEditor ? { lineHeight: '2' } : { lineHeight: '1.75' }}>
      {createdText}
    </span>
  )
}

export default TextWithFeedback
