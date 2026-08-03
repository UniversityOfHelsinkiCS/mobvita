import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Box } from '@mui/material'
import Spinner from 'Components/Spinner'
import AppButton from 'Components/AppButton'
import AppTextField from 'Components/ui/AppTextField'
import { colors, font } from 'Assets/mui_theme/designTokens'
import {
  useLearningLanguage,
  useDictionaryLanguage,
  hiddenFeatures,
  finalConfettiRain,
} from 'Utilities/common'
import { getCrossword, revealClue, sendActivity } from 'Utilities/redux/crosswordReducer'
import Crossword from 'Components/CrosswordView/Crossword'
import PlainWord from 'Components/CommonStoryTextComponents/PlainWord'
import { isEmpty } from 'lodash'
import DictionaryHelp from 'Components/DictionaryHelp'
import HelperSidebar from 'Components/PracticeView/HelperSidebar'
import { setWords, getClueTranslationAction } from 'Utilities/redux/translationReducer'
import EndModal from './EndModal'

const CrosswordView = () => {
  const { storyId } = useParams()
  const crosswordRef = useRef()
  const [currentClue, setCurrentClue] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [data, setData] = useState()
  const [crosswordOptions, setCrosswordOptions] = useState({
    density: '0.4',
    size: '10',
    width: '30',
    height: '20',
  })
  const dispatch = useDispatch()

  const learningLanguage = useLearningLanguage()
  const dictionaryLanguage = useDictionaryLanguage()
  const isSidebarOpen = useSelector(state => state.helperSidebar?.isOpen ?? false)
  const {
    data: crosswordData,
    clues,
    dimensions,
    title,
    entries,
    start_time,
    crossword_id,
  } = useSelector(({ crossword }) => crossword)

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
    const { lemmas, translation_lemmas, surface, ID: wordId, clue_direction: direction, clue_number: number } = clue
    if (lemmas) {
      dispatch(
        setWords({ surface, lemmas, clue: { number, direction: directionArrow(direction) } })
      )
      dispatch(
        getClueTranslationAction({
          learningLanguage,
          wordLemmas: translation_lemmas || lemmas,
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
                backgroundColor: currentClue && currentClue.ID === clue.ID ? colors.green : undefined,
                borderRadius: currentClue && currentClue.ID === clue.ID ? '6px' : undefined,
                padding: currentClue && currentClue.ID === clue.ID ? '0 4px' : undefined,
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
      const entry = entries[number - 1]

      dispatch(sendActivity(storyId, crossword_id, learningLanguage, entry, entries, start_time))
      dispatch(revealClue(direction, Number(number)))
      const index = clues.findIndex(clue => clue.ID === currentClue.ID)
      const nextClue = findNextClue(index)

      setCurrentClue(nextClue)
    }, 100)
  }

  const handleCrosswordCorrect = correct => {
    if (correct) {
      const endDate = Date.now() + 2 * 1000
      const colors = ['#bb0000', '#ffffff']

      finalConfettiRain(colors, endDate)
      setTimeout(() => setModalOpen(true), 500)
    }
  }

  const solveCrossword = () => {
    crosswordRef.current.fillAllAnswers()
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
        <h1 style={{ fontWeight: 550, fontSize: '26px', fontFamily: font.family, color: colors.ink }}>
          <FormattedMessage id="building-your-crossword" />
        </h1>
        <Spinner inline size={60} />
      </div>
    )

  return (
    <div className="justify-center pt-sm" style={{ height: '100%', maxHeight: '90vh' }}>
      <div className={`cont ${isSidebarOpen ? 'sidebar-pushed' : ''}`}>
        <Box
          sx={{
            position: 'relative',
            marginTop: '1.5em',
            backgroundColor: colors.card,
            borderRadius: '30px',
            padding: '1.5em',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
            fontFamily: font.family,
            color: colors.ink,
            // The whole card is the scroll container: it grows to the taller of the grid
            // or the clue list, and the full block scrolls together (not just the text).
            maxHeight: 'calc(90vh - 1.5em)',
            overflowY: 'auto',
          }}
        >
          {hiddenFeatures && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              gap: '0.75em',
              marginBottom: '1.25em',
            }}
          >
            {Object.entries(crosswordOptions).map(([name, value]) => (
              <Box key={name} sx={{ width: 80 }}>
                <AppTextField
                  label={name.charAt(0).toUpperCase() + name.slice(1)}
                  value={value}
                  onChange={handleOptionChange(name)}
                  sx={{ '& .MuiOutlinedInput-root': { height: 32 } }}
                />
              </Box>
            ))}
            <AppButton
              variant="tan"
              size="sm"
              onClick={refetchCrossword}
              sx={{ height: 32, py: 0 }}
            >
              refetch
            </AppButton>
            <AppButton
              variant="contrast-outline"
              size="sm"
              onClick={solveCrossword}
              sx={{ height: 32, py: 0 }}
            >
              solve crossword
            </AppButton>
          </Box>
        )}
        <Crossword
          onCrosswordCorrect={handleCrosswordCorrect}
          onWordChange={handleWordChange}
          onCorrect={handleCorrect}
          data={formattedData}
          ref={crosswordRef}
          customClues={
            <div
              style={{
                maxWidth: '600px',
                lineHeight: '2em',
                fontFamily: font.family,
                color: colors.ink,
                // Override CluesWrapper's `> div { background: #fff }` so the clue
                // list shares the cream card behind it instead of a white panel.
                background: 'transparent',
              }}
            >
              <h1 style={{ fontWeight: 550, fontSize: '22px', fontFamily: font.family, color: colors.ink }}>
                {title}
              </h1>
              <hr />
              {clueElements}
            </div>
          }
          dimensions={dimensions}
        />
        </Box>
      </div>
      <HelperSidebar>
        <DictionaryHelp minimized={false} inCrossword />
      </HelperSidebar>
      {modalOpen && (
        <EndModal
          open={modalOpen}
          setOpen={setModalOpen}
          restart={() => dispatch(getCrossword(storyId))}
        />
      )}
    </div>
  )
}

export default CrosswordView
