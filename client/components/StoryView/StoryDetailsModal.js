import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Popup, Icon } from 'semantic-ui-react'
import AppButton from 'Components/AppButton'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { CustomButton, LinkButton } from './Buttons'
import { getStoryLoadingProgress } from 'Utilities/redux/storiesReducer'

const EMPTY_LOADING_PROGRESS = {}

const StoryDetailsModal = ({
  trigger,
  story,
  setShareModalOpen,
  showShareButton,
  showDeleteButton,
  showCreateControlStoryButton,
  showCancelControlStoryButton,
  handleDelete,
  inGroupLibrary,
  isTeacher,
  currentGroup,
  handleControlledStoryCancel,
  hidden,
  setSharedStoryVisibility,
  user,
  savedLibrarySelection,
}) => {
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const storyLoadingProgress = useSelector(
    ({ stories }) => stories.loadingProgress?.[story?._id] || EMPTY_LOADING_PROGRESS
  )
  const { title } = story

  const enableOnlyPractice = inGroupLibrary && !currentGroup?.is_teaching && story?.control_story

  const displayDivider =
    showCreateControlStoryButton ||
    showCancelControlStoryButton ||
    showShareButton ||
    showDeleteButton ||
    inGroupLibrary

  const hadQuestions = Boolean(story?.has_questions)
  const rawLoadingProgress = Number(storyLoadingProgress.progress)
  const loadingProgressValue = Number.isFinite(rawLoadingProgress) ? rawLoadingProgress : 0
  const hasProcessingSignal =
    storyLoadingProgress.progress !== undefined || storyLoadingProgress.exercise_ready !== undefined
  const loadingReady =
    storyLoadingProgress.exercise_ready === true ||
    (Number.isFinite(loadingProgressValue) && loadingProgressValue >= 1)
  const disableDeleteButton =
    Boolean(story?.uploadUnfinished) || (hasProcessingSignal && !loadingReady)

  useEffect(() => {
    if (!isModalOpen || !showDeleteButton || !story?._id) return

    const shouldPoll = Boolean(story?.uploadUnfinished) || hasProcessingSignal
    if (!shouldPoll) return

    dispatch(getStoryLoadingProgress(story._id))
    if (loadingReady) return

    const interval = setInterval(() => {
      dispatch(getStoryLoadingProgress(story._id))
    }, 2000)

    return () => clearInterval(interval)
  }, [
    dispatch,
    hasProcessingSignal,
    isModalOpen,
    loadingReady,
    showDeleteButton,
    story?._id,
    story?.uploadUnfinished,
  ])

  const deleteButton = (
    <CustomButton
      className="story-detail-modal-manage-button-delete"
      data-cy="story-detail-modal-delete-button"
      condition={showDeleteButton}
      onClick={handleDelete}
      disabled={disableDeleteButton}
      variant="outline-danger"
      translationId="Delete"
    />
  )

  return (
    <Modal
      trigger={trigger}
      onOpen={() => setIsModalOpen(true)}
      onClose={() => setIsModalOpen(false)}
      closeIcon={{ style: { top: '0.75em', right: '1rem' }, color: 'black', name: 'close' }}
      size="tiny"
    >
      <Modal.Header>
        <div className="pr-lg">{title}</div>
      </Modal.Header>
      <Modal.Actions>
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                {!isTeacher && !story.flashcardsOnly && (
                  <Link
                    to={`/stories/${story._id}/${story.percent_cov > 0 ? 'review' : 'preview'}`}
                  >
                    <AppButton
                      className="story-detail-modal-action-button library-tour-modal-practice-button"
                      variant={isTeacher && inGroupLibrary ? 'secondary' : 'primary'}
                    >
                      <FormattedMessage id="practice" />
                    </AppButton>
                  </Link>
                )}
                {!enableOnlyPractice && !isTeacher && (
                  <Popup
                    content={<FormattedMessage id="disabled-flashcard-btn-explanation" />}
                    trigger={
                      <Link to={`/flashcards/fillin/story/${story._id}/`}>
                        <AppButton
                          className="story-detail-modal-action-button"
                          variant="primary"
                          disabled={story.flashcard_count === 0}
                        >
                          <FormattedMessage id="Flashcards" />
                        </AppButton>
                      </Link>
                    }
                    disabled={story.flashcard_count > 0}
                    position="top center"
                  />
                )}
              </div>

              {!enableOnlyPractice && !isTeacher && hadQuestions && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '12px',
                  }}
                >
                  <LinkButton
                    className="story-detail-modal-action-button-long"
                    to={`/stories/${story._id}/reading_practice`}
                    translationId="reading-comprehension"
                    variant="primary"
                  />
                </div>
              )}
            </div>
            {!enableOnlyPractice && !story.flashcardsOnly && isTeacher && (
              <>
                {inGroupLibrary && (
                  <Link to={`/stories/${story._id}/group/preview`}>
                    <AppButton className="story-detail-modal-action-button" variant="primary">
                      <FormattedMessage id="preview" />
                    </AppButton>
                  </Link>
                )}
                {!inGroupLibrary && (
                  <Link to={`/stories/${story._id}/preview`}>
                    <AppButton className="story-detail-modal-action-button" variant="secondary">
                      <FormattedMessage id="preview" />
                    </AppButton>
                  </Link>
                )}
                {inGroupLibrary ? (
                  <Link to={`/stories/${story._id}/group/review`}>
                    <AppButton
                      className="story-detail-modal-action-button library-tour-modal-review-button"
                      variant="primary"
                    >
                      <FormattedMessage id="review" />
                    </AppButton>
                  </Link>
                ) : (
                  <Link to={`/stories/${story._id}/review`}>
                    <AppButton
                      className="story-detail-modal-action-button library-tour-modal-review-button"
                      variant={story.percent_cov === 0 ? 'outline-secondary' : 'secondary'}
                      disabled={story.percent_cov === 0}
                    >
                      <FormattedMessage id="review" />
                    </AppButton>
                  </Link>
                )}
              </>
            )}
          </div>
          {!isTeacher && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '12px',
                gap: '12px',
              }}
            >
              {!isTeacher && (
                <Link to={`/stories/${story._id}/compete`}>
                  <AppButton
                    className="story-detail-modal-action-button"
                    variant={isTeacher && inGroupLibrary ? 'outline-secondary' : 'secondary'}
                    disabled={enableOnlyPractice || (isTeacher && inGroupLibrary)}
                  >
                    <FormattedMessage id="compete" />
                  </AppButton>
                </Link>
              )}
              {!isTeacher && (
                <Link to={`/crossword/${story._id}`}>
                  <AppButton
                    className="story-detail-modal-action-button"
                    variant={isTeacher && inGroupLibrary ? 'outline-secondary' : 'secondary'}
                    disabled={enableOnlyPractice || (isTeacher && inGroupLibrary)}
                  >
                    <FormattedMessage id="Crossword" />
                  </AppButton>
                </Link>
              )}
            </div>
          )}
          {displayDivider && (
            <div style={{ width: '100%' }}>
              <hr />
            </div>
          )}

          <div className="flex flex-col space-between">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'stretch',
                gap: '12px',
                marginBottom: '12px',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(0, 0, 0, .1)',
                width: 'max-content',
              }}
            >
              {showCreateControlStoryButton && (
                <LinkButton                  
                  to={`/stories/${story._id}/controlled-story-editor`}
                  translationId="create-controlled-story"
                  variant="secondary"
                />
              )}

              {isTeacher && savedLibrarySelection == 'private' && (
                <LinkButton
                  to={`/stories/${story._id}/reading-comprehension-options`}
                  translationId="reading-comprehension"
                  variant="secondary"
                />
              )}

              {showCancelControlStoryButton && (                
                  <LinkButton
                    to={`/stories/${story._id}/controlled-story-editor`}
                    translationId="edit-controlled-story"
                    variant="secondary"
                  />                
              )}

              {showCancelControlStoryButton && (
                
                  <AppButton variant="secondary" onClick={handleControlledStoryCancel}>
                    <FormattedMessage id="cancel-controlled-story" />
                  </AppButton>
                
              )}
            </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', gap: '12px' }}>
                <CustomButton
                  className="story-detail-modal-manage-button"
                  condition={showShareButton}
                  onClick={() => setShareModalOpen(true)}
                  variant="secondary"
                  translationId="Share"
                />
                {story.user === user.oid && (
                  <Link to={`/stories/${story._id}/edit`}>
                    <AppButton className="story-detail-modal-manage-button" variant="secondary">
                      <Icon name="edit" /> <FormattedMessage id="edit-story" />
                    </AppButton>
                  </Link>
                )}
                {inGroupLibrary && isTeacher && (
                  <CustomButton
                    className="story-detail-modal-manage-button-release-hide"
                    onClick={() => setSharedStoryVisibility(story._id, hidden === true)}
                    variant="secondary"
                    translationId={(hidden && 'release-story') || 'hide-story'}
                  />
                )}
              </div>
              <div>
                {disableDeleteButton ? (
                  <Popup
                    content={<FormattedMessage id="story-detail-modal-disabled-delete-btn" />}
                    position="top center"
                    trigger={<span style={{ display: 'inline-block' }}>{deleteButton}</span>}
                  />
                ) : (
                  deleteButton
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal.Actions>
    </Modal>
  )
}

export default StoryDetailsModal
