import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import translations from 'Utilities/translations'
import { localeNameToCode } from '../util/common'

const mapStateToProps = ({ locale, user }) => {
  let actualLocale = locale

  if (user.data && user.data.user && user.data.user.interfaceLanguage) { // If user has logged in, use locale from user object, else use value from localeReducer
    actualLocale = localeNameToCode(user.data.user.interfaceLanguage)
  }

  const messages = actualLocale === 'en'
    ? translations.en
    : { ...translations.en, ...translations[actualLocale] }

  return { key: actualLocale, locale: actualLocale, messages }
}

export default connect(mapStateToProps)(IntlProvider)
