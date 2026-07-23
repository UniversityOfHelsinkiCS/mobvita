import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  images,
  capitalize,
  supportedLearningLanguages,
  hiddenFeatures,
  betaLanguages,
} from 'Utilities/common'

/**
 * LanguageSelectContent — presentational learning-language picker (flag grids). Pure: `onSelect(lang)`
 * only. Shared by the /learningLanguage route and the navbar's language dialog.
 */
const LanguageGroup = ({ languages, onSelect }) => (
  <div className="language-group">
    {languages.map(lang => (
      <div
        key={lang}
        role="button"
        tabIndex={0}
        onClick={() => onSelect(lang)}
        onKeyPress={() => onSelect(lang)}
        className="language"
      >
        <img
          src={images[`flag${capitalize(lang.split('-').join(''))}`]}
          className="language-image"
          alt={lang}
        />
        <span className="language-name">
          <FormattedMessage
            id={lang
              .split('-')
              .map(l => capitalize(l))
              .join('-')}
          />
          {betaLanguages.includes(lang) && (
            <sup>
              <b>&beta;</b>
            </sup>
          )}
        </span>
      </div>
    ))}
  </div>
)

const LanguageSelectContent = ({ onSelect }) => (
  <div style={{ textAlign: 'center' }}>
    <LanguageGroup languages={supportedLearningLanguages.major} onSelect={onSelect} />
    <hr />
    <LanguageGroup languages={supportedLearningLanguages.majorBeta} onSelect={onSelect} />
    <hr />
    <LanguageGroup languages={supportedLearningLanguages.minor} onSelect={onSelect} />
    {hiddenFeatures && (
      <>
        <hr />
        <LanguageGroup languages={supportedLearningLanguages.experimental} onSelect={onSelect} />
      </>
    )}
  </div>
)

export default LanguageSelectContent
