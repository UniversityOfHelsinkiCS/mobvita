import React from 'react'
import { useHistory } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'

const NoGroupsView = () => {
  const history = useHistory()

  return (
    <div className="group-container nogroups">
      <h2 id="title">
        {' '}
        <FormattedMessage id="Groups" />
      </h2>
      <Button id="join-group-button" variant="info" onClick={() => history.push('/groups/join')}>
        <FormattedMessage id="join-group" />
      </Button>
      <span className="additional-info">
        <FormattedMessage id="join-group-message" />
      </span>

      <br />
      <Button
        data-cy="create-group"
        variant="primary"
        onClick={() => history.push('/groups/create')}
      >
        <FormattedMessage id="create-new-group" />
      </Button>
      <span className="additional-info">
        <FormattedMessage id="create-group-message" />
      </span>
    </div>
  )
}

export default NoGroupsView
