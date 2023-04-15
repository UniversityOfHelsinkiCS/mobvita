import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { images } from 'Utilities/common'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'
import { getPracticeHistory } from 'Utilities/redux/practiceHistoryReducer'
import { Icon, Popup } from 'semantic-ui-react'

const ProfileStreakInfo = () => {
  const dispatch = useDispatch()
  const { streakToday, daysStreaked } = useSelector(state => state.practiceHistory)
  const streakBroken = daysStreaked === 0 && streakToday === 'not_streaked'

  useEffect(() => {
    dispatch(getPracticeHistory())
  }, [])

  return (
    <div className="pt-md">
      <div className="flex" style={{ alignItems: 'center' }}>
        {streakToday === 'streaked' ? (
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
            &nbsp;
            <Popup
              content={
                <>
                  <FormattedMessage id="start-streak" />
                  :
                  <br />
                  <FormattedMessage id="do-snippets" />
                  &nbsp; / &nbsp;
                  <br />
                  <FormattedMessage id="do-flashcards" />
                </>
              }
              trigger={<Icon name="info circle" size="small" color="grey" />}
              position="top center"
            />
          </div>
        )}
        {streakToday === 'streaked' && (
          <div>
            <FormattedHTMLMessage id="streak-done" values={{ daysStreaked }} />
          </div>
        )}
        {!streakBroken && streakToday === 'not_streaked' && (
          <div>
            <FormattedHTMLMessage id="streak-undone" values={{ daysStreaked }} />
            <br />
            <FormattedMessage id="continue-streak" />
            &nbsp;
            <Popup
              content={
                <Link className="interactable" to="/library">
                  <FormattedMessage id="do-snippets" />
                </Link>
              }
              trigger={<Icon name="info circle" size="small" color="grey" />}
              on="click"
              position="top center"
            />
            !
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileStreakInfo
