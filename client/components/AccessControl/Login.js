import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createRealToken, createAnonToken } from 'Utilities/redux/userReducer'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const login = () => dispatch(createRealToken(email, password))
  const loginAnon = () => dispatch(createAnonToken())

  return (
    <div>
      Welcome!
      Master a language by learning from stories of your own choosing
      <div>
        Email:
        <input value={email} onChange={({ target }) => setEmail(target.value)} />
        <br />
        PW:
        <input value={password} onChange={({ target }) => setPassword(target.value)} />
        <button
          type="button"
          onClick={login}
        >
          login
        </button>
      </div>
      <div>
        <button
          type="button"
          onClick={loginAnon}
        >
          Test revita without account
        </button>
      </div>
    </div>
  )
}

export default Login
