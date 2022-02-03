import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import { useCurrentUser } from 'Utilities/common'
import { useHistory } from 'react-router-dom'
import GroupActionModal from './GroupActionModal'

const NoGroupsView = ({ role }) => {
  const user = useCurrentUser()
  const isAnonymousUser = user.email === 'anonymous_email'
  const history = useHistory()

  return (
    <div className="group-container nogroups" data-cy="no-groups-view">
      <h2 id="title">
        <FormattedMessage id={role === 'student' ? 'Groups-for-students' : 'Groups-for-teachers'} />
      </h2>

      {isAnonymousUser ? (
        <span className="additional-info">
          <FormattedMessage id="groups-for-only-registered-users" />
          <div>
            <Button
              className="mt-nm"
              variant="primary"
              size="lg"
              onClick={() => history.push('/register')}
            >
              <FormattedMessage id="Register" />
            </Button>
          </div>
        </span>
      ) : (
        <>
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
            <FormattedMessage
              id={role === 'student' ? 'join-group-message' : 'create-group-message'}
            />
            <br />
            <br />
            <FormattedMessage id="cant-find-group" />
          </span>
        </>
      )}
    </div>
  )
}

export default NoGroupsView
