// eslint-disable-next-line no-unused-vars
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { images, capitalize, supportedLearningLanguages, hiddenFeatures } from 'Utilities/common'

/**
 * LanguageSelectContent — presentational learning-language picker (2026 design). A flag + name row
 * per language: the two main languages up top, then one "Beta versions" grid (beta + endangered).
 * Pure: `onSelect(lang)` only. Shared by the /learningLanguage route and the navbar's dialog.
 */
const LanguageOption = ({ lang, onSelect }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={() => onSelect(lang)}
    onKeyPress={() => onSelect(lang)}
    className="lang-option"
  >
    <img
      src={images[`flag${capitalize(lang.split('-').join(''))}`]}
      className="lang-option-flag"
      alt=""
    />
    <span className="lang-option-name">
      <FormattedMessage
        id={lang
          .split('-')
          .map(l => capitalize(l))
          .join('-')}
      />
    </span>
  </div>
)

const LanguageSelectContent = ({ onSelect }) => {
  const endangered = [
    ...supportedLearningLanguages.minor,
    ...(hiddenFeatures ? supportedLearningLanguages.experimental : []),
  ]

  return (
    <div className="lang-select">
      {/* Main languages */}
      <div className="lang-select-major">
        {supportedLearningLanguages.major.map(lang => (
          <LanguageOption key={lang} lang={lang} onSelect={onSelect} />
        ))}
      </div>

      <div className="lang-select-divider" />

      {/* Beta + endangered languages share one grid under the Beta heading */}
      <section className="lang-select-section">
        <div className="lang-select-heading">
          <FormattedMessage id="beta-versions" defaultMessage="Beta versions" />
        </div>
        <div className="lang-select-grid">
          {[...supportedLearningLanguages.majorBeta, ...endangered].map(lang => (
            <LanguageOption key={lang} lang={lang} onSelect={onSelect} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default LanguageSelectContent
