import React, { useState } from 'react'

const LoginPlaceholder = ({ login, loading }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
          disabled={loading}
          onClick={() => login(email, password)}
        >
          login
        </button>
      </div>
      Revita is free and will always remain so.
    </div>
  )
}

export default LoginPlaceholder
