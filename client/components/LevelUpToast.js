import React from 'react'
import { useIntl } from 'react-intl'
import { images } from 'Utilities/common'
import { useSelector } from 'react-redux'

const LevelUpToast = () => {
  const intl = useIntl()
  const { level } = useSelector(({ user }) => user.data.user)
  const levelUpHeader = `${intl.formatMessage({
    id: 'just-leveled-up',
  })}`
  const levelUpText = `${intl.formatMessage({
    id: 'new-level',
  })}`

  return (
    <div className="flex">
      <img src={images.greenArrow} alt="green arrow" width="30px" height="30px" />
      <div className="flex-col pl-nm">
        <span style={{ fontSize: '11px', fontWeight: 550 }}>{levelUpHeader}</span>
        <div>
          <span>{levelUpText}</span> <b>{level}</b>
          {'!'}
        </div>
      </div>
    </div>
  )
}

export default LevelUpToast
