import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Modal } from 'semantic-ui-react'
import { Table, ProgressBar, Button } from 'react-bootstrap'

const CustomButton = ({ condition = true, translationId, ...props }) => {
  if (!condition) return null

  return (
    <Button {...props}>
      <FormattedMessage id={translationId} />
    </Button>
  )
}

const LinkButton = ({ ...props }) => (
  <CustomButton as={Link} {...props} />
)

const Row = ({ translationId, children }) => (
  <tr>
    <td>
      <FormattedMessage id={translationId} />
    </td>
    <td>
      {children}
    </td>
  </tr>
)

const DetailedStoryModal = (
  {
    trigger,
    story,
    icons,
    setShareModalOpen,
    showShareButton,
    showDeleteButton,
    handleDelete,
    inGroupLibrary,
    currentGroup,
  },
) => {
  const { groups } = useSelector(({ groups }) => groups)

  const {
    title,
    percent_cov: percentCovered,
    percent_perf: percentCorrect,
    URL,
    message,
    author,
  } = story

  const difficultyIcon = icons()[story.difficulty || 'default']

  const showLearningSettingsButton = inGroupLibrary
    && currentGroup.is_teaching

  return (
    <Modal
      trigger={trigger}
      closeIcon={{ style: { top: '0.75em', right: '1rem' }, color: 'black', name: 'close' }}
    >
      <Modal.Header>
        <div className="padding-right-3">
          {title}
        </div>
      </Modal.Header>
      <Modal.Content>
        <Table striped>
          <colgroup>
            <col width="50%" />
            <col width="50%" />
          </colgroup>
          <tbody>
            {URL && (
              <Row translationId="Source">
                <a href={URL} target="_blank" rel="noopener noreferrer">{URL}</a>
              </Row>
            )}
            {author && (
              <Row translationId="Author">
                {author}
              </Row>
            )}
            <Row translationId="Level">
              {difficultyIcon}
            </Row>
            <Row translationId="story-rating">
              {story.elo_score}
            </Row>
            {message && (
              <Row translationId="Message">
                {message}
              </Row>
            )}
            <Row translationId="part-of-story-covered">
              <ProgressBar
                striped
                variant="info"
                now={percentCovered < 10 ? 10 : percentCovered}
                label={`${percentCovered}%`}
                className="table-progress-bar"
              />
            </Row>
            <Row translationId="exercises-answered-correctly">
              <ProgressBar
                striped
                variant="success"
                now={percentCorrect < 10 ? 10 : percentCorrect}
                label={`${percentCorrect}%`}
                className="table-progress-bar"
              />
            </Row>
          </tbody>
        </Table>
      </Modal.Content>
      <Modal.Actions>
        <div className="space-between">
          <div className="gap-1">
            <LinkButton to={`/stories/${story._id}/practice`} translationId="practice" />
            <LinkButton variant="secondary" to={`/stories/${story._id}/`} translationId="Read" />
            <LinkButton
              variant="secondary"
              to={`/flashcards/${story._id}/`}
              translationId="Flashcards"
            />
          </div>
          <div className="gap-1">
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
