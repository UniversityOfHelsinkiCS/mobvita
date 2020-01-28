import React, { useCallback } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ component: Component, languageRequired = true, ...rest }) => {
  const { data: user } = useSelector(({ user }) => user)
  const language = user ? user.user.last_used_language : null

  let redirectPath = '/login'
  let isRedirected = !user

  if (languageRequired) {
    redirectPath = user ? '/learningLanguage' : '/login'
    isRedirected = !user || !language
  }

  const componentRender = useCallback(routerProps => <Component {...routerProps} />, [Component])
  const redirectRender = useCallback(({ location }) => (
    <Redirect
      to={{
        pathname: redirectPath,
        state: { from: location },
      }}
    />
  ), [redirectPath])

  const renderer = isRedirected ? redirectRender : componentRender

  // if (pending) {
  //   return null
  // }

  return (
    <Route
      {...rest}
      render={renderer}
    />
  )
}

export default ProtectedRoute
