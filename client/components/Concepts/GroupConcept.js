import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { 
  updateTestConcepts, 
  updateExerciseSettings, 
  updateTempExerciseSettings 
} from 'Utilities/redux/groupsReducer'
import { learningLanguageSelector } from 'Utilities/common'
import Concept from './Concept'
import conceptToggle from './recursiveInferring'

const GroupConcept = ({ concept, children, ...props }) => {
  const { concept_id: conceptId } = concept
  const dispatch = useDispatch()
  const { id: groupId } = useParams()

  const learningLanguage = useSelector(learningLanguageSelector)
  const conceptSetting = useSelector(({ groups }) => groups.group.exercise_setting)
  const { concepts, pending: conceptsPending } = useSelector(({ metadata }) => metadata)
  const { testConceptQuestionAmount, conceptTurnedOn } = useSelector(({ groups }) => ({
    testConceptQuestionAmount: groups.testConcepts && groups.testConcepts.test_template[conceptId],
    conceptTurnedOn: groups.group && groups.group.exercise_setting[conceptId],
  }))

  const handleTestQuestionAmountChange = e => {
    if (e.target.value) {
      dispatch(
        updateTestConcepts(groupId, { [conceptId]: Number(e.target.value) }, learningLanguage)
      )
    }
  }

  const handleCheckboxChange = () => {
    const updatedConceptSetting = conceptToggle(concept, concepts, conceptSetting, conceptTurnedOn === 1 ? 0 : 1)
    dispatch(updateExerciseSettings({ [conceptId]: conceptTurnedOn === 1 ? 0 : 1 }, groupId))
    dispatch(updateTempExerciseSettings(updatedConceptSetting))
  }

  return (
    <>
      <Concept
        concept={concept}
        target='groups'
        conceptTurnedOn={conceptTurnedOn}
        testConceptQuestionAmount={testConceptQuestionAmount}
        handleTestQuestionAmountChange={handleTestQuestionAmountChange}
        handleCheckboxChange={handleCheckboxChange}
        {...props}
      >
        {children}
      </Concept>
    </>
  )
}

export default GroupConcept
