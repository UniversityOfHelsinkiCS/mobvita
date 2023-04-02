import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { images } from 'Utilities/common'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'
import { getPracticeHistory } from 'Utilities/redux/practiceHistoryReducer'

const ProfileStreakInfo = () => {
  const dispatch = useDispatch()

  const { streakToday, daysStreaked } = useSelector(state => state.practiceHistory)
  const streakBroken = daysStreaked === 0 && !streakToday

  useEffect(() => {
    dispatch(getPracticeHistory())
  }, [])

  return (
    <div className="pt-md">
      <div className="flex" style={{ alignItems: 'center' }}>
        {streakToday ? (
          <img
            src={images.flame}
            alt="flame"
            style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
          />
        ) : (
          <img
            src={images.flameColorless}
            alt="colorless flame"
            style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
          />
        )}

        {streakBroken && (
          <div>
            <FormattedHTMLMessage id="streak-broken" values={{ daysStreaked }} />
            <br />
            <FormattedMessage id="start-streak" />
            &nbsp;
            <Link className="interactable" to="/library">
              <FormattedMessage id="do-snippets" />
            </Link>
            .
          </div>
        )}
        {streakToday && (
          <div>
            <FormattedHTMLMessage id="streak-done" values={{ daysStreaked }} />
          </div>
        )}
        {!streakBroken && !streakToday && (
          <div>
            <FormattedHTMLMessage id="streak-undone" values={{ daysStreaked }} />
            &nbsp;
            <Link className="interactable" to="/library">
              <FormattedMessage id="do-snippets" />
            </Link>
            !
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileStreakInfo
