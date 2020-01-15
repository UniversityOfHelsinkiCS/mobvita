import React from 'react'
import { useDispatch } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { confirmUser } from 'Utilities/redux/userReducer'

const EmailConfirm = ({ match }) => {
  const dispatch = useDispatch()
  return <Button onClick={() => dispatch(confirmUser(match.params.token))}>Confirm Email</Button>
}

export default EmailConfirm
