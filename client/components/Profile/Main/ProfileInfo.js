import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getPracticeHistory } from 'Utilities/redux/practiceHistoryReducer'
import { images } from 'Utilities/common'
import { FormattedMessage } from 'react-intl'
import StreakEncouragement from '../../NewEncouragements/SubComponents/StreakEncouragement'

const UsernameHeader = () => {
  const { username } = useSelector(({ user }) => user.data.user)
  return (
    <>
      <div className="sm-label">
        <FormattedMessage id="username" />
      </div>
      <span className="account-info-item">
        {username}
      </span>
    </>
  )
}

const StreakIndicator = () => {
  const practiceHistory = useSelector(state => state.practiceHistory)
  const { daysStreaked, streakToday } = practiceHistory
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getPracticeHistory())
  }, [])

  const flameIcon = 
  streakToday
    ? <p>  </p>
    : <img src={images.flame} alt="flame" width="26px" style={{ marginRight: '0.2em' }} />

  return (
    <span className="account-info-item">
      <span>{flameIcon}</span>
      <span>{daysStreaked}</span>
    </span>
  )
}

const ProfileInfo = () => {

  return (
    <div>
      <UsernameHeader />
    </div>
  )
}

export default ProfileInfo