import React, { useState } from 'react'
import { Modal, Icon, Popup } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Button, FormControl, Form } from 'react-bootstrap'
import { addToGroup } from 'Utilities/redux/groupsReducer'
import { formatEmailList } from 'Utilities/common'

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
    <Modal dimmer="inverted" closeIcon open={!!groupId} onClose={() => setGroupId(null)}>
      <Modal.Header>
        <FormattedMessage id="add-people-to-group" />
      </Modal.Header>
      <Modal.Content style={{ display: 'flex', flexDirection: 'column' }}>
        <Form className="group-form" onSubmit={add}>
          <span className="sm-label">
            <FormattedMessage id="teacher-emails" />
          </span>
          <FormControl
            as="textarea"
            data-cy="add-to-group-teacher-emails"
            value={teachers}
            placeholder={intl.formatMessage({ id: 'multiple-email-separate-instructions' })}
            onChange={e => setTeachers(e.target.value)}
          />
          <span className="sm-label">
            <FormattedMessage id="student-emails" />{' '}
            <Popup
              position="top center"
              content={intl.formatMessage({ id: 'group-registration-documentation' })}
              trigger={<Icon name="info circle" color="grey" />}
            />
          </span>
          <FormControl
            as="textarea"
            data-cy="add-to-group-student-emails"
            value={students}
            placeholder={intl.formatMessage({ id: 'multiple-email-separate-instructions' })}
            onChange={e => setStudents(e.target.value)}
          />
          <Button variant="primary" type="submit">
            <FormattedMessage id="Confirm" />
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  )
}

export default AddToGroup
