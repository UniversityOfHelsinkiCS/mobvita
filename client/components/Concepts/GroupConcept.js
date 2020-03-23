import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { updateTestConcepts, updateExerciseSettings } from 'Utilities/redux/groupsReducer'
import Concept from './Concept'

const GroupConcept = ({ concept, showTestConcepts, children }) => {
  const { concept_id: conceptId } = concept
  const dispatch = useDispatch()
  const { id: groupId } = useParams()

  const { testConceptQuestionAmount, conceptTurnedOn } = useSelector(({ groups }) => (
    {
      testConceptQuestionAmount: groups.testConcepts
        && groups.testConcepts.test_template[conceptId],
      conceptTurnedOn: groups.group && groups.group.exercise_setting[conceptId],
    }))

  const handleTestQuestionAmountChange = (e) => {
    if (e.target.value) {
      dispatch(updateTestConcepts(groupId, { [conceptId]: Number(e.target.value) }))
    }
  }

  const handleCheckboxChange = () => {
    dispatch(updateExerciseSettings({ [conceptId]: conceptTurnedOn === 1 ? 0 : 1 }, groupId))
  }

  return (
    <>
      <Concept
        concept={concept}
        showTestConcepts={showTestConcepts}
        conceptTurnedOn={conceptTurnedOn}
        testConceptQuestionAmount={testConceptQuestionAmount}
        handleTestQuestionAmountChange={handleTestQuestionAmountChange}
        handleCheckboxChange={handleCheckboxChange}
      >
        {children}
      </Concept>
    </>
  )
}

export default GroupConcept
