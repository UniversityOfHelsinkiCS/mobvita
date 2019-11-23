import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Segment } from 'semantic-ui-react'
import { addWrongExercises, addTotalExercises } from 'Utilities/redux/competitionReducer'

const PreviousSnippet = ({ snippet }) => {
  const dispatch = useDispatch()
  const { practice_snippet: practices } = snippet || {}
  useEffect(() => {
    if (!practices) return

    const allExercises = practices.filter(pr => pr.mark)
    const wrongExercises = allExercises.filter(pr => pr.mark === 'wrong')

    dispatch(addWrongExercises(wrongExercises.length))
    dispatch(addTotalExercises(allExercises.length))
  }, [practices])

  if (!snippet) return null

  return (
    <Segment>
      {practices.map((word) => {
        const { surface, isWrong, _id: id } = word
        if (!isWrong) return <span key={id}>{surface}</span>

        return <span key={id} style={{ color: 'firebrick' }}>{surface}</span>
      })}
    </Segment>
  )
}

export default PreviousSnippet
