import React from 'react'
import { Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Segment } from 'semantic-ui-react'
import { useSelector } from 'react-redux'

const ReadingTestStats = ({ restartTest }) => {
  const history = useHistory()

  const {
    readingHistory: {
      total_num_question: totalQuestions,
      first_time_answer_correct_rate: firstAttemptCorrectRate,
      overall_correct_rate: overallCorrectRate
    }
  } = useSelector(({ tests }) => tests)

  const goToHomePage = () => {
    history.push('/home')
  }

  return (
    <Segment style={{ borderRadius: '20px' }}>
      <div className="align-center justify-center">
        <div className="test-container" style={{ width: '90%' }}>
          <h2><FormattedMessage id="test-completed" /></h2>
          <div className="test-stats">
            <p><FormattedMessage id="ddlang-total-questions" />: {totalQuestions}</p>
            <p><FormattedMessage id="first-attempt-correct-rate" />: {firstAttemptCorrectRate?.toFixed(2)}%</p>
            <p><FormattedMessage id="overall-correct-rate" />: {overallCorrectRate?.toFixed(2)}%</p>
          </div>
          
          <Button onClick={restartTest} style={{ marginTop: '20px', marginBot: '3em' }}>
            <FormattedMessage id="restart-reading-test" />
          </Button>
          <Button onClick={goToHomePage} style={{ marginTop: '20px', marginBot: '3em' }}>
            <FormattedMessage id="go-to-home" />
          </Button>
        </div>
      </div>
    </Segment>
  )
}

export default ReadingTestStats
