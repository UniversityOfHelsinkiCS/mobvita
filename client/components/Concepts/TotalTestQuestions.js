import React, { useState, useEffect } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'react-bootstrap'
import { updateTestConcepts } from 'Utilities/redux/groupsReducer'

const TotalTestQuestions = ({ concepts, setShowTestConcepts, groupId, learningLanguage }) => {
  const { testConcepts, testConceptsPending } = useSelector(({ groups }) => groups)
  const [totalQuestions, setTotalQuestions] = useState(0)

  const dispatch = useDispatch()
  const intl = useIntl()
  console.log('testConcepts ', testConcepts)

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
    console.log('question temp ', questionTemplate)
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
    console.log('question temp ', questionTemplate)
    setShowTestConcepts(false)
    await dispatch(updateTestConcepts(groupId, questionTemplate, learningLanguage))
    setShowTestConcepts(true)
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1em',
        paddingLeft: '1rem',
        fontWeight: 'bold',
      }}
    >
      <Button onClick={handleZeroing} size="sm">
        <FormattedMessage id="set-questions-to-zero" />
      </Button>
      {totalQuestions} {intl.formatMessage({ id: 'total-questions' })}
      <Button onClick={handleResetclick} size="sm">
        <FormattedMessage id="reset-to-default" />
      </Button>
    </div>
  )
}

export default TotalTestQuestions
