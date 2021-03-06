import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import GroupActionModal from './GroupActionModal'

const NoGroupsView = ({ role }) => {
  return (
    <div className="group-container nogroups" data-cy="no-groups-view">
      <h2 id="title">
        <FormattedMessage id={role === 'student' ? 'Groups-for-students' : 'Groups-for-teachers'} />
      </h2>

      <GroupActionModal
        role={role}
        trigger={
          <div>
            <Button
              variant="primary"
              size="lg"
              data-cy={role === 'student' ? 'join-group-button' : 'create-group-button'}
            >
              <FormattedMessage id={role === 'student' ? 'join-a-group' : 'create-new-group'} />
            </Button>
          </div>
        }
      />
      <br />
      <span className="additional-info">
        <FormattedMessage id={role === 'student' ? 'join-group-message' : 'create-group-message'} />
        <br />
        <br />
        <FormattedMessage id="cant-find-group" />
      </span>
    </div>
  )
}

export default NoGroupsView
