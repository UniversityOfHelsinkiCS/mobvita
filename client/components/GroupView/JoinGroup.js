import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Button, FormControl, Form, Card } from 'react-bootstrap'
import { joinGroup } from 'Utilities/redux/groupsReducer'

const JoinGroup = ({role}) => {
  const [token, setToken] = useState('')

  const dispatch = useDispatch()
  const history = useHistory()

  const join = event => {
    event.preventDefault()
    dispatch(joinGroup(token))
    history.push(`/groups/${role}/management`)
  }

  return (
    <div className="ps-nm">
      <Card body>
        <Form className="group-form" onSubmit={join}>
          <span className="sm-label">
            <FormattedMessage id="enter-token" />
          </span>
          <FormControl as="input" onChange={e => setToken(e.target.value)} />
          <Button type="submit">
            <FormattedMessage id="join-group" />
          </Button>
        </Form>
      </Card>
    </div>
  )
}

export default JoinGroup
