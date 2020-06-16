import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { hiddenFeatures } from 'Utilities/common'
import { getCrossword } from 'Utilities/redux/crosswordReducer'
import Crossword from '@jaredreisinger/react-crossword'
import Spinner from 'Components/Spinner'
import PlainWord from 'Components/PracticeView/PlainWord'

const CrosswordView = () => {
  const { storyId } = useParams()
  const dispatch = useDispatch()

  const { pending, data } = useSelector(({ crossword }) => crossword)

  useEffect(() => {
    dispatch(getCrossword(storyId))
  }, [])

  const formattedData = data.entries && data.entries.reduce((newData, entry) => (
    {
      ...newData,
      [entry.direction]: {
        ...newData[entry.direction],
        [entry.number]: { answer: entry.answer, row: entry.position.x, col: entry.position.y, clue: 'none' },
      },
    }
  ), {})

  const clues = data.clue && data.clue.map((clue) => {
    if (clue.clue_number) return <span key={clue.ID}><b>{clue.clue_number}. {clue.clue_direction}</b></span>
    return <PlainWord key={clue.ID} surface={clue.surface} lemmas={clue.lemmas} wordId={clue.ID}>{clue.surface}</PlainWord>
  })

  if (!hiddenFeatures) return null

  if (pending || !formattedData) return <Spinner />

  return (
    <div>
      <Crossword data={formattedData} useStorage={false} />
      <div style={{ display: 'inline-block', width: '480px' }}>{clues}</div>
    </div>
  )
}

export default CrosswordView
