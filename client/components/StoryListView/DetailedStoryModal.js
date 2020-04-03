import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Modal } from 'semantic-ui-react'
import { Table } from 'react-bootstrap'
import { hiddenFeatures } from 'Utilities/common'

const DetailedStoryModal = ({ trigger, story, icons }) => {
  const { title } = story

  if (!hiddenFeatures) return null

  const difficultyIcon = icons()[story.difficulty || 'default']

  return (
    <Modal trigger={trigger}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content>
        <Table>
          <tbody>
            <tr>
              <td>
                <FormattedMessage id="Level" />
              </td>
              <td>{difficultyIcon}</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Content>
    </Modal>
  )
}

export default DetailedStoryModal
