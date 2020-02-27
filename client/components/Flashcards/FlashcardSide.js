import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import {
  learningLanguageSelector,
  dictionaryLanguageSelector,
  translatableLanguages,
} from 'Utilities/common'
import { getFlashcards } from 'Utilities/redux/flashcardReducer'
import { updateDictionaryLanguage } from 'Utilities/redux/userReducer'
import FlashcardInput from './FlashcardInput'
import FlashcardResult from './FlashcardResult'

const FlashcardSide = ({
  answerChecked,
  answerCorrect,
  checkAnswer,
  flipCard,
  cardIndex,
  stage,
  children,
}) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { storyId } = useParams()

  const dictionaryOptions = translatableLanguages[learningLanguage].map(element => ({
    key: element,
    value: element,
    text: element,
  }))


  const backgroundColor = [
    'rgb(255, 99, 71)',
    'rgb(255, 165, 0)',
    'rgb(255, 215, 0)',
    'yellowgreen',
    'limegreen',
  ]

  const handleDropdownChange = (value) => {
    dispatch(updateDictionaryLanguage(value))
    dispatch(getFlashcards(learningLanguage, value, storyId))
  }

  return (
    <div className="flashcard" style={{ backgroundColor: backgroundColor[stage] }}>
      <div className="flashcard-header">{cardIndex}</div>
      <div className="flashcard-text-container">
        {children}
      </div>
      <div className="flashcard-input-and-result-container">
        <FlashcardInput
          answerChecked={answerChecked}
          checkAnswer={checkAnswer}
        />
        <FlashcardResult answerCorrect={answerCorrect} />
      </div>
      <div className="flashcard-footer">
        <select
          defaultValue={dictionaryLanguage}
          style={{}}
          onChange={e => handleDropdownChange(e.target.value)}
        >
          {dictionaryOptions.map(option => <option key={option.key}>{option.text}</option>)}
        </select>
        <button
          variant="light"
          type="button"
          onClick={() => flipCard()}
        >
          {`${intl.formatMessage({ id: 'Flip' })}   `}
          <Icon name="arrow right" />
        </button>
      </div>
    </div>
  )
}

export default FlashcardSide
