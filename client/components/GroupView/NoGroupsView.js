import React from 'react'
import { useHistory } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import CreateGroupModal from './CreateGroupModal'

const NoGroupsView = ({ role }) => {
  const history = useHistory()

  return (
    <div className="group-container nogroups">
      <h2 id="title">
        {' '}
        <FormattedMessage id="Groups" />
      </h2>
      {role === 'student' ? (
        <div>
          <Button
            data-cy="join-group-button"
            id="join-group-button"
            variant="info"
            onClick={() => history.push(`/groups/${role}/join`)}
          >
            <FormattedMessage id="join-group" />
          </Button>
          <br />
          <span className="additional-info">
            <FormattedMessage id="join-group-message" />
          </span>
        </div>
      ) : (
        <div>
          <CreateGroupModal
            role={role}
            trigger={
              <Button data-cy="create-group" variant="primary">
                <FormattedMessage id="create-new-group" />
              </Button>
            }
          />
          <br />
          <span className="additional-info">
            <FormattedMessage id="create-group-message" />
          </span>
        </div>
      )}
    </div>
  )
}

export default NoGroupsView
