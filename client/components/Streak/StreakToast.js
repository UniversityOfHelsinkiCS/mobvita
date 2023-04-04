import React from 'react'
import { useIntl } from 'react-intl'

const StreakToast = () => {
  const intl = useIntl()

  const streakText = `${intl.formatMessage({
    id: 'streak_just_done',
  })}`

  return (
    <div className="flex">
      <div className="flex-col pl-nm">
        <span style={{ fontSize: '11px', fontWeight: 550 }}>{streakText}</span>
      </div>
    </div>
  )
}

export default StreakToast
