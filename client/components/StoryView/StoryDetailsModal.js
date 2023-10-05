import React from 'react'
import { Modal } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { CustomButton, LinkButton } from './Buttons'
import DetailsTable from './DetailsTable'

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
    showDeleteButton

  const storyGroupSharingInfo = inGroupLibrary
    ? groupsSharedWith.find(g => g?.group_id === currentGroup?.group_id)
    : null

  return (
    <Modal
      trigger={trigger}
      closeIcon={{ style: { top: '0.75em', right: '1rem' }, color: 'black', name: 'close' }}
    >
      <Modal.Header>
        <div className="pr-lg">{title}</div>
      </Modal.Header>
      <Modal.Content>
        <DetailsTable
          author={author}
          difficulty={difficulty}
          elo={elo}
          sharingInfo={inGroupLibrary ? storyGroupSharingInfo : sharingInfo}
          percentCovered={percentCovered}
          percentCorrect={percentCorrect}
          URL={URL}
          category={category}
          publicStory={publicStory}
          date={date}
        />
      </Modal.Content>
      <Modal.Actions>
        <div>
          <div className="flex wrap" style={{ gap: '5px' }}>
            {!isTeacher && (<LinkButton
              variant={isTeacher && inGroupLibrary ? 'secondary' : 'primary'}
              to={`/stories/${story._id}/preview`}
              translationId="practice"
            />)}
            {!enableOnlyPractice && (
              <>
                {!isTeacher && (<LinkButton
                  variant={isTeacher && inGroupLibrary ? 'secondary' : 'primary'}
                  to={`/flashcards/fillin/${story._id}/`}
                  translationId="Flashcards"
                />)}
                {isTeacher && inGroupLibrary ? (
                  <LinkButton
                    variant="primary"
                    to={`/stories/${story._id}/group/preview`}
                    translationId="preview"
                  />
                ) : (
                  <LinkButton
                    variant="secondary"
                    to={`/stories/${story._id}/preview`}
                    translationId="preview"
                  />
                )}
                {isTeacher && inGroupLibrary ? (
                  <Link to={`/stories/${story._id}/group/review`}>
                    <Button variant="primary">
                      <FormattedMessage id="review" />
                    </Button>
                  </Link>
                ) : (
                  <Link to={`/stories/${story._id}/review`}>
                    <Button
                      variant={story.percent_cov === 0 ? 'outline-secondary' : 'secondary'}
                      disabled={story.percent_cov === 0}
                    >
                      <FormattedMessage id="review" />
                    </Button>
                  </Link>
                )}
                {!isTeacher && (<Link to={`/stories/${story._id}/compete`}>
                  <Button
                    variant={isTeacher && inGroupLibrary ? 'outline-secondary' : 'secondary'}
                    disabled={enableOnlyPractice || (isTeacher && inGroupLibrary)}
                  >
                    <FormattedMessage id="compete" />
                  </Button>
                </Link>)}
                {!isTeacher && (<Link to={`/crossword/${story._id}`}>
                  <Button
                    variant={isTeacher && inGroupLibrary ? 'outline-secondary' : 'secondary'}
                    disabled={enableOnlyPractice || (isTeacher && inGroupLibrary)}
                  >
                    <FormattedMessage id="Crossword" />
                  </Button>
                </Link>)}
              </>
            )}
          </div>

          {displayDivider && (
            <div style={{ width: '100%' }}>
              <hr />
            </div>
          )}

          <div className="flex space-between">
            <div className="flex wrap" style={{ gap: '5px' }}>
              {showCreateControlStoryButton && (
                <LinkButton
                  to={`/stories/${story._id}/controlled-story-editor`}
                  translationId="create-controlled-story"
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
