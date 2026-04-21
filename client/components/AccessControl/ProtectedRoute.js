import React, { useMemo } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ component: Component, languageRequired = true }) => {
  const { data: user } = useSelector(({ user }) => user)
  const learningLanguage = user ? user.user.last_used_language : null
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()

  const history = useMemo(
    () => ({
      push: (to, state) => navigate(to, { state }),
      replace: (to, state) => navigate(to, { replace: true, state }),
      goBack: () => navigate(-1),
      goForward: () => navigate(1),
      go: delta => navigate(delta),
      location,
      listen: () => () => {} }),
    [location, navigate]
  )

  let redirectPath = '/'
  let isRedirected = !user

  if (languageRequired) {
    redirectPath = user ? '/learningLanguage' : '/'
    isRedirected = !user || !learningLanguage
  }

  if (isRedirected) {
    return (
      <Navigate
        to={redirectPath}
        replace
        state={{ from: location }}
      />
    )
  }

  return <Component history={history} location={location} match={{ params }} />
}

export default ProtectedRoute
