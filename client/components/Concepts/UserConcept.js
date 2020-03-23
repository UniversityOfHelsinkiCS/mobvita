import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateExerciseSettings } from 'Utilities/redux/userReducer'
import Concept from './Concept'

const UserConcept = ({ concept, children, ...props }) => {
  const { concept_id: conceptId } = concept
  const dispatch = useDispatch()

  const { conceptTurnedOn } = useSelector(({ user }) => (
    { conceptTurnedOn: user && user.data.user.exercise_setting[conceptId] }))

  const handleCheckboxChange = () => {
    dispatch(updateExerciseSettings({ [conceptId]: conceptTurnedOn === 1 ? 0 : 1 }))
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

export default UserConcept
