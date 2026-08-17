import React from 'react'
import { useDispatch } from 'react-redux'
import { emptyLastAddInfo } from 'Utilities/redux/groupsReducer'
import { FormattedMessage, useIntl } from 'react-intl'
import { Box, Divider } from '@mui/material'
import AppDialog from 'Components/ui/AppDialog'

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

const PeopleAddResultModal = ({ lastAddInfo }) => {
  const dispatch = useDispatch()
  const intl = useIntl()

  if (!lastAddInfo) return null

  return (
    <AppDialog
      open={!!lastAddInfo}
      onClose={() => dispatch(emptyLastAddInfo())}
      data-cy="people-add-result-modal"
      closeDataCy="people-add-result-modal-close"
      title={<FormattedMessage id="summary-people-added-to-group" />}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', margin: '1em' }}>
        <ResultItem
          label={intl.formatMessage({ id: 'teachers-added-to-the-group' })}
          resultList={lastAddInfo[0].teachersAdded}
        />
        <ResultItem
          label={intl.formatMessage({ id: 'teachers-awaiting-confirmation' })}
          resultList={lastAddInfo[0].toBeConfirmedTeachers}
        />
        <ResultItem
          label={intl.formatMessage({ id: 'teachers-not-registered-in-revita' })}
          resultList={lastAddInfo[0].addingFailedTeachers}
        />
        <Divider sx={{ my: '1em' }} />
        <ResultItem
          label={intl.formatMessage({ id: 'students-added-to-the-group' })}
          resultList={lastAddInfo[0].studentsAdded}
        />
        <ResultItem
          label={intl.formatMessage({ id: 'students-awaiting-confirmation' })}
          resultList={lastAddInfo[0].toBeConfirmedStudents}
        />
        <ResultItem
          label={intl.formatMessage({ id: 'students-not-registered-in-revita' })}
          resultList={lastAddInfo[0].addingFailedStudents}
        />
      </Box>
    </AppDialog>
  )
}

export default PeopleAddResultModal
