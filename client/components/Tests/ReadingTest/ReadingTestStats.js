import React from 'react'
import AppButton from 'Components/AppButton'
import { useNavigate } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Paper } from '@mui/material'
import { useSelector } from 'react-redux'

const ReadingTestStats = ({ restartTest }) => {
  const navigate = useNavigate()

  const {
    readingHistory: {
      total_num_question: totalQuestions,
      first_time_answer_correct_rate: firstAttemptCorrectRate,
      overall_correct_rate: overallCorrectRate
    }
  } = useSelector(({ tests }) => tests)

  const goToHomePage = () => {
    navigate('/home')
  }

  return (
    <Paper sx={{ padding: '1em', borderRadius: '20px' }}>
      <div className="align-center justify-center">
        <div className="test-container" style={{ width: '90%' }}>
          <h2><FormattedMessage id="test-completed" /></h2>
          <div className="test-stats" data-cy="reading-test-stats">
            <p><FormattedMessage id="ddlang-total-questions" />: {totalQuestions}</p>
            <p><FormattedMessage id="first-attempt-correct-rate" />: {firstAttemptCorrectRate?.toFixed(2)}%</p>
            <p><FormattedMessage id="overall-correct-rate" />: {overallCorrectRate?.toFixed(2)}%</p>
          </div>

          <AppButton
            data-cy="reading-test-stats-restart-button"
            onClick={restartTest}
            style={{ marginTop: '20px', marginBot: '3em' }}
          >
            <FormattedMessage id="restart-reading-test" />
          </AppButton>
          <AppButton
            data-cy="reading-test-stats-home-button"
            onClick={goToHomePage}
            style={{ marginTop: '20px', marginBot: '3em' }}
          >
            <FormattedMessage id="go-to-home" />
          </AppButton>
        </div>
      </div>
    </Paper>
  )
}

export default ReadingTestStats
