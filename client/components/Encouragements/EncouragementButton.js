import React from 'react'
import { Button, Icon } from 'semantic-ui-react'

const EncouragementButton = ({ handleShowEncouragement }) => {
  return (
    <Button icon basic onClick={handleShowEncouragement}>
      <Icon size="large" name="idea" data-cy="encouragement-icon" />
    </Button>
  )
}

export default EncouragementButton