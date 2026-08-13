import React, { useState } from 'react'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import AppTextField from 'Components/ui/AppTextField'
import CustomTooltip from 'Components/CustomTooltip'
import { addToGroup } from 'Utilities/redux/groupsReducer'
import { formatEmailList } from 'Utilities/common'

const FIELD_SPACING = { mt: '0.5em', mb: '1.5em' }

const AddToGroup = ({ groupId, setGroupId }) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const [teachers, setTeachers] = useState('')
  const [students, setStudents] = useState('')

  const add = event => {
    event.preventDefault()
    dispatch(addToGroup(formatEmailList(students), formatEmailList(teachers), groupId))
    setGroupId(null)
  }

  return (
    <AppDialog
      open={!!groupId}
      onClose={() => setGroupId(null)}
      title={<FormattedMessage id="add-people-to-group" />}
    >
      <form className="group-form" onSubmit={add}>
        <span className="sm-label">
          <FormattedMessage id="teacher-emails" />
        </span>
        <AppTextField
          multiline
          rows={3}
          sx={FIELD_SPACING}
          inputProps={{ 'data-cy': 'add-to-group-teacher-emails' }}
          value={teachers}
          placeholder={intl.formatMessage({ id: 'multiple-email-separate-instructions' })}
          onChange={e => setTeachers(e.target.value)}
        />
        <span className="sm-label">
          <FormattedMessage id="student-emails" />{' '}
          <CustomTooltip
            permanent
            placement="top"
            title={intl.formatMessage({ id: 'group-registration-documentation' })}
          >
            <InfoOutlinedIcon fontSize="small" sx={{ color: 'grey', verticalAlign: 'middle' }} />
          </CustomTooltip>
        </span>
        <AppTextField
          multiline
          rows={3}
          sx={FIELD_SPACING}
          inputProps={{ 'data-cy': 'add-to-group-student-emails' }}
          value={students}
          placeholder={intl.formatMessage({ id: 'multiple-email-separate-instructions' })}
          onChange={e => setStudents(e.target.value)}
        />
        <AppButton variant="primary" type="submit">
          <FormattedMessage id="Confirm" />
        </AppButton>
      </form>
    </AppDialog>
  )
}

export default AddToGroup
