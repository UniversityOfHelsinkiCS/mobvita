import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import CloseIcon from '@mui/icons-material/Close'
import { TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import AppTable from 'Components/ui/AppTable'
import AppButton from 'Components/AppButton'
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
            <CloseIcon
              className="interactable"
              style={{
                cursor: 'pointer',
                marginBottom: '1em',
              }}
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
            <AppTable striped bordered hover>
              <TableHead>
                <TableRow key="summary-header-row">
                  <TableCell style={{ textAlign: 'center', verticalAlign: 'middle' }}><FormattedMessage id="date-of-CEFR" /></TableCell>
                  <TableCell style={{ textAlign: 'center', verticalAlign: 'middle' }}><FormattedMessage id="source-of-CEFR" /></TableCell>
                  <TableCell style={{ textAlign: 'center', verticalAlign: 'middle' }}><FormattedMessage id="cefr_grade" /></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {showForm && (
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'middle', padding: '0.75rem' }}>
                      {moment().format('YYYY/MM/DD')}
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'middle', padding: '0.75rem', width: '100px' }}>
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'middle', padding: '0.75rem' }}>
                      <CEFRDropdown
                        addNew
                        updatedCEFRHistory={updatedCEFRHistory}
                        setUpdatedCEFRHistory={setUpdatedCEFRHistory}
                        setModified={setModified}
                      />
                    </TableCell>
                  </TableRow>
                )}
                {updatedCEFRHistory.map((estimate, index) => (
                  <TableRow key={`${estimate.timestamp}-${estimate.source}`}>
                    <TableCell style={{ verticalAlign: 'middle', padding: '0.75rem' }}>
                      {moment.unix(estimate.timestamp).format('YYYY/MM/DD')}
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'middle', padding: '0.75rem', width: '100px' }}>
                      {estimate.source === 'self_estimation'
                        ? 'Self'
                        : capitalize(estimate.source.replace('_', ' '))}
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'middle', padding: '0.75rem' }}>
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
                    </TableCell>
                    {/* {estimate.source === 'teacher' && (
                      <CloseIcon
                        className="interactable"
                        style={{
                          cursor: 'pointer',
                          marginTop: '.6em',
                          marginLeft: '.25em',
                          marginRight: '.75em',
                          color: 'red',
                        }}
                        onClick={() => removeCEFR(index)}
                      />
                    )} */}
                  </TableRow>
                ))}
              </TableBody>
            </AppTable>
          </div>
          <div className="flex space-between" style={{ paddingBottom: '15px' }}>
            <AppButton
              className="interactable"
              variant="primary"
              onClick={handleSubmit}
              disabled={!modified}
            >
              <FormattedMessage id="submit-changes-CEFR" />
            </AppButton>
            <AppButton
              className="interactable"
              style={{ marginLeft: '.5rem' }}
              variant="secondary"
              onClick={undoChanges}
              disabled={!modified}
            >
              <FormattedMessage id="undo-changes-CEFR" />
            </AppButton>
          </div>
        </div>
      </Draggable>
    )
  }

  return null
}

export default StudentCEFRModal
