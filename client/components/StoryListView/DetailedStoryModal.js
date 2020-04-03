import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Modal } from 'semantic-ui-react'
import { Table, ProgressBar } from 'react-bootstrap'
import { hiddenFeatures } from 'Utilities/common'

const DetailedStoryModal = ({ trigger, story, icons }) => {
  const { title, percent_cov: percentCovered, percent_perf: percentCorrect } = story
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
            <tr>
              <td>
                <FormattedMessage id="Level" />
              </td>
              <td>{difficultyIcon}</td>
            </tr>
            <tr>
              <td>
                <FormattedMessage id="story-rating" />
              </td>
              <td>{story.elo_score}</td>
            </tr>
            {false && (
              <tr>
                <td>
                  <FormattedMessage id="part-of-story-covered" />
                </td>
                <td>
                  <ProgressBar
                    striped
                    variant="info"
                    now={percentCovered === 0 ? 10 : percentCovered}
                    label={`${percentCovered}%`}
                  />
                </td>
              </tr>
            )}
            <tr>
              <td>
                <FormattedMessage id="exercises-answered-correctly" />
              </td>
              <td>
                <ProgressBar
                  striped
                  variant="success"
                  now={percentCorrect === 0 ? 10 : percentCorrect}
                  label={`${percentCorrect}%`}
                  className="table-progress-bar"
                />
              </td>
            </tr>
          </tbody>
        </Table>
      </Modal.Content>
    </Modal>
  )
}

export default DetailedStoryModal
