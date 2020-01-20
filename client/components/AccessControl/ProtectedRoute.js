import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ component: Component, languageRequired = true, ...rest }) => {
  const { data: user, pending } = useSelector(({ user }) => user)
  const language = user ? user.user.last_used_language : null

  let redirectPath = '/login'
  let isRedirected = !user

  if (languageRequired) {
    redirectPath = user ? '/learningLanguage' : '/login'
    isRedirected = !user || !language
  }

  if (pending) {
    return null
  }

  return (
    <Route
      {...rest}
      render={({ location, match }) => (!isRedirected ? (
        <Component match={match} {...rest} />
      ) : (
        <Redirect
          to={{
            pathname: redirectPath,
            state: { from: location },
          }}
        />
      ))
        }
    />
  )
}

export default ProtectedRoute
