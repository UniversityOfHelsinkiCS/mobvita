import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import useResizeAware from 'react-resize-aware'
import { Spinner } from 'react-bootstrap'
import {
  hiddenFeatures,
  newCapitalize,
  capitalize,
  useLearningLanguage,
  useDictionaryLanguage,
} from 'Utilities/common'
import { getCrossword, revealClue } from 'Utilities/redux/crosswordReducer'
import Crossword from 'Components/Crossword'
import PlainWord from 'Components/PracticeView/PlainWord'
import { isEmpty } from 'lodash'
import DictionaryHelp from 'Components/DictionaryHelp'
import {
  setWords,
  getTranslationAction,
  getTranslationWithoutSaving,
} from 'Utilities/redux/translationReducer'

const CrosswordView = () => {
  const { storyId } = useParams()
  const crosswordRef = useRef()
  const [currentClue, setCurrentClue] = useState(null)
  const [data, setData] = useState()
  const [shiftPressed, setShiftPressed] = useState(false)
  const [dictionaryMinimized, setDictionaryMinimized] = useState(true)
  const dispatch = useDispatch()
  const [resizeListener, sizes] = useResizeAware()

  const learningLanguage = useLearningLanguage()
  const dictionaryLanguage = useDictionaryLanguage()
  const { data: crosswordData, clues, dimensions, title } = useSelector(
    ({ crossword }) => crossword
  )

  useEffect(() => {
    localStorage.removeItem('guesses')
    // const fromStorage = localStorage.getItem('crossword')
    // if (fromStorage) {
    //   setData(JSON.parse(fromStorage))
    // } else {
    //   dispatch(getCrossword(storyId))
    // }
    dispatch(getCrossword(storyId))
  }, [])

  useEffect(() => {
    if (crosswordData && !isEmpty(crosswordData)) {
      // localStorage.setItem('crossword', JSON.stringify(crosswordData))
      setData(crosswordData)
    }
  }, [crosswordData])

  useEffect(() => {
    if (!currentClue && data && clues) {
      setCurrentClue(clues.find(clue => clue.clue_number))
    }
  }, [data])

  const formattedData = useMemo(() => {
    return data?.entries?.reduce(
      (newData, entry) => ({
        ...newData,
        [entry.direction]: {
          ...newData[entry.direction],
          [entry.number]: {
            answer: entry.answer.toUpperCase(),
            row: entry.position.x,
            col: entry.position.y,
            clue: 'This is an important clue',
          },
        },
      }),
      {}
    )
  }, [data])

  const handleWordChange = ({ currentNumber, currentDirection }) => {
    if (!clues) return
    setCurrentClue(
      clues.find(
        clue =>
          clue.clue_number === Number(currentNumber) && clue.clue_direction === currentDirection
      )
    )
  }

  const handleWordClick = (surface, lemmas, wordId) => {
    if (lemmas) {
      dispatch(setWords(surface, lemmas))
      dispatch(
        getTranslationAction(
          newCapitalize(learningLanguage),
          lemmas,
          capitalize(dictionaryLanguage),
          null,
          wordId
        )
      )
    }
  }

  const translateClue = clue => {
    const { lemmas, surface, ID: wordId } = clue
    if (lemmas) {
      dispatch(setWords(surface, lemmas, true))
      dispatch(
        getTranslationWithoutSaving(
          newCapitalize(learningLanguage),
          lemmas,
          capitalize(dictionaryLanguage),
          null,
          wordId
        )
      )
    }
  }

  const handleClueClick = clue => {
    setCurrentClue(clue)
    translateClue(clue)
  }

  const directionArrow = dir => {
    if (dir === 'across') return '→'
    if (dir === 'down') return '↓'
    return ''
  }

  const clueElements = useMemo(
    () =>
      clues?.map(clue => {
        if (clue.clue_number && !clue.show) {
          return (
            <span
              className="crosswords-clue"
              style={{
                backgroundColor: currentClue && currentClue.ID === clue.ID ? 'yellow' : undefined,
              }}
              onClick={() => handleClueClick(clue)}
              key={clue.ID}
            >
              <b>
                {clue.clue_number} {directionArrow(clue.clue_direction)}
              </b>
            </span>
          )
        }
        return (
          <PlainWord
            style={{
              color: clue.show ? 'green' : '',
              fontWeight: clue.show ? '650' : '500',
            }}
            key={clue.ID}
            surface={clue.surface}
            lemmas={clue.lemmas}
            wordId={clue.ID}
            handleWordClick={handleWordClick}
          >
            {clue.surface}
          </PlainWord>
        )
      }),
    [clues, currentClue]
  )

  useEffect(() => {
    if (!currentClue || !crosswordRef.current) return
    crosswordRef.current.moveTo(currentClue.clue_direction, currentClue.clue_number)
    translateClue(currentClue)
  }, [currentClue])

  const findNextClue = index => {
    if (shiftPressed) {
      const clue = clues
        .slice(0, index)
        .reverse()
        .find(clue => clue.clue_number && !clue.show)

      if (!clue) {
        return clues
          .slice()
          .reverse()
          .find(clue => clue.clue_number && !clue.show)
      }

      return clue
    }
    const clue = clues.slice(index + 1).find(clue => clue.clue_number && !clue.show)

    if (!clue) {
      return clues.find(clue => clue.clue_number && !clue.show)
    }

    return clue
  }

  const handleKeyDown = event => {
    if (event.key === 'Tab') {
      event.preventDefault()
      const index = clues.findIndex(clue => clue.ID === currentClue.ID)
      const nextClue = findNextClue(index)

      setCurrentClue(nextClue)
    }

    if (event.key === 'Shift') {
      event.preventDefault()
      setShiftPressed(true)
    }
  }

  const handleKeyUp = event => {
    if (event.key === 'Shift') {
      event.preventDefault()
      setShiftPressed(false)
    }
  }

  const handleCorrect = (direction, number) => {
    setTimeout(() => {
      dispatch(revealClue(direction, Number(number)))
      const index = clues.findIndex(clue => clue.ID === currentClue.ID)
      const nextClue = findNextClue(index)

      setCurrentClue(nextClue)
    }, 100)
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [currentClue, data, shiftPressed])

  useEffect(() => {
    if (sizes.width >= 580) setDictionaryMinimized(false)
    if (sizes.width < 300) setDictionaryMinimized(true)
  }, [sizes.width])

  if (!hiddenFeatures) return null

  if (!formattedData || !clueElements)
    return (
      <div
        style={{
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h1 style={{ fontWeight: 550, fontSize: '30px' }}>Building your crossword</h1>
        <Spinner animation="grow" />
      </div>
    )

  return (
    <div style={{ display: 'flex', height: '100%', maxHeight: '90vh', justifyContent: 'center' }}>
      <div style={{ maxHeight: '100%' }}>
        <Crossword
          onWordChange={handleWordChange}
          onCorrect={handleCorrect}
          data={formattedData}
          ref={crosswordRef}
          customClues={
            <div
              style={{
                overflow: 'auto',
                maxHeight: '100%',
                maxWidth: '600px',
                position: 'relative',
                lineHeight: '2em',
                border: '1px solid #ccc',
                padding: '1em',
                boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
                borderRadius: '4px',
              }}
            >
              {resizeListener}
              <h1 style={{ fontWeight: 550, fontSize: '22px' }}>{title}</h1>
              <hr />
              {clueElements}
            </div>
          }
          dimensions={dimensions}
        />
      </div>
      <DictionaryHelp minimized={dictionaryMinimized} />
    </div>
  )
}

export default CrosswordView
