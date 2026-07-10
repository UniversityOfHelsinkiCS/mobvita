import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { TextField, Button, Switch, FormControlLabel, Alert, CircularProgress } from '@mui/material'
import { searchUsers, setUserHighAccess, clearUserSearch } from 'Utilities/redux/adminReducer'
import { updateHighAccess } from 'Utilities/redux/userReducer'

/**
 * Dashboard — hidden admin page at /dashboard.
 *
 * There is intentionally NO link to this page anywhere in the app; it is reachable only by typing
 * the URL. Access is restricted to language developers with full scope (`developer_of_language`
 * === 'all'). ProtectedRoute handles the "must be logged in" gate; here we additionally redirect
 * anyone without full developer scope away, so non-admins can't view it even by URL.
 */
const Dashboard = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user?.data?.user)
  const userPending = useSelector(state => state.user?.pending)
  const developerScope = user?.developer_of_language

  const { users, searched, pending, error, savingUid } = useSelector(({ admin }) => admin)
  const [query, setQuery] = useState('')

  if (developerScope !== 'all') {
    return <Navigate to="/home" replace />
  }

  const handleSearch = e => {
    e.preventDefault()
    if (query.trim()) dispatch(searchUsers(query.trim()))
  }

  const handleReset = () => {
    setQuery('')
    dispatch(clearUserSearch())
  }

  return (
    <div
      className="cont-tall pt-lg"
      style={{ width: '100%', maxWidth: 720, margin: '0 auto' }}
      data-cy="admin-dashboard"
    >
      <h1 style={{ fontWeight: 800, marginBottom: '0.25em' }}>Admin dashboard</h1>
      <p style={{ opacity: 0.7, marginBottom: '1.5em' }}>
        Restricted area — developers with full language scope only. Not linked anywhere in the app.
      </p>

      <div
        style={{
          border: '1px solid #e0e0e0',
          borderRadius: 12,
          padding: '1.25em',
          background: '#fafafa',
          marginBottom: '1.5em',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '0.5em' }}>Your access</h3>
        <div style={{ opacity: 0.7, marginBottom: '0.5em' }}>{user?.email}</div>
        <FormControlLabel
          control={
            <Switch
              checked={!!user?.high_access}
              disabled={userPending}
              onChange={ev => dispatch(updateHighAccess(ev.target.checked))}
              inputProps={{ 'data-cy': 'self-high-access-toggle' }}
            />
          }
          label={`High access: ${user?.high_access ? 'on' : 'off'}`}
        />
      </div>

      <div
        style={{
          border: '1px solid #e0e0e0',
          borderRadius: 12,
          padding: '1.25em',
          background: '#fafafa',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '0.75em' }}>Manage user access</h3>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <TextField
            label="Search by email or username"
            size="small"
            value={query}
            onChange={ev => setQuery(ev.target.value)}
            style={{ flex: 1 }}
            inputProps={{ 'data-cy': 'admin-user-query' }}
          />
          <Button type="submit" variant="contained" disabled={!query.trim() || pending} data-cy="admin-search-users">
            Search
          </Button>
          {searched && (
            <Button type="button" variant="text" onClick={handleReset}>
              Clear
            </Button>
          )}
        </form>

        {error && (
          <Alert severity="error" style={{ marginTop: '1em' }} data-cy="admin-error">
            Something went wrong. Any pending change was reverted.
          </Alert>
        )}

        {pending && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '1.5em' }}>
            <CircularProgress size={28} />
          </div>
        )}

        {!pending && searched && users.length === 0 && (
          <Alert severity="warning" style={{ marginTop: '1em' }} data-cy="admin-no-users">
            No users found.
          </Alert>
        )}

        {!pending && users.length > 0 && (
          <div style={{ marginTop: '1em', display: 'flex', flexDirection: 'column', gap: 8 }} data-cy="admin-user-results">
            {users.map(u => (
              <div
                key={u.uid}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '0.75em 1em',
                  border: '1px solid #e0e0e0',
                  borderRadius: 10,
                  background: '#fff',
                }}
                data-cy="admin-user-row"
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700 }}>{u.email}</div>
                  {u.username && (
                    <div style={{ opacity: 0.65, fontSize: '0.9rem' }}>{u.username}</div>
                  )}
                </div>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!u.high_access}
                      disabled={savingUid != null}
                      onChange={ev => dispatch(setUserHighAccess(u.uid, ev.target.checked))}
                      inputProps={{ 'data-cy': 'admin-high-access-toggle' }}
                    />
                  }
                  label={`High access: ${u.high_access ? 'on' : 'off'}`}
                  labelPlacement="start"
                  style={{ marginRight: 0, whiteSpace: 'nowrap' }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
