import React, { useState } from 'react'
import { Card, Collapse } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'

const CollapsingList = ({ header, children }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Card style={{ marginBottom: '0.2rem' }}>
        <Card.Header
          style={{ cursor: 'pointer' }}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          <Icon name={open ? 'caret down' : 'caret right'} />
          {header}
        </Card.Header>
        <Collapse in={open}>{children}</Collapse>
      </Card>
    </>
  )
}

export default CollapsingList
