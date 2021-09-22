import React from 'react'
import { Modal } from 'semantic-ui-react'
import { CustomButton, LinkButton } from './Buttons'
import DetailsTable from './DetailsTable'

const DetailedStoryModal = ({
  trigger,
  story,
  setShareModalOpen,
  showShareButton,
  showDeleteButton,
  handleDelete,
  inGroupLibrary,
  currentGroup,
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

  const showLearningSettingsButton = inGroupLibrary && currentGroup && currentGroup.is_teaching

  const storyGroupSharingInfo = inGroupLibrary
    ? groupsSharedWith.find(g => g.group_id === currentGroup.group_id)
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
        <div className="space-between">
          <div className="gap-col-sm">
            {story.percent_cov === 0 && (
              <LinkButton
                variant="secondary"
                to={`/stories/${story._id}/read`}
                translationId="Read"
              />
            )}
            <LinkButton to={`/stories/${story._id}/practice`} translationId="practice" />
            {story.percent_cov > 0 && (
              <LinkButton
                variant="secondary"
                to={`/stories/${story._id}/review`}
                translationId="review"
              />
            )}
            <LinkButton
              variant="primary"
              to={`/flashcards/fillin/${story._id}/`}
              translationId="Flashcards"
            />
            <LinkButton variant="secondary" to={`/compete/${story._id}`} translationId="compete" />
            <LinkButton
              variant="secondary"
              to={`/crossword/${story._id}`}
              translationId="Crossword"
            />
          </div>
          <div className="gap-col-sm">
            {/* <LinkButton
              condition={showLearningSettingsButton}
              variant="outline-secondary"
              to={`/stories/${story._id}/concepts`}
              translationId="learning-settings"
            /> */}
            <CustomButton
              condition={showShareButton}
              onClick={() => setShareModalOpen(true)}
              variant="outline-secondary"
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

export default DetailedStoryModal
