import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Form, Button } from 'react-bootstrap'
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
      setTranslations(translations.concat(translation))
      setTranslation('')
    }
  }

  const handleTranslationDelete = selectedTranslation => {
    setTranslations(translations.filter(t => t !== selectedTranslation))
  }

  const handleTranslationKeyDown = e => {
    if (e.key === 'Enter') {
      handleTranslationSave()
    }
  }

  return (
    <div className="flex-col auto-overflow">
      <label htmlFor="newTranslation" className="header-3 justify-center pt-nm">
        <FormattedMessage id="new-translations" />
      </label>
      <div className="auto-overflow mb-sm">
        <div className="auto-overflow">
          {pending ? (
            <Spinner />
          ) : (
            <ul>
              <TemplateListItems
                values={translations}
                handleDelete={handleTranslationDelete}
                italics
                {...props}
              />
            </ul>
          )}
        </div>
      </div>
      <Form.Control
        id="newTranslation"
        type="text"
        placeholder={intl.formatMessage({ id: 'type-new-translation' })}
        value={translation}
        onChange={handleTranslationChange}
        onKeyDown={handleTranslationKeyDown}
      />
      <Button
        variant="primary"
        block
        className="flashcard-template-button mt-sm mb-lg"
        onClick={handleTranslationSave}
      >
        <FormattedMessage id="save-the-translation" />
      </Button>
    </div>
  )
}

export default TemplateTranslations
