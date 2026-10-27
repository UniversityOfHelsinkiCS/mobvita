import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { getLoadedMessages, loadMessages } from 'Utilities/translations'
import { localeNameToCode } from '../util/common'

// IntlProvider fed by the logged-in user's interface language, else the locale reducer.
const ConnectedIntlProvider = ({ children }) => {
  const storeLocale = useSelector(({ locale }) => locale.locale)
  const interfaceLanguage = useSelector(({ user }) => user.data?.user?.interfaceLanguage)
  const locale = interfaceLanguage ? localeNameToCode(interfaceLanguage) : storeLocale

  // The language on screen; on a switch the old one stays until the new file has arrived.
  const [shown, setShown] = useState(() => ({ locale, messages: getLoadedMessages(locale) }))

  useEffect(() => {
    if (shown.locale === locale && shown.messages) return undefined
    let current = true
    loadMessages(locale)
      .catch(() => getLoadedMessages('en'))
      .then(messages => current && setShown({ locale, messages }))
    return () => {
      current = false
    }
  }, [locale])

  // Only the very first load of a non-English language waits here, for one small file.
  if (!shown.messages) return null

  // `key` remounts the tree on a language switch, as the connect() version did.
  return (
    <IntlProvider key={shown.locale} locale={shown.locale} messages={shown.messages}>
      {children}
    </IntlProvider>
  )
}

export default ConnectedIntlProvider
