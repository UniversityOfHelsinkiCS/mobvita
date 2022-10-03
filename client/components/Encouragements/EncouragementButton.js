import React from 'react'
import { useDispatch } from 'react-redux'
import { Icon } from 'semantic-ui-react'

const EncouragementButton = ({ handleClick }) => {

  return (
    <button className="encouragement-button" onClick={handleClick}>
      <Icon style={{ marginLeft: '.1em' }} size="large" color="grey" name="idea" data-cy="encouragement-icon" />
    </button>
  )
}

export default EncouragementButton