import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { IntlProvider } from 'react-intl'
import translations from 'Utilities/translations'
import { localeNameToCode } from '../util/common'

// IntlProvider fed by the logged-in user's interface language, else the locale reducer.
const ConnectedIntlProvider = ({ children }) => {
  const storeLocale = useSelector(({ locale }) => locale.locale)
  const interfaceLanguage = useSelector(({ user }) => user.data?.user?.interfaceLanguage)
  const locale = interfaceLanguage ? localeNameToCode(interfaceLanguage) : storeLocale

  // English is the base; other locales fall back to it for missing keys.
  const messages = useMemo(
    () => (locale === 'en' ? translations.en : { ...translations.en, ...translations[locale] }),
    [locale],
  )

  // `key` remounts the tree on a language switch, as the connect() version did.
  return (
    <IntlProvider key={locale} locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  )
}

export default ConnectedIntlProvider
