import React from 'react'
import { Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Segment } from 'semantic-ui-react'

const ReadingTestStats = ({ 
  correctFirstAttempt, 
  firstAttemptCorrectRate, 
  overallCorrectRate, 
  avgHintsUsed, 
  totalQuestions, 
  timeSpent 
}) => {
  const history = useHistory()

  const goToHomePage = () => {
    history.push('/home')
  }

  return (
    <Segment style={{ borderRadius: '20px' }}>
      <div className="align-center justify-center">
        <div className="test-container" style={{ width: '90%' }}>
          <h2><FormattedMessage id="test-completed" /></h2>
          <div className="test-stats">
            <p><FormattedMessage id="total-questions" />: {totalQuestions}</p>
            {/* <p><FormattedMessage id="correct-first-attempts" />: {correctFirstAttempt}</p> */}
            <p><FormattedMessage id="first-attempt-correct-rate" />: {firstAttemptCorrectRate.toFixed(2)}%</p>
            <p><FormattedMessage id="overall-correct-rate" />: {overallCorrectRate.toFixed(2)}%</p>
            <p><FormattedMessage id="average-hints-used" />: {avgHintsUsed.toFixed(2)}</p>
            <p><FormattedMessage id="time-spent" />: {timeSpent} <FormattedMessage id="minutes" /></p>
          </div>
          <Button onClick={goToHomePage} style={{ marginTop: '20px', marginBot: '3em' }}>
            <FormattedMessage id="go-to-home" />
          </Button>
        </div>
      </div>
    </Segment>
  )
}

export default ReadingTestStats
