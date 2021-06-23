import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Segment } from 'semantic-ui-react'
import { addWrongExercises, addTotalExercises } from 'Utilities/redux/competitionReducer'

const PreviousSnippet = ({ snippet }) => {
  const dispatch = useDispatch()
  const { practice_snippet: practices } = snippet || {}
  useEffect(() => {
    if (!practices) return

    const allExercises = practices.filter(pr => pr.mark || pr.tested)
    const wrongExercises = allExercises.filter(pr => pr.mark === 'wrong')

    dispatch(addWrongExercises(wrongExercises.length))
    dispatch(addTotalExercises(allExercises.length))
  }, [practices])

  if (!snippet) return null

  return (
    <Segment>
      {practices.map(word => {
        const { surface, ID, mark, tested } = word
        if (mark === 'wrong')
          return (
            <span key={ID} style={{ color: 'firebrick' }}>
              {surface}
            </span>
          )
        if (tested)
          return (
            <span key={ID} style={{ color: 'green' }}>
              {surface}
            </span>
          )
        return <span key={ID}>{surface}</span>
      })}
    </Segment>
  )
}

export default PreviousSnippet
