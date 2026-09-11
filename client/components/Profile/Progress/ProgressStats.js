import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import { getPersonalSummary, getPersonalOverallSummary } from 'Utilities/redux/groupSummaryReducer'
import { learningLanguageSelector, images, capitalize } from 'Utilities/common'
import Spinner from 'Components/Spinner'
import { colors } from 'Assets/mui_theme/designTokens'
import { useLocation } from 'react-router-dom'

const ProgressStats = ({ startDate, endDate }) => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const { summary: progress_summary, profile_summary, pending } = useSelector(({ summary }) => summary)

  const dispatch = useDispatch()
  const intl = useIntl()
  const location = useLocation()

  var summary = progress_summary

  if (location.pathname.includes('main')) {
    summary = profile_summary
  }

  useEffect(() => {
    if (location.pathname.includes('main')) {
      dispatch(getPersonalOverallSummary(learningLanguage))
    } else {
      dispatch(getPersonalSummary(learningLanguage, startDate, endDate))
    }
  }, [startDate, endDate, learningLanguage])

  if (!summary || pending) return <Spinner fullHeight spinnerColor={colors.ink} size={60} />

  const getLearningLanguageFlag = () => {
    if (learningLanguage) {
      return images[`flag${capitalize(learningLanguage.toLowerCase().split('-').join(''))}`]
    }
    return null
  }

  return (
    <div className="progress-stats">
      <img
        className="progress-stats-flag"
        src={getLearningLanguageFlag()}
        alt="learning language flag"
      />
      {[
        { labelId: 'completed-exercises', value: summary[0]?.number_of_exercises },
        { labelId: 'completed-snippets', value: summary[0]?.number_of_snippets },
      ].map(({ labelId, value }) => (
        <div key={labelId} className="progress-stat">
          <span className="progress-stat-value">{value}</span>
          <span className="progress-stat-label">{intl.formatMessage({ id: labelId })}</span>
        </div>
      ))}
    </div>
  )
}

export default ProgressStats
