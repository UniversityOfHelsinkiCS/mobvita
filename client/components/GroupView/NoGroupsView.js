import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import GroupActionModal from './GroupActionModal'

const NoGroupsView = ({ role }) => {
  return (
    <div className="group-container nogroups">
      <h2 id="title">
        <FormattedMessage id={role === 'student' ? 'Groups-for-students' : 'Groups-for-teachers'} />
      </h2>

      <GroupActionModal
        role={role}
        trigger={
          <Button
            variant="primary"
            data-cy={role === 'student' ? 'join-group-button' : 'create-group-button'}
          >
            <FormattedMessage id={role === 'student' ? 'join-a-group' : 'create-new-group'} />
          </Button>
        }
      />
      <br />
      <span className="additional-info">
        <FormattedMessage id={role === 'student' ? 'join-group-message' : 'create-group-message'} />
      </span>
    </div>
  )
}

export default NoGroupsView
