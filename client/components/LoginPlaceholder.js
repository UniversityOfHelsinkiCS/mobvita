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

  return (
    <div>
      {token ? 'devlogin' : null}
      <br />
      Email:
      <input value={email} onChange={({ target }) => setEmail(target.value)} />
      <br />
      Password:
      <input value={password} onChange={({ target }) => setPassword(target.value)} />
      <button
        type="button"
        disabled={loading}
        onClick={login}
      >
        login
      </button>
    </div>
  )
}

export default LoginPlaceholder
