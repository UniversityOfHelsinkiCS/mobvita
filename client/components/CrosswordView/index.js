import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { hiddenFeatures } from 'Utilities/common'
import { getCrossword, revealClue } from 'Utilities/redux/crosswordReducer'
import Crossword from 'Components/Crossword'
import Spinner from 'Components/Spinner'
import PlainWord from 'Components/PracticeView/PlainWord'
import { isEmpty } from 'lodash'
import styled from 'styled-components'

const CrosswordWrapper = styled.div`
  max-width: 100%;
`

const CrosswordView = () => {
  const { storyId } = useParams()
  const crosswordRef = useRef()
  const [currentClue, setCurrentClue] = useState(null)
  const [data, setData] = useState()
  const dispatch = useDispatch()

  const { data: crosswordData, clues } = useSelector(({ crossword }) => crossword)

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
    if (!currentClue && data) {
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

  const handleWordChange = number => {
    if (!clues) return
    setCurrentClue(clues.find(clue => clue.clue_number === Number(number)))
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
              style={{ backgroundColor: currentClue && currentClue.ID === clue.ID ? 'yellow' : '' }}
              onClick={() => setCurrentClue(clue)}
              key={clue.ID}
            >
              <b>
                {clue.clue_number} {directionArrow(clue.clue_direction)}
              </b>
            </span>
          )
        }
        return (
          <PlainWord key={clue.ID} surface={clue.surface} lemmas={clue.lemmas} wordId={clue.ID}>
            {clue.surface}
          </PlainWord>
        )
      }),
    [clues]
  )

  useEffect(() => {
    if (!currentClue || !crosswordRef.current) return
    crosswordRef.current.moveTo(currentClue.clue_direction, currentClue.clue_number)
  }, [currentClue])

  const handleTabPress = event => {
    if (event.key !== 'Tab') return
    event.preventDefault()
    const index = clues.findIndex(clue => clue.ID === currentClue.ID)
    const nextClue = clues.slice(index + 1).find(clue => clue.clue_number && !clue.show)

    setCurrentClue(nextClue)
  }

  const handleCorrect = (_direction, number) => {
    setTimeout(() => {
      dispatch(revealClue(Number(number)))
      const index = clues.findIndex(clue => clue.ID === currentClue.ID)
      const nextClue = clues.slice(index + 1).find(clue => clue.clue_number && !clue.show)

      setCurrentClue(nextClue)
    }, 100)
  }

  useEffect(() => {
    document.addEventListener('keydown', handleTabPress)
    return () => document.removeEventListener('keydown', handleTabPress)
  }, [currentClue, data])

  if (!hiddenFeatures) return null

  if (!formattedData) return <Spinner />

  return (
    <CrosswordWrapper>
      <Crossword
        onWordChange={handleWordChange}
        onCorrect={handleCorrect}
        data={formattedData}
        ref={crosswordRef}
        customClues={<div style={{ width: '600px', overflow: 'auto' }}>{clueElements}</div>}
      />
    </CrosswordWrapper>
  )
}

export default CrosswordView
