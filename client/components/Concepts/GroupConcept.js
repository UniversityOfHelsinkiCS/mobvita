import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { updateTestConcepts } from 'Utilities/redux/groupsReducer'
import Concept from './Concept'

const GroupConcept = ({ concept, showTestConcepts, children }) => {
  const { concept_id: conceptId } = concept
  const dispatch = useDispatch()
  const { id: groupId } = useParams()

  const { testConceptQuestionAmount } = useSelector(({ groups }) => (
    {
      testConceptQuestionAmount: groups.testConcepts
        && groups.testConcepts.test_template[conceptId],
    }))

  const handleTestQuestionAmountChange = (e) => {
    if (e.target.value) {
      dispatch(updateTestConcepts(groupId, { [conceptId]: e.target.value }))
    }
  }

  return (
    <Concept
      concept={concept}
      showTestConcepts={showTestConcepts}
      testConceptQuestionAmount={testConceptQuestionAmount}
      handleTestQuestionAmountChange={handleTestQuestionAmountChange}
    >
      {children}
    </Concept>
  )
}

export default GroupConcept
