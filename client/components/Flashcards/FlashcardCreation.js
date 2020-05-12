import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ReactCardFlip from 'react-card-flip'
import { Form } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import {
  learningLanguageSelector,
  dictionaryLanguageSelector,
  hiddenFeatures,
} from 'Utilities/common'
import { createFlashcard } from 'Utilities/redux/flashcardReducer'

const FlashcardCreation = () => {
  const [flipped, setFlipped] = useState(false)
  const [word, setWord] = useState('')
  const [hints, setHints] = useState([])
  const [hint, setHint] = useState('')
  const [translations, setTranslations] = useState([])
  const [translation, setTranslation] = useState('')

  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)

  const dispatch = useDispatch()

  if (!hiddenFeatures) return null

  const handleWordChange = (e) => {
    setWord(e.target.value)
  }

  const handleHintChange = (e) => {
    setHint(e.target.value)
  }

  const handleHintSave = () => {
    setHints(hints.concat(hint))
    setHint('')
  }

  const handleHintDelete = (hint) => {
    setHints(hints.filter(h => h !== hint))
  }

  const handleTranslationChange = (e) => {
    setTranslation(e.target.value)
  }

  const handleTranslationSave = () => {
    setTranslations(translations.concat(translation))
    setTranslation('')
  }

  const handleTranslationDelete = (translation) => {
    setTranslations(translations.filter(t => t !== translation))
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

  const asListItems = (values, handleDelete) => values.map(value => (
    <li key={value}>
      {value}
      <Icon name="close" onClick={() => handleDelete(value)} />
    </li>
  ))

  return (
    <ReactCardFlip isFlipped={flipped}>
      <div className="flashcard">
        <span>
          <FormattedMessage id="new-word" />
        </span>
        <Form.Control type="text" value={word} onChange={handleWordChange} />
        <span>
          <FormattedMessage id="hints-for-this-flashcard" />
        </span>
        <ul>
          {asListItems(hints, handleHintDelete)}
        </ul>
        <Form.Control as="textarea" value={hint} onChange={handleHintChange} />
        <button type="button" onClick={handleHintSave} disabled={!hint}>
          <FormattedMessage id="save-the-hint" />
        </button>
        <div className="flashcard-footer">
          <button
            className="flashcard-blended-input"
            type="button"
            onClick={() => setFlipped(true)}
          >
            <FormattedMessage id="Translations" />
            <Icon name="arrow right" />
          </button>
        </div>
      </div>
      <div className="flashcard">
        <span>
          <FormattedMessage id="new-translations" />
        </span>
        <ul>
          {asListItems(translations, handleTranslationDelete)}
        </ul>
        <Form.Control type="text" value={translation} onChange={handleTranslationChange} />
        <button type="button" onClick={handleTranslationSave} disabled={!translation}>
          <FormattedMessage id="save-the-translation" />
        </button>
        <button type="button" onClick={handleSave}>
          <FormattedMessage id="save" />
        </button>
        <div className="flashcard-footer">
          <button
            className="flashcard-blended-input"
            type="button"
            onClick={() => setFlipped(false)}
          >
            <FormattedMessage id="Flip" />
            <Icon name="arrow right" />
          </button>
        </div>
      </div>
    </ReactCardFlip>
  )
}

export default FlashcardCreation
