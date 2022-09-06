import React from 'react'
import { Icon } from 'semantic-ui-react'
import { Table, Button } from 'react-bootstrap'
import Draggable from 'react-draggable'
import { skillLevels, capitalize } from 'Utilities/common'
import moment from 'moment'
import CEFRDropdown from './CEFRDropdown'

const StudentCEFRModal = ({ open, setOpen, cefrHistory }) => {
  const closeModal = () => {
    setOpen(false)
  }

  if (open) {
    return (
      <Draggable cancel=".interactable">
        <div className="draggable-modal">
          <div className="flex-reverse">
            <Icon
              className="interactable"
              style={{
                cursor: 'pointer',
                marginBottom: '.25em',
                marginLeft: '.25em',
                marginTop: '.25em',
              }}
              size="large"
              name="close"
              onClick={closeModal}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '.25em' }}>
            <Button variant="primary">Submit changes</Button>
          </div>
          <Table striped bordered hover responsive size="sm">
            <thead>
              <tr key="summary-header-row">
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Date</th>
                <th>Estimator</th>
                <th>Grade</th>
              </tr>
              {cefrHistory.map(estimate => (
                <tr>
                  <th>{moment.unix(estimate.timestamp).format('MM/DD/YYYY')}</th>
                  <th>
                    {estimate.source === 'self_estimation' ? 'Self' : capitalize(estimate.source)}
                  </th>
                  <th>
                    {/* {skillLevels[estimate.grade]} */}
                    <CEFRDropdown grade={estimate.grade} />
                  </th>
                </tr>
              ))}
            </thead>
          </Table>
        </div>
      </Draggable>
    )
  }

  return null
}

export default StudentCEFRModal
