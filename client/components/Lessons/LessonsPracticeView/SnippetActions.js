import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap'

const SnippetActions = () => {

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Button variant="primary">
          Submit answers
        </Button>
      </div>
    </div>
  )
}

export default SnippetActions