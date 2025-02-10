import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateExerciseSettings, updateTempExerciseSettings } from 'Utilities/redux/userReducer'
import Concept from './Concept'
import conceptToggle from './recursiveInferring'

const UserConcept = ({ concept, children, ...props }) => {
  const { concept_id: conceptId } = concept
  const dispatch = useDispatch()
  const conceptSetting = useSelector(({ user }) => user.data.user.exercise_setting)
  const { concepts, pending: conceptsPending } = useSelector(({ metadata }) => metadata)
  const { conceptTurnedOn } = useSelector(({ user }) => (
    { conceptTurnedOn: user && user.data.user.exercise_setting[conceptId] }))

  const handleCheckboxChange = () => {
    const updatedConceptSetting = conceptToggle(concept, concepts, conceptSetting, conceptTurnedOn === 1 ? 0 : 1)
    dispatch(updateExerciseSettings({ [conceptId]: conceptTurnedOn === 1 ? 0 : 1 }))
    dispatch(updateTempExerciseSettings(updatedConceptSetting))
  }

  return (
    <Concept
      concept={concept}
      target='user'
      conceptTurnedOn={conceptTurnedOn}
      handleCheckboxChange={handleCheckboxChange}
      {...props}
    >
      {children}
    </Concept>
  )
}

export default UserConcept
