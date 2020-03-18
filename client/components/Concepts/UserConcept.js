import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateExerciseSettings } from 'Utilities/redux/userReducer'
import Concept from './Concept'

const UserConcept = ({ concept, showTestConcepts, children }) => {
  const { concept_id: conceptId } = concept
  const dispatch = useDispatch()

  const { conceptTurnedOn } = useSelector(({ user }) => (
    { conceptTurnedOn: user.exerciseSettings && user.exerciseSettings[conceptId] }))

  const handleCheckboxChange = () => {
    dispatch(updateExerciseSettings({ [conceptId]: conceptTurnedOn === 1 ? 0 : 1 }))
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

export default UserConcept
