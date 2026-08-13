import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import AppTextField from 'Components/ui/AppTextField'
import { createGroup, joinGroup } from 'Utilities/redux/groupsReducer'

const FIELD_SPACING = { mt: '0.5em', mb: '1.5em' }

const GroupActionModal = ({ trigger, role }) => {
  const [open, setOpen] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')
  const [teachers, setTeachers] = useState('')
  const [students, setStudents] = useState('')
  const [token, setToken] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const join = event => {
    event.preventDefault()
    dispatch(joinGroup(token))
    setOpen(false)
    navigate(`/groups/${role}`)
  }

  const addGroup = event => {
    event.preventDefault()
    const studentsToAdd = students.split(',').map(p => p.trim())
    const teachersToAdd = teachers.split(',').map(p => p.trim())

    dispatch(createGroup(groupName, description, studentsToAdd, teachersToAdd))
    setOpen(false)
    navigate(`/groups/${role}`)
  }

  const triggerEl = trigger
    ? React.cloneElement(trigger, { onClick: () => setOpen(true) })
    : null

  return (
    <>
      {triggerEl}
      <AppDialog
        open={open}
        onClose={() => setOpen(false)}
        title={<FormattedMessage id={role === 'student' ? 'join-group' : 'create-new-group'} />}
      >
        {role === 'student' ? (
          <form className="group-form" onSubmit={join}>
            <span className="sm-label">
              <FormattedMessage id="enter-token" />
            </span>
            <AppTextField
              sx={FIELD_SPACING}
              inputProps={{ 'data-cy': 'group-token' }}
              onChange={e => setToken(e.target.value)}
            />
            <AppButton type="submit">
              <FormattedMessage id="join-group" />
            </AppButton>
          </form>
        ) : (
          <form className="group-form" data-cy="add-group-form" onSubmit={addGroup}>
            <span className="sm-label">
              <FormattedMessage id="name-of-group" />
            </span>
            <AppTextField
              sx={FIELD_SPACING}
              inputProps={{ 'data-cy': 'group-name' }}
              onChange={e => setGroupName(e.target.value)}
            />
            <span className="sm-label">
              <FormattedMessage id="Description" />
            </span>
            <AppTextField
              multiline
              rows={3}
              sx={FIELD_SPACING}
              inputProps={{ 'data-cy': 'group-description' }}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <span className="sm-label">
              <FormattedMessage id="teacher-emails" />
            </span>
            <AppTextField
              multiline
              rows={3}
              sx={FIELD_SPACING}
              inputProps={{ 'data-cy': 'teacher-emails' }}
              value={teachers}
              onChange={e => setTeachers(e.target.value)}
            />
            <span className="sm-label">
              <FormattedMessage id="student-emails" />
            </span>
            <AppTextField
              multiline
              rows={3}
              sx={FIELD_SPACING}
              inputProps={{ 'data-cy': 'student-emails' }}
              value={students}
              onChange={e => setStudents(e.target.value)}
            />
            <AppButton type="submit">
              <FormattedMessage id="create-group" />
            </AppButton>
          </form>
        )}
      </AppDialog>
    </>
  )
}

export default GroupActionModal
