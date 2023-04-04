import React from 'react'
import { useIntl } from 'react-intl'
import { images } from 'Utilities/common'

const StreakToast = () => {
  const intl = useIntl()

  const streakDoneText = `${intl.formatMessage({
    id: 'streak_just_done',
  })}`

  return (
    <div className="flex">
      <img src={images.flame} alt="flame" width="30px" height="30px" />
      <div className="flex-col pl-nm">
        <span style={{ fontSize: '18px', fontWeight: 550 }}>{streakDoneText}</span>
      </div>
    </div>
  )
}

export default StreakToast
