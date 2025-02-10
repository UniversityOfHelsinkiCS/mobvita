import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { updateExerciseSettings } from 'Utilities/redux/storiesReducer'
import Concept from './Concept'
import conceptToggle from './recursiveInferring'

const StoryConcept = ({ concept, children, ...props }) => {
  const { concept_id: conceptId } = concept
  const dispatch = useDispatch()
  const { id: storyId } = useParams()

  const conceptSetting = useSelector(({ stories }) => stories.focused.exercise_setting)
  const { concepts, pending: conceptsPending } = useSelector(({ metadata }) => metadata)

  const { conceptTurnedOn } = useSelector(({ stories }) => (
    { conceptTurnedOn: stories.focused && stories.focused.exercise_setting[conceptId] }))

  const handleCheckboxChange = () => {
    const updatedConceptSetting = conceptToggle(concept, concepts, conceptSetting, conceptTurnedOn === 1 ? 0 : 1)
    console.log(updatedConceptSetting)
    dispatch(updateExerciseSettings({ [conceptId]: conceptTurnedOn === 1 ? 0 : 1 }, storyId))
  }

  return (
    <Concept
      concept={concept}
      target='stories'
      conceptTurnedOn={conceptTurnedOn}
      handleCheckboxChange={handleCheckboxChange}
      {...props}
    >
      {children}
    </Concept>
  )
}

export default StoryConcept
