import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { hiddenFeatures } from 'Utilities/common'
import { getCrossword } from 'Utilities/redux/crosswordReducer'
import Crossword from '@ajhaa/react-crossword'
import Spinner from 'Components/Spinner'
import PlainWord from 'Components/PracticeView/PlainWord'
import { isEmpty } from 'lodash'

const CrosswordView = () => {
  const { storyId } = useParams()
  const crosswordRef = useRef()
  const [currentClue, setCurrentClue] = useState(null)
  const [data, setData] = useState()
  const dispatch = useDispatch()

  const { data: crosswordData } = useSelector(({ crossword }) => crossword)

  useEffect(() => {
    localStorage.removeItem('guesses')
    const fromStorage = localStorage.getItem('crossword')
    if (fromStorage) {
      console.log(fromStorage)
      setData(JSON.parse(fromStorage))
    } else {
      dispatch(getCrossword(storyId))
    }
  }, [])

  useEffect(() => {
    if (crosswordData && !isEmpty(crosswordData)) {
      localStorage.setItem('crossword', JSON.stringify(crosswordData))
      setData(crosswordData)
    }
  }, [crosswordData])

  const formattedData = data?.entries?.reduce((newData, entry) => (
    {
      ...newData,
      [entry.direction]: {
        ...newData[entry.direction],
        [entry.number]: { answer: entry.answer.toUpperCase(), row: entry.position.x, col: entry.position.y, clue: 'none' },
      },
    }
  ), {})

  const handleWordChange = (number) => {
    if (!data.clue) return
    setCurrentClue(data.clue.find(clue => clue.clue_number === Number(number)))
  }

  const clues = data?.clue?.map((clue) => {
    if (clue.clue_number) {
      return (
        <span
          style={{ backgroundColor: currentClue && currentClue.ID === clue.ID ? 'yellow' : '' }}
          onClick={() => setCurrentClue(clue)}
          key={clue.ID}
        ><b>{clue.clue_number}. {clue.clue_direction}</b>
        </span>
      )
    }
    return <PlainWord key={clue.ID} surface={clue.surface} lemmas={clue.lemmas} wordId={clue.ID}>{clue.surface}</PlainWord>
  })

  useEffect(() => {
    if (!currentClue || !crosswordRef.current) return
    crosswordRef.current.moveTo(currentClue.clue_direction, currentClue.clue_number)
  }, [currentClue])

  const handleTabPress = (event) => {
    if (event.key !== 'Tab') return
    event.preventDefault()
    const index = data.clue.findIndex(clue => clue.ID === currentClue.ID)
    const nextClue = data.clue.slice(index + 1).find(clue => clue.clue_number)

    setCurrentClue(nextClue)
  }

  useEffect(() => {
    document.addEventListener('keydown', handleTabPress)
    return () => document.removeEventListener('keydown', handleTabPress)
  }, [currentClue, data])

  if (!hiddenFeatures) return null

  if (!formattedData) return <Spinner />

  return (
    <div style={{ display: 'flex', height: '70%' }}>
      <Crossword
        onWordChange={handleWordChange}
        onCorrect={(...e) => console.log(e)}
        data={formattedData}
        ref={crosswordRef}
      />
      <div style={{ width: '600px', overflow: 'scroll' }}>{clues}</div>
    </div>
  )
}

export default CrosswordView
