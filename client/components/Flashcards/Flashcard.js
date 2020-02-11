import React, { useState, useEffect } from 'react'
import { Icon } from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import FlashcardText from './FlashcardText'
import FlashcardInput from './FlashcardInput'
import FlashcardResult from './FlashcardResult'

const Flashcard = ({ card }) => {
  const [flipped, setFlipped] = useState(false)
  const [answerChecked, setAnswerChecked] = useState(false)
  const [answerCorrect, setAnswerCorrect] = useState(null)
  const intl = useIntl()

  useEffect(() => {
    setFlipped(false)
    setAnswerChecked(false)
    setAnswerCorrect(null)
  }, [card])

  const flipCard = () => {
    setFlipped(!flipped)
    setAnswerChecked(true)
  }

  return (
    <div id="flashcard">
      <FlashcardText card={card} flipped={flipped} />
      <div id="flashcardInputAndResultContainer">
        <FlashcardInput
          flipCard={flipCard}
          card={card}
          answerChecked={answerChecked}
          setAnswerCorrect={setAnswerCorrect}
        />
        <FlashcardResult answerCorrect={answerCorrect} />
      </div>
      <div id="flashcardFlipContainer">
        <button
          id="flashcardFlip"
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

export default Flashcard
