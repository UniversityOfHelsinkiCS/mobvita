import React from 'react'
import { Button, Icon } from 'semantic-ui-react'

const EncouragementButton = ({ handleShowEncouragement }) => {
  return (
    <button className="encouragement-button" onClick={handleShowEncouragement}>
      <Icon style={{ marginLeft: '.1em' }} size="large" color="grey" name="idea" data-cy="encouragement-icon" />
    </button>
  )
}

export default EncouragementButton