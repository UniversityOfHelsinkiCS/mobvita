import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Button, FormControl, Form, Card } from 'react-bootstrap'
import { joinGroup } from 'Utilities/redux/groupsReducer'

const JoinGroup = () => {
  const [token, setToken] = useState('')

  const dispatch = useDispatch()
  const history = useHistory()

  const join = event => {
    event.preventDefault()
    dispatch(joinGroup(token))
    history.push('/groups/management')
  }

  return (
    <div className="padding-sides-2">
      <Card body>
        <Form className="group-form" onSubmit={join}>
          <span className="sm-label">
            <FormattedMessage id="token" />
          </span>
          <FormControl as="input" onChange={e => setToken(e.target.value)} />
          <Button type="submit">
            <FormattedMessage id="Confirm" />
          </Button>
        </Form>
      </Card>
    </div>
  )
}

export default JoinGroup
