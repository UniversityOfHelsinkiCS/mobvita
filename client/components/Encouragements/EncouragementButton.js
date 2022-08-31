import React from 'react'
import { Button, Icon } from 'semantic-ui-react'

const EncouragementButton = ({ handleShowEncouragement }) => {
  return (
    <Button className="navigationbuttonopen" icon basic onClick={handleShowEncouragement}>
      <Icon size="large" name="flag" data-cy="encouragement-icon" />
    </Button>
  )
}

export default EncouragementButton