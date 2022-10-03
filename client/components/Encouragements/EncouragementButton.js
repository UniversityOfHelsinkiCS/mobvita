import React from 'react'
import { Icon } from 'semantic-ui-react'

const EncouragementButton = ({ handleClick }) => {

  return (
    <button className="encouragement-button" onClick={handleClick}>
      <Icon style={{ marginLeft: '.1rem' }} size="large" name="idea outline" data-cy="encouragement-icon" />
    </button>
  )
}

export default EncouragementButton