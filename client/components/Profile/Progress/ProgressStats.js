import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import { getPersonalSummary, getPersonalOverallSummary } from 'Utilities/redux/groupSummaryReducer'
import { learningLanguageSelector, images, capitalize } from 'Utilities/common'
import Spinner from 'Components/Spinner'
import { useHistory } from 'react-router'

const ProgressStats = ({ startDate, endDate }) => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const { summary: progress_summary, profile_summary, pending } = useSelector(({ summary }) => summary)

  const dispatch = useDispatch()
  const intl = useIntl()
  const history = useHistory()
  var summary = progress_summary

  if (history.location.pathname.includes('main')) {
    summary = profile_summary
  }

  useEffect(() => {
    if (history.location.pathname.includes('main')) {
      dispatch(getPersonalOverallSummary(learningLanguage))
    } else {
      dispatch(getPersonalSummary(learningLanguage, startDate, endDate))
    }
  }, [startDate, endDate, learningLanguage])

  if (!summary || pending) return <Spinner fullHeight size={60} />

  const getLearningLanguageFlag = () => {
    if (learningLanguage) {
      return images[`flag${capitalize(learningLanguage.toLowerCase().split('-').join(''))}`]
    }
    return null
  }

  return (
    <div className="justify-center gap-col-nm pt-lg pb-lg">
      <img
        src={getLearningLanguageFlag()}
        alt="learning language flag"
        height="72px"
        style={{ border: '1px solid rgb(189, 202, 212)', borderRadius: '7px' }}
      />
      <div className="stat">
        <span>{intl.formatMessage({ id: 'completed-exercises' })}: </span>
        <span>{summary[0] && summary[0].number_of_exercises}</span>
      </div>
      <div className="stat">
        <span>{intl.formatMessage({ id: 'completed-snippets' })}: </span>
        <span>{summary[0] && summary[0].number_of_snippets}</span>
      </div>
    </div>
  )
}

export default ProgressStats
