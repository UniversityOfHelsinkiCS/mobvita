import React from 'react'
import { useDispatch } from 'react-redux'
import { emptyLastAddInfo } from 'Utilities/redux/groupsReducer'
import { FormattedMessage, useIntl } from 'react-intl'
import { Box, Divider } from '@mui/material'
import AppDialog from 'Components/ui/AppDialog'

// Result lists per role, in display order: [translation id, lastAddInfo field].
const TEACHER_SECTIONS = [
  ['teachers-added-to-the-group', 'teachersAdded'],
  ['teachers-awaiting-confirmation', 'toBeConfirmedTeachers'],
  ['teachers-not-registered-in-revita', 'addingFailedTeachers'],
  ['teachers-not-allowed-in-group', 'notAllowedTeachers'],
]
const STUDENT_SECTIONS = [
  ['students-added-to-the-group', 'studentsAdded'],
  ['students-awaiting-confirmation', 'toBeConfirmedStudents'],
  ['students-not-registered-in-revita', 'addingFailedStudents'],
  ['students-not-allowed-in-group', 'notAllowedStudents'],
]

// One labelled list of e-mails.
const ResultItem = ({ label, resultList }) => {
  return (
    <div style={{ marginTop: '1em' }}>
      <span className="bold" style={{ fontSize: '1.2em' }}>
        {label}
      </span>
      <ul>
        {resultList.map(email => (
          <li key={email}>{email}</li>
        ))}
      </ul>
    </div>
  )
}

// Summary of an add-people / create-group request; empty lists are not shown.
const PeopleAddResultModal = ({ lastAddInfo }) => {
  const dispatch = useDispatch()
  const intl = useIntl()

  if (!lastAddInfo) return null

  const info = lastAddInfo[0]
  const nonEmpty = sections => sections.filter(([, field]) => info[field]?.length)
  const teacherSections = nonEmpty(TEACHER_SECTIONS)
  const studentSections = nonEmpty(STUDENT_SECTIONS)

  // Renders the given sections as ResultItems.
  const renderSections = sections =>
    sections.map(([labelId, field]) => (
      <ResultItem
        key={field}
        label={intl.formatMessage({ id: labelId })}
        resultList={info[field]}
      />
    ))

  return (
    <AppDialog
      open={!!lastAddInfo}
      onClose={() => dispatch(emptyLastAddInfo())}
      data-cy="people-add-result-modal"
      closeDataCy="people-add-result-modal-close"
      title={<FormattedMessage id="summary-people-added-to-group" />}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', margin: '1em' }}>
        {renderSections(teacherSections)}
        {teacherSections.length > 0 && studentSections.length > 0 && <Divider sx={{ my: '1em' }} />}
        {renderSections(studentSections)}
      </Box>
    </AppDialog>
  )
}

export default PeopleAddResultModal
