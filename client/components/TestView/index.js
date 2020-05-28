import React from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { getTestQuestions } from 'Utilities/redux/testReducer'
import { learningLanguageSelector } from 'Utilities/common'
import Spinner from 'Components/Spinner'
import TestView from './Test'


const ReportDisplay = ({ report }) => {
  const { message, correct, total } = report
  if (message !== 'OK') {
    return <div>{message}</div>
  }

  return (
    <div>Test completed. Your score: {correct}/{total}</div>
  )
}

const TestIndex = () => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const { sessionId, report, pending } = useSelector(({ tests }) => tests)

  const startTest = () => {
    dispatch(getTestQuestions(learningLanguage))
  }

  if (pending) {
    return <Spinner />
  }

  return (
    <div className="component-container">
      {!sessionId && (
        <Button onClick={startTest}>
          <FormattedMessage id="start-a-new-test" />
        </Button>
      )}
      {report && <ReportDisplay report={report} />}
      {sessionId && <TestView />}
    </div>
  )
}

export default TestIndex
