import React from 'react'
import { Modal } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { images } from 'Utilities/common'
import { clearNewVocabulary } from 'Utilities/redux/newVocabularyReducer'
import { useSelector, useDispatch } from 'react-redux'

const ExercisesEncouragementModal = ({ open, setOpen, storiesCovered, vocabularySeen }) => {
  const { newVocabulary } = useSelector(({ newVocabulary }) => newVocabulary)
  const intl = useIntl()
  const dispatch = useDispatch()
  const notFirst = storiesCovered > 1

  const reviewProgress = () => {
    return (
      <Link to="/profile/progress">
        <FormattedMessage id="review-progress" />
      </Link>
    )
  }

  const flashcards = () => {
    return (
      <Link to="/flashcards">
        <FormattedMessage id="flashcards-review" />
      </Link>
    )
  }

  const closeModal = () => {
    setOpen(false)
    dispatch(clearNewVocabulary())
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
              <div className="bold pt-sm" style={{ color: '#000000' }}>
                {intl.formatMessage(
                  { id: 'stories-covered-encouragement' },
                  { stories: storiesCovered }
                )}
              </div>
              <div className="bold pt-sm" style={{ color: '#000000' }}>
                {intl.formatMessage(
                  { id: 'words-seen-encouragement' },
                  { vocabulary_seen: vocabularySeen, flashcards: flashcards() }
                )}
              </div>
              {newVocabulary > 0 && (
                <div className="bold pt-sm" style={{ color: '#000000' }}>
                  {intl.formatMessage(
                    { id: 'words-interacted-encouragement' },
                    { nWords: newVocabulary, reviewProgress: reviewProgress() }
                  )}
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
          <div className="encouragement-picture">
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
