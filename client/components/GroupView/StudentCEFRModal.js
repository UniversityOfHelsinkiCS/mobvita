import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { Table, Button } from 'react-bootstrap'
import { updateStudentCEFRLevels } from 'Utilities/redux/groupSummaryReducer'
import Draggable from 'react-draggable'
import { capitalize, isToday } from 'Utilities/common'
import moment from 'moment'
import CEFRDropdown from './CEFRDropdown'

const StudentCEFRModal = ({ open, setOpen, cefrHistory, groupId, sid }) => {
  const dispatch = useDispatch()
  const [updatedCEFRHistory, setUpdatedCEFRHistory] = useState(cefrHistory)
  const [modified, setModified] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const includesToday = updatedCEFRHistory.find(estimate =>
      isToday(moment.unix(estimate.timestamp).toDate())
    )

    if (includesToday) {
      setShowForm(false)
    } else {
      setShowForm(true)
    }
  }, [updatedCEFRHistory])

  // console.log('upd ', updatedCEFRHistory)

  const closeModal = () => {
    setOpen(false)
  }

  const handleSubmit = () => {
    const withoutAdaptiveTests = updatedCEFRHistory.filter(
      estimate => estimate.source !== 'adaptive_test'
    )
    dispatch(updateStudentCEFRLevels(groupId, sid, withoutAdaptiveTests))
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

  if (open) {
    return (
      <Draggable cancel=".interactable">
        <div className="draggable-modal">
          <div className="flex-reverse">
            <Icon
              className="interactable"
              style={{
                cursor: 'pointer',
                marginBottom: '.5em',
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
            <Button className="interactable" variant="primary" onClick={handleSubmit}>
              Submit changes
            </Button>
            {modified && (
              <Button className="interactable" variant="secondary" onClick={undoChanges}>
                Undo changes
              </Button>
            )}
          </div>
          {showForm && (
            <div
              className="flex space-between"
              style={{ alignItems: 'center', marginBottom: '.5em' }}
            >
              Add CEFR estimate for today:
              <CEFRDropdown
                addNew
                updatedCEFRHistory={updatedCEFRHistory}
                setUpdatedCEFRHistory={setUpdatedCEFRHistory}
                setModified={setModified}
              />
            </div>
          )}
          <div style={{ overflow: 'auto', maxHeight: 300 }}>
            <Table striped bordered hover size="sm">
              <thead>
                <tr key="summary-header-row">
                  <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Date</th>
                  <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Estimator</th>
                  <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {updatedCEFRHistory.map((estimate, index) => (
                  <tr>
                    <th style={{ verticalAlign: 'middle', fontWeight: '400' }}>{moment.unix(estimate.timestamp).format('MM/DD/YYYY')}</th>
                    <th style={{ verticalAlign: 'middle', fontWeight: '400' }}>
                      {estimate.source === 'self_estimation' ? 'Self' : capitalize(estimate.source.replace('_', ' '))}
                    </th>
                    <th style={{ verticalAlign: 'middle', fontWeight: '400' }}>
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
                        marginRight: '.75em',
                        color: 'red',
                      }}
                      size="large"
                      name="close"
                      onClick={() => removeCEFR(index)}
                    />
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Draggable>
    )
  }

  return null
}

export default StudentCEFRModal
