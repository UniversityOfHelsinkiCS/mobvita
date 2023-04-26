import React from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router'
import { images, capitalize } from 'Utilities/common'

const StreakToast = () => {
  const intl = useIntl()
  const history = useHistory()

  let practiceText = ''
  const practiceView = history.location.pathname.includes('practice')
  const flashcardView = history.location.pathname.includes('flashcard')

  if (practiceView) {
    practiceText = `${capitalize(
      intl.formatMessage({
        id: 'snippets-done',
      })
    )}`
  }
  if (flashcardView) {
    practiceText = `${capitalize(
      intl.formatMessage({
        id: 'flashcards-done',
      })
    )}`
  }

  const streakDoneText = `${intl.formatMessage({
    id: 'streak-just-done',
  })}`

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
