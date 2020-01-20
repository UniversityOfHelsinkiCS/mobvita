import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'


const ProtectedRoute = ({ children, ...rest }) => {
  const user = useSelector(({ user }) => user.data.user)

  return (
    <Route
      {...rest}
      render={({ location }) => (user ? (
        children
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: location },
          }}
        />
      ))
        }
    />
  )
}

export default ProtectedRoute
