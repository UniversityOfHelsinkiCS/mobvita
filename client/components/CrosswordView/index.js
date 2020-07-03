import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { hiddenFeatures } from 'Utilities/common'
import { getCrossword } from 'Utilities/redux/crosswordReducer'
import Crossword from '@ajhaa/react-crossword'
import Spinner from 'Components/Spinner'
import PlainWord from 'Components/PracticeView/PlainWord'

const CrosswordView = () => {
  const { storyId } = useParams()
  const crosswordRef = useRef()
  const [currentClue, setCurrentClue] = useState(null)
  const dispatch = useDispatch()

  const { pending, data } = useSelector(({ crossword }) => crossword)

  useEffect(() => {
    dispatch(getCrossword(storyId))
  }, [])

  useEffect(() => {
  }, [crosswordRef.current])

  const formattedData = data.entries && data.entries.reduce((newData, entry) => (
    {
      ...newData,
      [entry.direction]: {
        ...newData[entry.direction],
        [entry.number]: { answer: entry.answer, row: entry.position.x, col: entry.position.y, clue: 'THIS IS A CLUE' },
      },
    }
  ), {})

  const handleWordChange = (number) => {
    if (!data.clue) return
    setCurrentClue(data.clue.find(clue => clue.clue_number === Number(number)))
  }

  const clues = data.clue && data.clue.map((clue) => {
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

  if (pending || !formattedData) return <Spinner />

  return (
    <div style={{ display: 'flex' }}>
      <Crossword onWordChange={handleWordChange} data={formattedData} useStorage={false} ref={crosswordRef} />
      <div style={{ width: '600px', height: '600px', overflow: 'scroll' }}>{clues}</div>
    </div>
  )
}

export default CrosswordView
