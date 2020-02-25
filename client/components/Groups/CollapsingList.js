import React, { useState } from 'react'
import {
  Card,
  Collapse,
} from 'react-bootstrap'

const CollapsingList = ({ header, children }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Card>
        <Card.Header
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          {header}
        </Card.Header>
        <Collapse in={open}>
          {children}
        </Collapse>
      </Card>

    </>
  )
}

export default CollapsingList
