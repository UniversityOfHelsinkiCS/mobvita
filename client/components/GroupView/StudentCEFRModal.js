import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { Table, Button } from 'react-bootstrap'
import { updateStudentCEFRLevels } from 'Utilities/redux/groupSummaryReducer'
import Draggable from 'react-draggable'
import { capitalize } from 'Utilities/common'
import moment from 'moment'
import CEFRDropdown from './CEFRDropdown'

const StudentCEFRModal = ({ open, setOpen, cefrHistory, groupId, sid }) => {
  const dispatch = useDispatch()
  const [updatedCEFRHistory, setUpdatedCEFRHistory] = useState(cefrHistory)
  const [modified, setModified] = useState(false)
  /*
  useEffect(() => {
    if (updatedCEFRHistory !== cefrHistory) {
      setModified(true)
    }
  }, [updatedCEFRHistory])
  */
  const closeModal = () => {
    setOpen(false)
  }

  const handleSubmit = () => {
    dispatch(updateStudentCEFRLevels(groupId, sid, updatedCEFRHistory))
    setModified(false)
  }

  const removeCEFR = removedIndex => {
    const newList = updatedCEFRHistory.filter((estimate, index) => index !== removedIndex)
    setUpdatedCEFRHistory(newList)
    setModified(true)
  }

  const undoChanges = () => {
    setUpdatedCEFRHistory(cefrHistory)
    setModified(false)
  }
  // console.log('UPDATED ', updatedCEFRHistory)

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
          <div
            className="flex space-between"
            style={{ marginBottom: '.25em', marginRight: '.25em', marginLeft: '.25em' }}
          >
            <Button variant="primary" onClick={handleSubmit}>Submit changes</Button>
            {modified && (
              <Button variant="secondary" onClick={undoChanges}>
                Undo changes
              </Button>
            )}
          </div>
          <Table striped bordered hover size="sm">
            <thead>
              <tr key="summary-header-row">
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Date</th>
                <th>Estimator</th>
                <th>Grade</th>
              </tr>
              {updatedCEFRHistory.map((estimate, index) => (
                <tr>
                  <th>{moment.unix(estimate.timestamp).format('MM/DD/YYYY')}</th>
                  <th>
                    {estimate.source === 'self_estimation' ? 'Self' : capitalize(estimate.source)}
                  </th>
                  <th>
                    {/* {skillLevels[estimate.grade]} */}
                    <CEFRDropdown
                      estimate={estimate}
                      index={index}
                      updatedCEFRHistory={updatedCEFRHistory}
                      setUpdatedCEFRHistory={setUpdatedCEFRHistory}
                      setModified={setModified}
                    />
                  </th>
                  <Icon
                    className="interactable"
                    style={{
                      cursor: 'pointer',
                      marginTop: '.6em',
                      marginLeft: '.25em',
                      color: 'red',
                    }}
                    size="large"
                    name="close"
                    onClick={() => removeCEFR(index)}
                  />
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
