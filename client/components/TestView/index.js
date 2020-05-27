import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

const TestIndex = () => (
  <div className="component-container">
    <Link to="/tests/instance"><Button>New Test</Button></Link>
  </div>
)

export default TestIndex
