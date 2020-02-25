import React from 'react'
import { Icon } from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import FlashcardInput from './FlashcardInput'
import FlashcardResult from './FlashcardResult'

const FlashcardSide = ({ answerChecked, answerCorrect, checkAnswer, flipCard, cardIndex, children }) => {
  const intl = useIntl()

  return (
    <div className="flashcard">
      <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>{cardIndex}</div>
      <div className="flashcardTextContainer">
        <div className="flashcardText">
          {children}
        </div>
      </div>
      <div className="flashcardInputAndResultContainer">
        <FlashcardInput
          answerChecked={answerChecked}
          checkAnswer={checkAnswer}
        />
        <FlashcardResult answerCorrect={answerCorrect} />
      </div>
      <div className="flashcardFlipContainer">
        <button
          className="flashcardFlip"
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
