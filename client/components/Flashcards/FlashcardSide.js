import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import {
  learningLanguageSelector,
  dictionaryLanguageSelector,
  translatableLanguages,
} from 'Utilities/common'
import { getFlashcards } from 'Utilities/redux/flashcardReducer'
import { updateDictionaryLanguage } from 'Utilities/redux/userReducer'
import FlashcardInput from './FlashcardInput'
import FlashcardResult from './FlashcardResult'
import FlashcardHint from './FlashcardHint'
import FlashcardDelete from './FlashcardDelete'

const FlashcardSide = ({
  answerChecked,
  answerCorrect,
  checkAnswer,
  flipCard,
  cardIndex,
  stage,
  setSwipeIndex,
  noCards,
  children,
  hint,
  id,
}) => {
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

  const sameLanguage = learningLanguage === dictionaryLanguage

  const handleDropdownChange = async (value) => {
    setSwipeIndex(0)
    dispatch(updateDictionaryLanguage(value))
    dispatch(getFlashcards(learningLanguage, value, storyId))
  }

  return (
    <div className="flashcard" style={{ backgroundColor: backgroundColor[stage] }}>
      {!noCards
        ? (
          <div
            data-cy="flashcard-content"
            className="flashcard-content"
          >
            <div className="flashcard-header">
              {cardIndex}
              <FlashcardDelete id={id} />
            </div>
            <div className="flashcard-text-container">
              {children}
              <FlashcardHint hint={hint} />
            </div>
            {!sameLanguage
              && (
                <div className="flashcard-input-and-result-container">
                  <FlashcardInput
                    answerChecked={answerChecked}
                    checkAnswer={checkAnswer}
                  />
                  <FlashcardResult answerCorrect={answerCorrect} />
                </div>
              )
            }
          </div>
        ) : (
          <div
            data-cy="no-flashcards-text"
            className="flashcard-text-container"
          >
            <p>
              <FormattedMessage id="no-flashcards-yet-when-you-practice-a-story-and-click-on-unfamiliar-words-they-will-be-added-to-your" />
            </p>
          </div>
        )
      }
      <div className="flashcard-footer">
        <select
          defaultValue={dictionaryLanguage}
          style={{}}
          onChange={e => handleDropdownChange(e.target.value)}
        >
          {dictionaryOptions.map(option => <option key={option.key}>{option.text}</option>)}
        </select>
        {!noCards
          && (
            <button
              className="flashcard-blended-input"
              type="button"
              onClick={() => flipCard()}
            >
              <FormattedMessage id="Flip" />
              {'  '}
              <Icon name="arrow right" />
            </button>
          )
        }
      </div>

    </div>
  )
}

export default FlashcardSide
