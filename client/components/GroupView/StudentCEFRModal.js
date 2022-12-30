import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { Table, Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { updateStudentCEFRLevels } from 'Utilities/redux/groupSummaryReducer'
import Draggable from 'react-draggable'
import { capitalize, isToday, skillLevels } from 'Utilities/common'
import moment from 'moment'
import CEFRDropdown from './CEFRDropdown'

const StudentCEFRModal = ({ open, setOpen, cefrHistory, setCefrHistory, groupId, sid }) => {
  const dispatch = useDispatch()
  const [updatedCEFRHistory, setUpdatedCEFRHistory] = useState(cefrHistory)
  const [modified, setModified] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const closeModal = () => {
    setOpen(false)
  }

  const handleSubmit = () => {
    const withoutAdaptiveTests = updatedCEFRHistory.filter(
      estimate => estimate.source !== 'adaptive_test'
    )
    dispatch(updateStudentCEFRLevels(groupId, sid, withoutAdaptiveTests))
    setCefrHistory(updatedCEFRHistory)
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

  useEffect(() => {
    undoChanges()
  }, [cefrHistory])

  if (open) {
    return (
      <Draggable cancel=".interactable">
        <div className="draggable-modal">
          <div className="flex-reverse">
            <Icon
              className="interactable"
              style={{
                cursor: 'pointer',
                marginBottom: '1em',
              }}
              size="large"
              name="close"
              onClick={closeModal}
            />
          </div>
          {/* {showForm && (
            <div style={{ marginBottom: '10px' }}>
              <CEFRDropdown
                addNew
                updatedCEFRHistory={updatedCEFRHistory}
                setUpdatedCEFRHistory={setUpdatedCEFRHistory}
                setModified={setModified}
              />
            </div>
          )} */}
          <div style={{  maxHeight: 300 }}> {/*  overflow: 'auto', */}
            <Table striped bordered hover size="sm">
              <thead>
                <tr key="summary-header-row">
                  <th style={{ textAlign: 'center', verticalAlign: 'middle' }}><FormattedMessage id="date-of-CEFR" /></th>
                  <th style={{ textAlign: 'center', verticalAlign: 'middle' }}><FormattedMessage id="source-of-CEFR" /></th>
                  <th style={{ textAlign: 'center', verticalAlign: 'middle' }}><FormattedMessage id="cefr_grade" /></th>
                </tr>
              </thead>
              <tbody>
                {showForm && (
                  <tr>
                    <th style={{ verticalAlign: 'middle', fontWeight: '400', padding: '0.75rem' }}>
                      {moment().format('YYYY/MM/DD')}
                    </th>
                    <th style={{ verticalAlign: 'middle', fontWeight: '400', padding: '0.75rem', width: '100px' }}>
                    </th>
                    <th style={{ verticalAlign: 'middle', fontWeight: '400', padding: '0.75rem' }}>
                      <CEFRDropdown
                        addNew
                        updatedCEFRHistory={updatedCEFRHistory}
                        setUpdatedCEFRHistory={setUpdatedCEFRHistory}
                        setModified={setModified}
                      />
                    </th>
                  </tr>
                  // <div style={{ marginBottom: '10px' }}>
                  //   <CEFRDropdown
                  //     addNew
                  //     updatedCEFRHistory={updatedCEFRHistory}
                  //     setUpdatedCEFRHistory={setUpdatedCEFRHistory}
                  //     setModified={setModified}
                  //   />
                  // </div>
                )} 
                {updatedCEFRHistory.map((estimate, index) => (
                  <tr>
                    <th style={{ verticalAlign: 'middle', fontWeight: '400', padding: '0.75rem' }}>
                      {moment.unix(estimate.timestamp).format('YYYY/MM/DD')}
                    </th>
                    <th style={{ verticalAlign: 'middle', fontWeight: '400' , padding: '0.75rem', width: '100px' }}>
                      {estimate.source === 'self_estimation'
                        ? 'Self'
                        : capitalize(estimate.source.replace('_', ' '))}
                    </th>
                    <th style={{ verticalAlign: 'middle', fontWeight: '400', padding: '0.75rem' }}>
                      {estimate.source === 'teacher' ? (
                        <CEFRDropdown
                          estimate={estimate}
                          index={index}
                          updatedCEFRHistory={updatedCEFRHistory}
                          setUpdatedCEFRHistory={setUpdatedCEFRHistory}
                          setModified={setModified}
                        />
                      ) : (
                        skillLevels[estimate.grade]
                      )}
                    </th>
                    {/* {estimate.source === 'teacher' && (
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
                    )} */}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="flex space-between" style={{ paddingBottom: '15px' }}>
            <Button 
              className="interactable" 
              variant="primary" 
              onClick={handleSubmit}
              disabled={!modified}
            >
              <FormattedMessage id="submit-changes-CEFR" />
            </Button>
            <Button
              className="interactable"
              style={{ marginLeft: '.5rem' }}
              variant="secondary"
              onClick={undoChanges}
              disabled={!modified}
            >
              <FormattedMessage id="undo-changes-CEFR" />
            </Button>
          </div>
        </div>
      </Draggable>
    )
  }

  return null
}

export default StudentCEFRModal
