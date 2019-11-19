import React, { useState } from 'react'
import { callApi } from 'Utilities/apiConnection'

const LoginPlaceholder = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem('token')

  const login = async () => {
    setLoading(true)
    const { data } = await callApi('/session', 'post', { email, password })
    localStorage.setItem('token', data.access_token)
    setLoading(false)
  }
  const logout = async () => {
    localStorage.clear()
  }

  return (
    <div style={{ display: 'flex' }}>
      <div>
        Email:
        <input value={email} onChange={({ target }) => setEmail(target.value)} />
        <br />
        PW:
        <input value={password} onChange={({ target }) => setPassword(target.value)} />
        <button
          type="button"
          disabled={loading}
          onClick={login}
        >
          login
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={logout}
        >
          logout
        </button>
      </div>
      <div style={{ overflow: 'scroll', width: '7em' }}>
        Token: {token}
      </div>
    </div>
  )
}

export default LoginPlaceholder
