import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import AppTextField from 'Components/ui/AppTextField'
import AppButton from 'Components/AppButton'
import Spinner from 'Components/Spinner'
import TemplateListItems from './TemplateListItems'

const TemplateTranslations = ({
  translations,
  setTranslations,
  translation,
  setTranslation,
  pending = false,
  ...props
}) => {
  const intl = useIntl()

  const handleTranslationChange = e => {
    setTranslation(e.target.value)
  }

  const handleTranslationSave = () => {
    if (translation) {
      setTranslations(prev => [...prev, translation])
      setTranslation('')
    }
  }

  const handleTranslationDelete = translationIdx => {
    setTranslations(prev => prev.filter((_, idx) => idx !== translationIdx))
  }

  const handleTranslationKeyDown = e => {
    if (e.key === 'Enter') {
      handleTranslationSave()
    }
    if (e.key === 'Escape') {
      setTranslation('')
    }
  }

  return (
    <div className="flashcard-template-section">
      <label htmlFor="newTranslation" className="flashcard-form-title">
        <FormattedMessage id="new-translations" />
      </label>
      <div className="flashcard-form-list">
        {pending ? (
          <Spinner size={60} />
        ) : (
          <ul>
            <TemplateListItems
              values={translations}
              handleDelete={handleTranslationDelete}
              {...props}
            />
          </ul>
        )}
      </div>
      <div className="flashcard-template-input">
        <AppTextField
          id="newTranslation"
          placeholder={intl.formatMessage({ id: 'type-new-translation' })}
          value={translation}
          onChange={handleTranslationChange}
          onKeyDown={handleTranslationKeyDown}
        />
      </div>
      <AppButton
        variant="secondary"
        className="flashcard-form-button"
        onClick={handleTranslationSave}
      >
        <FormattedMessage id="save-the-translation" />
      </AppButton>
    </div>
  )
}

export default TemplateTranslations
