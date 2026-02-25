import React from 'react'
import { Modal, Popup, Icon } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { CustomButton, LinkButton } from './Buttons'
import DetailsTable from './DetailsTable'
import { hiddenFeatures } from 'Utilities/common'

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
  const {
    title,
    percent_cov: percentCovered,
    percent_perf: percentCorrect,
    URL,
    sharing_info: sharingInfo,
    groups: groupsSharedWith,
    author,
    difficulty,
    elo_score: elo,
    category,
    public: publicStory,
    date,
  } = story

  const enableOnlyPractice = inGroupLibrary && !currentGroup?.is_teaching && story?.control_story

  const displayDivider =
    showCreateControlStoryButton ||
    showCancelControlStoryButton ||
    showShareButton ||
    showDeleteButton ||
    inGroupLibrary

  const storyGroupSharingInfo = inGroupLibrary
    ? groupsSharedWith.find(g => g?.group_id === currentGroup?.group_id)
    : null

  return (
    <Modal
      trigger={trigger}
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
              gap: '10px',
            }}
          >
            {!isTeacher && !story.flashcardsOnly && (
              <Link to={`/stories/${story._id}/preview`}>
                <Button
                  className="story-detail-modal-action-button"
                  variant={isTeacher && inGroupLibrary ? 'secondary' : 'primary'}
                >
                  <FormattedMessage id="practice" />
                </Button>
              </Link>
            )}
            {!enableOnlyPractice && (
              <>
                {!isTeacher && (
                  <Popup
                    content={<FormattedMessage id="disabled-flashcard-btn-explanation" />}
                    trigger={
                      <Link to={`/flashcards/fillin/story/${story._id}/`}>
                        <Button
                          className="story-detail-modal-action-button"
                          variant="primary"
                          disabled={enableOnlyPractice || story.flashcard_count === 0}
                        >
                          <FormattedMessage id="Flashcards" />
                        </Button>
                      </Link>
                    }
                    disabled={story.flashcard_count > 0}
                    position="top center"
                  />
                )}
                {!story.flashcardsOnly && (
                  <>
                    {isTeacher && inGroupLibrary && (
                      <Link to={`/stories/${story._id}/group/preview`}>
                        <Button
                          className="story-detail-modal-action-button"
                          variant="primary"
                        >
                          <FormattedMessage id="preview" />
                        </Button>
                      </Link>
                    )}
                    {isTeacher && !inGroupLibrary && (
                      <Link to={`/stories/${story._id}/preview`}>
                        <Button
                        className="story-detail-modal-action-button"
                        variant="secondary"
                        >
                          <FormattedMessage id="preview" />
                        </Button>
                      </Link>
                    )}
                    {isTeacher && inGroupLibrary ? (
                      <Link to={`/stories/${story._id}/group/review`}>
                        <Button className="story-detail-modal-action-button" variant="primary">
                          <FormattedMessage id="review" />
                        </Button>
                      </Link>
                    ) : (
                      <Link to={`/stories/${story._id}/review`}>
                        <Button
                          className="story-detail-modal-action-button"
                          variant={story.percent_cov === 0 ? 'outline-secondary' : 'secondary'}
                          disabled={story.percent_cov === 0}
                        >
                          <FormattedMessage id="review" />
                        </Button>
                      </Link>
                    )}
                  </>
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
                marginTop: '15px',
                gap: '10px',
              }}
            >
              {!isTeacher && (
                <Link to={`/stories/${story._id}/compete`}>
                  <Button
                    className="story-detail-modal-action-button"
                    variant={isTeacher && inGroupLibrary ? 'outline-secondary' : 'secondary'}
                    disabled={enableOnlyPractice || (isTeacher && inGroupLibrary)}
                  >
                    <FormattedMessage id="compete" />
                  </Button>
                </Link>
              )}
              {!isTeacher && (
                <Link to={`/crossword/${story._id}`}>
                  <Button
                    className="story-detail-modal-action-button"
                    variant={isTeacher && inGroupLibrary ? 'outline-secondary' : 'secondary'}
                    disabled={enableOnlyPractice || (isTeacher && inGroupLibrary)}
                  >
                    <FormattedMessage id="Crossword" />
                  </Button>
                </Link>
              )}
            </div>
          )}
          {displayDivider && (
            <div style={{ width: '100%' }}>
              <hr />
            </div>
          )}

          <div className="flex space-between" style={{ marginTop: '5px' }}>
            <div className="flex wrap" style={{ gap: '10px' }}>
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
                <>
                  <LinkButton
                    to={`/stories/${story._id}/controlled-story-editor`}
                    translationId="edit-controlled-story"
                    variant="secondary"
                  />
                  <Button variant="secondary" onClick={handleControlledStoryCancel}>
                    <FormattedMessage id="cancel-controlled-story" />
                  </Button>
                </>
              )}
              <CustomButton
                condition={showShareButton}
                onClick={() => setShareModalOpen(true)}
                variant="secondary"
                translationId="Share"
              />
              {story.user === user.oid && (
                <Link to={`/stories/${story._id}/edit`}>
                  <Button variant="secondary">
                    <Icon name="edit" /> <FormattedMessage id="edit-story" />
                  </Button>
                </Link>
              )}
              {inGroupLibrary && isTeacher && (
                <CustomButton
                  onClick={() => setSharedStoryVisibility(story._id, hidden === true)}
                  variant="secondary"
                  translationId={(hidden && 'release-story') || 'hide-story'}
                />
              )}
            </div>
            <div>
              <CustomButton
                condition={showDeleteButton}
                onClick={handleDelete}
                variant="outline-danger"
                translationId="Delete"
              />
            </div>
          </div>
        </div>
      </Modal.Actions>
    </Modal>
  )
}

export default StoryDetailsModal
