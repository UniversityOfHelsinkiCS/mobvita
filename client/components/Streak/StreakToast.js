import React from 'react'
import { useIntl } from 'react-intl'
import { useLocation } from 'react-router-dom'
import { images, capitalize } from 'Utilities/common'

const StreakToast = () => {
  const intl = useIntl()
  const location = useLocation()

  let practiceText = ''
  const practiceView = location.pathname.includes('practice')
  const flashcardView = location.pathname.includes('flashcard')

  if (practiceView) {
    practiceText = `${capitalize(
      intl.formatMessage({
        id: 'snippets-done' })
    )}`
  }
  if (flashcardView) {
    practiceText = `${capitalize(
      intl.formatMessage({
        id: 'flashcards-done' })
    )}`
  }

  const streakDoneText = `${intl.formatMessage({
    id: 'streak-just-done' })}`

  return (
    <div className="flex">
      <img src={images.flame} alt="flame" width="30px" height="30px" />
      <div className="flex-col pl-nm">
        <span style={{ fontSize: '11px', fontWeight: 550 }}>{practiceText}</span>
        <div>
          <b>
            {'  '}
            <span>{streakDoneText}</span>
          </b>
        </div>
      </div>
    </div>
  )
}

export default StreakToast
