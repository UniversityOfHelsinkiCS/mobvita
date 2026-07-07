import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { images } from 'Utilities/common'
import { FormattedMessage } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux'
import { getPracticeHistory } from 'Utilities/redux/practiceHistoryReducer'
import { Icon } from 'semantic-ui-react'
import CustomTooltip from 'Components/CustomTooltip'

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
        <br />
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
            <br />
            <FormattedHTMLMessage id="streak-broken" values={{ daysStreaked }} />
            &nbsp;
            <CustomTooltip
              title={
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
              placement="top"
              permanent
            >
              <span style={{ display: 'inline-flex' }}>
                <Icon name="info circle" size="small" color="grey" />
              </span>
            </CustomTooltip>
          </div>
        )}
        {streakToday === 'streaked' && (
          <div>
            <br />
            <FormattedHTMLMessage id="streak-done" values={{ daysStreaked }} />
          </div>
        )}
        {!streakBroken && streakToday === 'not_streaked' && (
          <div>
            <FormattedHTMLMessage id="streak-undone" values={{ daysStreaked }} />
            <CustomTooltip
              title={
                <>
                  <FormattedMessage id="continue-streak" />
                  :
                  <br />
                  <FormattedMessage id="do-snippets" />
                  &nbsp; / &nbsp;
                  <br />
                  <FormattedMessage id="do-flashcards" />
                </>
              }
              placement="top"
              permanent
            >
              <span style={{ display: 'inline-flex' }}>
                <Icon name="info circle" size="small" color="grey" />
              </span>
            </CustomTooltip>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileStreakInfo
