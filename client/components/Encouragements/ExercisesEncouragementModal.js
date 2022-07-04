import React, { useState, useEffect } from 'react'
import { Modal } from 'semantic-ui-react'
import { FormattedHTMLMessage, FormattedMessage, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { images } from 'Utilities/common'
import { clearNewVocabulary } from 'Utilities/redux/newVocabularyReducer'
import { getLeaderboards } from 'Utilities/redux/leaderboardReducer'
import { useSelector, useDispatch } from 'react-redux'

const ExercisesEncouragementModal = ({
  open,
  setOpen,
  setOpenRecmd,
  enable_recmd,
  storiesCovered,
  vocabularySeen,
}) => {
  const { newVocabulary } = useSelector(({ newVocabulary }) => newVocabulary)
  const { user_rank } = useSelector(({ leaderboard }) => leaderboard.data)
  const [userRanking, setUserRanking] = useState(null)
  const intl = useIntl()
  const dispatch = useDispatch()
  const notFirst = storiesCovered > 1

  useEffect(() => {
    dispatch(getLeaderboards())
  }, [])

  useEffect(() => {
    if (user_rank < 100) {
      setUserRanking(user_rank + 1)
    }
  }, [user_rank])

  const closeModal = () => {
    setOpen(false)
    if (enable_recmd) {
      setOpenRecmd(true)
    } else {
      dispatch(clearNewVocabulary())
    }
  }

  return (
    <Modal
      basic
      open={open}
      size="small"
      centered={false}
      dimmer="blurring"
      closeIcon={{ style: { top: '2.5rem', right: '2.5rem' }, color: 'black', name: 'close' }}
      onClose={closeModal}
    >
      <Modal.Content>
        <div className="encouragement" style={{ padding: '1.5rem' }}>
          {notFirst ? (
            <div>
              <div
                className="header-4"
                style={{
                  marginBottom: '1rem',
                  fontWeight: 500,
                  color: '#000000',
                }}
              >
                <FormattedMessage id="story-completed-encouragement" />
              </div>
              {userRanking && (
                <div className="pt-lg" style={{ color: '#000000' }}>
                  <div>
                    <FormattedHTMLMessage
                      id="leaderboard-ranking-encouragement"
                      values={{ userRanking }}
                    />
                    &nbsp;
                    <Link to="/leaderboard">
                      <FormattedMessage id="leaderboard-link-encouragement" />
                    </Link>
                    !
                  </div>
                  <div>
                    <FormattedMessage id="practice-makes-perfect" />
                  </div>
                </div>
              )}
              <div className="pt-lg" style={{ color: '#000000' }}>
                {intl.formatMessage(
                  { id: 'stories-covered-encouragement' },
                  { stories: storiesCovered }
                )}
              </div>
              <div className="pt-lg" style={{ color: '#000000' }}>
                <FormattedHTMLMessage
                  id="words-seen-encouragement"
                  values={{ vocabulary_seen: vocabularySeen }}
                />
                &nbsp;
                <Link to="/flashcards">
                  <FormattedMessage id="flashcards-review" />
                </Link>
                ?
              </div>
              {newVocabulary > 0 && (
                <div className="pt-lg" style={{ color: '#000000' }}>
                  <FormattedHTMLMessage
                    id="words-interacted-encouragement"
                    values={{ nWords: newVocabulary }}
                  />
                  &nbsp;
                  <Link to="/profile/progress">
                    <FormattedMessage id="review-progress" />
                  </Link>
                  ?
                </div>
              )}
            </div>
          ) : (
            <div
              className="header-4"
              style={{
                marginBottom: '1.5rem',
                fontWeight: 500,
                color: '#000000',
              }}
            >
              <FormattedMessage id="first-story-covered-encouragement" />
            </div>
          )}
          <div className="encouragement-picture pt-sm">
            <img
              src={images.fireworks}
              alt="encouraging fireworks"
              style={{ maxWidth: '25%', maxHeight: '25%' }}
            />
          </div>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default ExercisesEncouragementModal
