import React, { useState, useEffect } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'react-bootstrap'
import { updateTestConcepts } from 'Utilities/redux/groupsReducer'

const TotalTestQuestions = ({
  setShowTestConcepts,
  groupId,
  learningLanguage,
  showTestConcepts,
}) => {
  const { testConcepts, testConceptsPending } = useSelector(({ groups }) => groups)
  const { concepts: all_concepts, pending: conceptsPending } = useSelector(({ metadata }) => metadata)
  const concepts = all_concepts.filter(concept => !showTestConcepts && concept.exercise_settings || 
    showTestConcepts && concept.test_settings)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const hidden = showTestConcepts
    ? {
        visibility: 'visible',
        display: 'flex',
        alignItems: 'center',
        gap: '1em',
        paddingLeft: '1rem',
        fontWeight: 'bold',
      }
    : {
        visibility: 'hidden',
        display: 'flex',
        alignItems: 'center',
        gap: '1em',
        paddingLeft: '1rem',
        fontWeight: 'bold',
      }

  const dispatch = useDispatch()
  const intl = useIntl()

  useEffect(() => {
    if (testConcepts) {
      setTotalQuestions(Object.values(testConcepts.test_template).reduce((a, b) => a + b, 0))
    }
  }, [testConceptsPending])

  const handleZeroing = async () => {
    const questionTemplate = {}

    concepts.forEach(concept => {
      if (concept.children?.length === 0 && concept.test_enabled) {
        questionTemplate[concept.concept_id] = 0
      }
    })
    setShowTestConcepts(false)
    await dispatch(updateTestConcepts(groupId, questionTemplate, learningLanguage))
    setShowTestConcepts(true)
  }

  const handleResetclick = async () => {
    const questionTemplate = {}

    concepts.forEach(concept => {
      if (concept.children?.length === 0 && concept.test_enabled) {
        questionTemplate[concept.concept_id] = concept.test_count
      }
    })
    setShowTestConcepts(false)
    await dispatch(updateTestConcepts(groupId, questionTemplate, learningLanguage))
    setShowTestConcepts(true)
  }

  return (
    <div style={hidden}>
      {totalQuestions} {intl.formatMessage({ id: 'total-questions' })}
      <Button onClick={handleZeroing} size="sm">
        <FormattedMessage id="set-questions-to-zero" />
      </Button>
      <Button onClick={handleResetclick} size="sm">
        <FormattedMessage id="reset-to-default" />
      </Button>
    </div>
  )
}

export default TotalTestQuestions
