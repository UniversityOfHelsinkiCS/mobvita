import React, { } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { updateExerciseSettings } from 'Utilities/redux/storiesReducer'
import Concept from './Concept'

const StoryConcept = ({ concept, showTestConcepts, children }) => {
  const { concept_id: conceptId } = concept
  const dispatch = useDispatch()
  const { id: storyId } = useParams()

  const { conceptTurnedOn } = useSelector(({ stories }) => (
    { conceptTurnedOn: stories.focused && stories.focused.exercise_setting[conceptId] }))

  const handleCheckboxChange = () => {
    dispatch(updateExerciseSettings({ [conceptId]: conceptTurnedOn === 1 ? 0 : 1 }, storyId))
  }

  return (
    <Concept
      concept={concept}
      showTestConcepts={showTestConcepts}
      conceptTurnedOn={conceptTurnedOn}
      handleCheckboxChange={handleCheckboxChange}
    >
      {children}
    </Concept>
  )
}

export default StoryConcept
