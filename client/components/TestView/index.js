import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

const TestIndex = () => (
  <div className="component-container">
    <Link to="/tests/instance">
      <Button>
        <FormattedMessage id="start-a-new-test" />
      </Button>
    </Link>
  </div>
)

export default TestIndex
