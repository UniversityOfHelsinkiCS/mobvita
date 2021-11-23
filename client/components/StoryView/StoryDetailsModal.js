import React from 'react'
import { Modal } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
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
            <LinkButton to={`/stories/${story._id}/practice`} translationId="practice" />
            {!enableOnlyPractice && (
              <>
                <LinkButton
                  variant="primary"
                  to={`/flashcards/fillin/${story._id}/`}
                  translationId="Flashcards"
                />
                <LinkButton
                  variant="secondary"
                  to={`/stories/${story._id}/preview`}
                  translationId="preview"
                />
                <LinkButton
                  variant={story.percent_cov === 0 ? 'outline-secondary' : 'secondary'}
                  disabled={story.percent_cov === 0}
                  to={`/stories/${story._id}/review`}
                  translationId="review"
                />
                <LinkButton
                  variant="secondary"
                  to={`/stories/${story._id}/compete`}
                  translationId="compete"
                />
                <LinkButton
                  variant="secondary"
                  to={`/crossword/${story._id}`}
                  translationId="Crossword"
                />
              </>
            )}
          </div>

          {displayDivider && (
            <div style={{ width: '100%' }}>
              <hr />
            </div>
          )}

          <div className="flex wrap" style={{ gap: '5px' }}>
            {showCreateControlStoryButton && (
              <LinkButton
                to={`/stories/${story._id}/controlled-story-editor`}
                translationId="create-controlled-story"
                variant="secondary"
              />
            )}

            <LinkButton
              to={`/stories/${story._id}/preview-controlled-story`}
              translationId="preview-controlled-story"
              variant="secondary"
            />

            {showCancelControlStoryButton && (
              <>
                <LinkButton
                  to={`/stories/${story._id}/preview-controlled-story`}
                  translationId="preview-controlled-story"
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
            <CustomButton
              condition={showDeleteButton}
              onClick={handleDelete}
              variant="outline-danger"
              translationId="Delete"
            />
          </div>
        </div>
      </Modal.Actions>
    </Modal>
  )
}

export default StoryDetailsModal
