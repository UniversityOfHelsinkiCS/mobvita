import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import ReactCardFlip from 'react-card-flip'
import { Form, Button, Spinner } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  learningLanguageSelector,
  dictionaryLanguageSelector,
  hiddenFeatures,
  capitalize,
} from 'Utilities/common'
import { createFlashcard } from 'Utilities/redux/flashcardReducer'
import { getTranslationAction, clearTranslationAction } from 'Utilities/redux/translationReducer'

const FlashcardCreation = () => {
  const [flipped, setFlipped] = useState(false)
  const [word, setWord] = useState('')
  const [hints, setHints] = useState([])
  const [hint, setHint] = useState('')

  const { glosses, pending } = useSelector(({ translation }) => {
    const glosses = translation.data
      && translation.data[0]
      && translation.data[0].glosses
    const { pending } = translation
    return { glosses, pending }
  }, shallowEqual)
  const [translations, setTranslations] = useState([])
  const [translation, setTranslation] = useState('')

  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)

  const dispatch = useDispatch()
  const intl = useIntl()

  useEffect(() => {
    if (glosses) {
      setTranslations(glosses)
    }
  }, [glosses])

  useEffect(() => () => dispatch(clearTranslationAction()), [])

  if (!hiddenFeatures) return null

  const handleWordChange = (e) => {
    setWord(e.target.value)
  }

  const handleWordBlur = () => {
    if (word) {
      dispatch(
        getTranslationAction(
          capitalize(learningLanguage),
          word,
          capitalize(dictionaryLanguage),
        ),
      )
    }
  }

  const handleHintChange = (e) => {
    setHint(e.target.value)
  }

  const handleHintSave = () => {
    if (hint) {
      setHints(hints.concat(hint))
      setHint('')
    }
  }

  const handleHintDelete = (selectedHint) => {
    setHints(hints.filter(h => h !== selectedHint))
  }

  const handleTranslationChange = (e) => {
    setTranslation(e.target.value)
  }

  const handleTranslationSave = () => {
    if (translation) {
      setTranslations(translations.concat(translation))
      setTranslation('')
    }
  }

  const handleTranslationKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTranslationSave()
    }
  }

  const handleTranslationDelete = (selectedTranslation) => {
    setTranslations(translations.filter(t => t !== selectedTranslation))
  }

  const handleSave = () => {
    const cardObject = {
      word,
      glosses: translations,
      hints,
    }
    dispatch(createFlashcard(learningLanguage, dictionaryLanguage, cardObject))
    setWord('')
    setHint('')
    setHints([])
    setTranslation('')
    setTranslations([])
    setFlipped(false)
  }

  const asListItems = (values, handleDelete) => values.map((value, index) => (
    /* eslint-disable-next-line */
    <li key={`${value}-${index}`} className="test">
      {value}
      <Icon
        name="close"
        color="grey"
        style={{ textShadow: 'none', lineHeight: '1.5rem', cursor: 'pointer' }}
        onClick={() => handleDelete(value)}
      />
    </li>
  ))

  return (
    <div className="component-container">
      <ReactCardFlip isFlipped={flipped}>
        <div className="flashcard">
          <div className="padding-top-2 padding-bottom-4">
            <label htmlFor="newWord" className="header-3 center">
              <FormattedMessage id="new-word" />
            </label>
            <Form.Control
              id="newWord"
              type="text"
              value={word}
              onChange={handleWordChange}
              onBlur={handleWordBlur}
            />
          </div>
          <div className="flex-column padding-bottom-1 auto-overflow">
            <label htmlFor="hints" className="header-3 center">
              <FormattedMessage id="hints-for-this-flashcard" />
            </label>
            <div className="auto-overflow">
              <ul>
                {asListItems(hints, handleHintDelete)}
              </ul>
            </div>
            <Form.Control
              className="flex-static-size margin-top-1"
              id="hints"
              as="textarea"
              placeholder={intl.formatMessage({ id: 'type-new-hint' })}
              value={hint}
              onChange={handleHintChange}
            />
            <Button
              variant="outline-primary"
              className="flashcard-button margin-top-1"
              onClick={handleHintSave}
            >
              <FormattedMessage id="save-the-hint" />
            </Button>
          </div>
          <div className="flashcard-footer">
            <button
              className="flashcard-blended-input"
              type="button"
              onClick={() => setFlipped(true)}
            >
              <FormattedMessage id="Translations" />
              {'  '}
              <Icon name="arrow right" />
            </button>
          </div>
        </div>
        <div className="flashcard">
          <label htmlFor="newTranslation" className="header-3 center padding-top-2">
            <FormattedMessage id="new-translations" />
          </label>
          <div className="auto-overflow margin-bottom-1">
            {pending
              ? (
                <div className="spinner-container">
                  <Spinner animation="border" variant="primary" size="lg" />
                </div>
              ) : (
                <ul>
                  {asListItems(translations, handleTranslationDelete)}
                </ul>
              )
            }
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
            variant="outline-primary"
            className="flashcard-button margin-top-1 margin-bottom-3"
            onClick={handleTranslationSave}
          >
            <FormattedMessage id="save-the-translation" />
          </Button>
          <Button
            variant="outline-success"
            className="flashcard-button margin-bottom-3 auto-top"
            onClick={handleSave}
          >
            <FormattedMessage id="submit-flashcard" />
          </Button>
          <div className="flashcard-footer margin-top-1">
            <button
              className="flashcard-blended-input"
              type="button"
              onClick={() => setFlipped(false)}
            >
              <FormattedMessage id="Flip" />
              {'  '}
              <Icon name="arrow right" />
            </button>
          </div>
        </div>
      </ReactCardFlip>
    </div>
  )
}

export default FlashcardCreation
