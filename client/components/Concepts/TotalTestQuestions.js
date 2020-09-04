import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useSelector } from 'react-redux'

const TotalTestQuestions = () => {
  const { testConcepts, testConceptsPending } = useSelector(({ groups }) => groups)

  const [totalQuestions, setTotalQuestions] = useState(0)

  const intl = useIntl()

  useEffect(() => {
    if (testConcepts) {
      setTotalQuestions(Object.values(testConcepts.test_template).reduce((a, b) => a + b, 0))
    }
  }, [testConceptsPending])

  return (
    <div style={{ paddingLeft: '1rem', fontWeight: 'bold' }}>
      {totalQuestions} {intl.formatMessage({ id: 'total questions' })}
    </div>
  )
}

export default TotalTestQuestions
