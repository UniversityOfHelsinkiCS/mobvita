import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { images, backgroundColors } from 'Utilities/common'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'
import { getPracticeHistory } from 'Utilities/redux/practiceHistoryReducer'

const StreakEncouragement = () => {
  const dispatch = useDispatch()

  const { streakToday, daysStreaked } = useSelector(state => state.practiceHistory)
  const streakBroken = daysStreaked === 0 && streakToday === 'not_streaked' ? true : false

  useEffect(() => {
    dispatch(getPracticeHistory())
  }, [])

  if (streakBroken) {
    return (
      <div>
        <div className="pt-md">
          <div
            className="flex enc-message-body"
            style={{ alignItems: 'center', backgroundColor: backgroundColors[3] }}
          >
            <img
              src={images.flameColorless}
              alt="colorless flame"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
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
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {streakToday === 'streaked' ? (
        <div className="pt-md">
          <div
            className="flex enc-message-body"
            style={{ alignItems: 'center', backgroundColor: backgroundColors[0] }}
          >
            <img
              src={images.flame}
              alt="flame"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
              <FormattedHTMLMessage id="streak-done" values={{ daysStreaked }} />
            </div>
          </div>
        </div>
      ) : (
        <div className="pt-md">
          <div
            className="flex enc-message-body"
            style={{ alignItems: 'center', backgroundColor: backgroundColors[3] }}
          >
            <img
              src={images.flameColorless}
              alt="colorless flame"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
              <FormattedHTMLMessage id="streak-undone" values={{ daysStreaked }} />
              <br />
              <FormattedMessage id="continue-streak" />
              &nbsp;
              <Link className="interactable" to="/library">
                <FormattedMessage id="do-snippets" />
              </Link>
              .
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StreakEncouragement
