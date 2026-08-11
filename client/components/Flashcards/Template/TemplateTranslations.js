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
    <div className="flex-col auto-overflow">
      <label htmlFor="newTranslation" className="header-2 justify-center bold pt-nm">
        <FormattedMessage id="new-translations" />
      </label>
      <div className="auto-overflow mb-sm">
        <div className="auto-overflow">
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
      </div>
      <AppTextField
        id="newTranslation"
        placeholder={intl.formatMessage({ id: 'type-new-translation' })}
        value={translation}
        onChange={handleTranslationChange}
        onKeyDown={handleTranslationKeyDown}
      />
      <AppButton
        variant="secondary"
        className="flashcard-template-button mb-lg"
        style={{ width: '100%', marginTop: '0.75em' }}
        onClick={handleTranslationSave}
      >
        <FormattedMessage id="save-the-translation" />
      </AppButton>
    </div>
  )
}

export default TemplateTranslations
