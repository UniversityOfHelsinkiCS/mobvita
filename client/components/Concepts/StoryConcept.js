import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { updateExerciseSettings } from 'Utilities/redux/storiesReducer'
import Concept from './Concept'

const StoryConcept = ({ concept, children, ...props }) => {
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
      conceptTurnedOn={conceptTurnedOn}
      handleCheckboxChange={handleCheckboxChange}
      {...props}
    >
      {children}
    </Concept>
  )
}

export default StoryConcept
