import React, { useState } from 'react'
import { callApi } from 'Utilities/apiConnection'
import LoginPlaceholder from 'Components/LoginPlaceholder'

const AccessControl = ({ children }) => {
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(false)
  if (token) return children

  const login = async (email, password) => {
    setLoading(true)
    const { data } = await callApi('/session', 'post', { email, password })
    localStorage.setItem('token', data.access_token)
    setLoading(false)
  }
  return (
    <>
      <LoginPlaceholder
        login={login}
        loading={loading}
        style={{ flex: 'auto' }}
      />
    </>
  )
}

export default AccessControl
