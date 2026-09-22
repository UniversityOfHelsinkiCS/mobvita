// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createAnonToken, updateLearningLanguage } from 'Utilities/redux/userReducer'
import { localeCodeToName } from 'Utilities/common'
import Spinner from 'Components/Spinner'
import { colors } from 'Assets/mui_theme/designTokens'

// A fresh anonymous account has no learning language, and without one every language-scoped call
// goes to `/…/null`.
const DEMO_LANGUAGE = 'Finnish'

/**
 * DEMO ONLY — wrapper for the pages that are open without an account (/essay-writing,
 * /writing-clinic). They render fine logged out, but every API call needs a bearer token, so a
 * visitor with no session gets the app's own anonymous one — the same `createAnonToken` the landing
 * page's "Try Revita" button uses. Logged-in users pass straight through.
 * REVERT BEFORE RELEASE together with the routes in Router.js.
 */
const DemoPublicRoute = ({ children }) => {
  const dispatch = useDispatch()
  const { locale } = useSelector(({ locale }) => locale)
  const { data, pending, error } = useSelector(({ user }) => user)
  const requested = useRef(false)
  const languageRequested = useRef(false)

  const learningLanguage = data?.user?.last_used_language

  useEffect(() => {
    if (data || pending || error || requested.current) return
    requested.current = true
    dispatch(createAnonToken(localeCodeToName(locale)))
  }, [data, pending, error])

  // A fresh anonymous account has no learning language yet.
  useEffect(() => {
    if (!data || learningLanguage || languageRequested.current) return
    languageRequested.current = true
    dispatch(updateLearningLanguage(DEMO_LANGUAGE))
  }, [data, learningLanguage])

  if (data && learningLanguage) return children

  // A failed anonymous login leaves nothing to show the page with, so say so rather than spin.
  if (error && !data) {
    return (
      <div className="justify-center" style={{ padding: '3em', color: colors.ink }}>
        Could not start a demo session. Please reload the page.
      </div>
    )
  }

  return <Spinner fullHeight size={60} spinnerColor={colors.ink} textColor={colors.ink} />
}

export default DemoPublicRoute
