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
    author,
    difficulty,
    elo_score: elo,
    category,
    public: publicStory,
    date,
  } = story

  const showLearningSettingsButton = inGroupLibrary && currentGroup && currentGroup.is_teaching

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
          sharingInfo={sharingInfo}
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
            <LinkButton to={`/stories/${story._id}/practice`} translationId="practice" />
            <LinkButton
              variant="primary"
              to={`/flashcards/fillin/${story._id}/`}
              translationId="Flashcards"
            />
            <LinkButton
              variant="secondary"
              to={`/stories/${story._id}/read`}
              translationId="Read"
            />
            <LinkButton
              variant="secondary"
              to={`/crossword/${story._id}`}
              translationId="Crossword"
            />
          </div>
          <div className="gap-col-sm">
            <LinkButton
              condition={showLearningSettingsButton}
              variant="outline-secondary"
              to={`/stories/${story._id}/concepts`}
              translationId="learning-settings"
            />
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
