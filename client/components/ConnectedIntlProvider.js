import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import translations from 'Utilities/translations'

const mapStateToProps = ({ locale }) => {
  const messages = locale === 'en'
    ? translations.en
    : { ...translations.en, ...translations[locale] }

  return { key: locale, locale, messages }
}

export default connect(mapStateToProps)(IntlProvider)
