import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Modal } from 'semantic-ui-react'
import { Table, ProgressBar } from 'react-bootstrap'
import { hiddenFeatures } from 'Utilities/common'

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

const DetailedStoryModal = ({ trigger, story, icons }) => {
  const {
    title,
    percent_cov: percentCovered,
    percent_perf: percentCorrect,
    URL,
    message,
    author,
  } = story
  console.log(story)

  if (!hiddenFeatures) return null

  const difficultyIcon = icons()[story.difficulty || 'default']

  return (
    <Modal trigger={trigger}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content>
        <Table striped>
          <col width="50%" />
          <col width="50%" />
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
            {false && (
              <Row translationId="part-of-story-covered">
                <ProgressBar
                  striped
                  variant="info"
                  now={percentCovered === 0 ? 10 : percentCovered}
                  label={`${percentCovered}%`}
                />
              </Row>
            )}
            <Row translationId="exercises-answered-correctly">
              <ProgressBar
                striped
                variant="success"
                now={percentCorrect === 0 ? 10 : percentCorrect}
                label={`${percentCorrect}%`}
                className="table-progress-bar"
              />
            </Row>
          </tbody>
        </Table>
      </Modal.Content>
    </Modal>
  )
}

export default DetailedStoryModal
