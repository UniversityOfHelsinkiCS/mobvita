import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { confirmUser } from 'Utilities/redux/userReducer'
import { useHistory } from 'react-router'
import { Button } from 'react-bootstrap'

const EmailConfirm = ({ match }) => {
  const dispatch = useDispatch()
  const user = useSelector(({ user }) => user.data)
  const history = useHistory()

  useEffect(() => {
    if (user) {
      history.replace('/home')
    }
  }, [user])


  return (
    <Button variant="primary" onClick={() => dispatch(confirmUser(match.params.token))}>
    Confirm Email
    </Button>
  )
}

export default EmailConfirm
