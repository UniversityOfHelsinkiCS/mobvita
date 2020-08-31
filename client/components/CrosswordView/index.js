import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Spinner } from 'react-bootstrap'
import { useLearningLanguage, useDictionaryLanguage, hiddenFeatures } from 'Utilities/common'
import { getCrossword, revealClue } from 'Utilities/redux/crosswordReducer'
import Crossword from 'Components/CrosswordView/Crossword'
import PlainWord from 'Components/PracticeView/PlainWord'
import { isEmpty } from 'lodash'
import DictionaryHelp from 'Components/DictionaryHelp'
import { setWords, getTranslationAction } from 'Utilities/redux/translationReducer'
import EndModal from './EndModal'

const CrosswordView = () => {
  const { storyId } = useParams()
  const crosswordRef = useRef()
  const [currentClue, setCurrentClue] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [data, setData] = useState()
  const [crosswordOptions, setCrosswordOptions] = useState({
    density: '',
    size: '',
    width: '',
    height: '',
  })
  const dispatch = useDispatch()

  const learningLanguage = useLearningLanguage()
  const dictionaryLanguage = useDictionaryLanguage()
  const { data: crosswordData, clues, dimensions, title } = useSelector(
    ({ crossword }) => crossword
  )

  const handleOptionChange = field => event => {
    setCrosswordOptions({ ...crosswordOptions, [field]: event.target.value })
  }

  const refetchCrossword = () => {
    const options = {}

    Object.entries(crosswordOptions).forEach(([key, value]) => {
      if (value !== '') {
        options[key] = value
      }
    })

    dispatch(getCrossword(storyId, options))
  }

  useEffect(() => {
    localStorage.removeItem('guesses')
    dispatch(getCrossword(storyId))
  }, [])

  useEffect(() => {
    if (crosswordData && !isEmpty(crosswordData)) {
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

  const directionArrow = dir => {
    if (dir === 'across') return '→'
    if (dir === 'down') return '↓'
    return ''
  }

  const translateClue = clue => {
    const { lemmas, surface, ID: wordId, clue_direction: direction, clue_number: number } = clue
    if (lemmas) {
      dispatch(
        setWords({ surface, lemmas, clue: { number, direction: directionArrow(direction) } })
      )
      dispatch(
        getTranslationAction({
          learningLanguage,
          wordLemmas: lemmas,
          dictionaryLanguage,
          wordId,
          record: 0,
        })
      )
    }
  }

  const handleClueClick = clue => {
    setCurrentClue(clue)
    translateClue(clue)
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
              onKeyDown={() => handleClueClick(clue)}
              key={clue.ID}
              role="button"
              tabIndex="-1"
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
            word={clue}
          />
        )
      }),
    [clues, currentClue]
  )

  useEffect(() => {
    if (!currentClue || !crosswordRef.current) return
    crosswordRef.current.moveTo(currentClue.clue_direction, currentClue.clue_number)
    translateClue(currentClue)
  }, [currentClue])

  const findNextClue = (index, shiftPressed) => {
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
      const nextClue = findNextClue(index, event.shiftKey)

      setCurrentClue(nextClue)
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

  const handleCrosswordCorrect = correct => {
    if (correct) {
      setTimeout(() => setModalOpen(true), 500)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentClue, data])

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
        <h1 style={{ fontWeight: 550, fontSize: '26px' }}>
          <FormattedMessage id="building-your-crossword" />
        </h1>
        <Spinner animation="grow" />
      </div>
    )

  return (
    <div style={{ display: 'flex', height: '100%', maxHeight: '90vh', justifyContent: 'center' }}>
      <div style={{ maxHeight: '100%', position: 'relative' }}>
        {hiddenFeatures && (
          <>
            {Object.entries(crosswordOptions).map(([name, value]) => (
              <span key={name}>
                <span>{name}</span>
                <input type="text" value={value} onChange={handleOptionChange(name)} />
              </span>
            ))}
            <button type="button" onClick={refetchCrossword}>
              refetch
            </button>
            <button onClick={() => crosswordRef.current.fillAllAnswers()} type="button">
              solve crossword
            </button>
          </>
        )}
        <Crossword
          onCrosswordCorrect={handleCrosswordCorrect}
          onWordChange={handleWordChange}
          onCorrect={handleCorrect}
          data={formattedData}
          ref={crosswordRef}
          customClues={
            <>
              <div
                style={{
                  overflow: 'auto',
                  maxHeight: '100%',
                  maxWidth: '600px',
                  lineHeight: '2em',
                  border: '1px solid #ccc',
                  padding: '1em',
                  boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
                  borderRadius: '4px',
                }}
              >
                <h1 style={{ fontWeight: 550, fontSize: '22px' }}>{title}</h1>
                <hr />
                {clueElements}
              </div>
            </>
          }
          dimensions={dimensions}
        />
      </div>
      <DictionaryHelp minimized={false} />
      <EndModal
        open={modalOpen}
        setOpen={setModalOpen}
        restart={() => dispatch(getCrossword(storyId))}
      />
    </div>
  )
}

export default CrosswordView
