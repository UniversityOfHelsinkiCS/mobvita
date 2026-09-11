import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Box, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import AppTable from 'Components/ui/AppTable'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import { FormattedMessage } from 'react-intl'
import { updateStudentCEFRLevels } from 'Utilities/redux/groupSummaryReducer'
import { capitalize, isToday, skillLevels } from 'Utilities/common'
import moment from 'moment'
import CEFRDropdown from './CEFRDropdown'

const StudentCEFRModal = ({ open, setOpen, cefrHistory, setCefrHistory, groupId, sid }) => {
  const dispatch = useDispatch()
  const [updatedCEFRHistory, setUpdatedCEFRHistory] = useState(cefrHistory ?? [])
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
    setUpdatedCEFRHistory(cefrHistory ?? [])
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

  return (
    <AppDialog
      open={open}
      onClose={closeModal}
      title={<FormattedMessage id="view-previous-and-edit" />}
      closeDataCy="close-cefr-modal"
    >
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
      <AppTable striped hover density="standard">
        <TableHead>
          <TableRow key="summary-header-row">
            <TableCell>
              <FormattedMessage id="date-of-CEFR" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="source-of-CEFR" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="cefr_grade" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {showForm && (
            <TableRow>
              <TableCell>{moment().format('YYYY/MM/DD')}</TableCell>
              <TableCell sx={{ width: '100px' }} />
              <TableCell>
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
              <TableCell>{moment.unix(estimate.timestamp).format('YYYY/MM/DD')}</TableCell>
              <TableCell sx={{ width: '100px' }}>
                {estimate.source === 'self_estimation'
                  ? 'Self'
                  : capitalize(estimate.source.replace('_', ' '))}
              </TableCell>
              <TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </AppTable>
      <Box sx={{ display: 'flex', gap: '12px', mt: '1.5rem', mb: '0.5rem' }}>
        <AppButton size="sm" variant="primary" onClick={handleSubmit} disabled={!modified}>
          <FormattedMessage id="submit-changes-CEFR" />
        </AppButton>
        <AppButton size="sm" variant="secondary" onClick={undoChanges} disabled={!modified}>
          <FormattedMessage id="undo-changes-CEFR" />
        </AppButton>
      </Box>
    </AppDialog>
  )
}

export default StudentCEFRModal
