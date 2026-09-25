import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useIntl } from 'react-intl'
import ReactCardFlip from 'react-card-flip'
import { addToCorrectAnswers } from 'Utilities/redux/flashcardReducer'
import {
  levenshteinDistance,
  normalizeDiacritics,
  confettiRain,
  finalConfettiRain,
  learningLanguageSelector,
} from 'Utilities/common'
import FlashcardInput from '../Fillin/FlashcardInput'
import FlashcardResult from '../Fillin/FlashcardResult'
import FlashcardBack from '../Fillin/FlashcardBack'
import Flashcard from '../Flashcard'

// Front of a reversed card: the description is the prompt and the learner types the term. It keeps
// the input even when both languages match, which the regular front hides — Finnish terms are
// defined in Finnish, so that gate would leave nothing to answer with.
const ReversedFront = ({
  glosses,
  answerChecked,
  answerCorrect,
  checkAnswer,
  focusedAndBigScreen,
  ...props
}) => {
  // Shared with the assistant, which reveals the same hints — see revealFlashcardHint.
  const displayedHints = useSelector(({ flashcards }) => flashcards.revealedHints)
  // The answer is the term itself, so the prompt names the learning language, not the dictionary.
  const learningLanguage = useSelector(learningLanguageSelector)
  const descriptions = Array.isArray(glosses) ? [...new Set(glosses)] : [glosses]

  return (
    <Flashcard {...props}>
      <div className="flashcard-text-container">
        <div className="flashcard-translations" data-cy="flashcard-reversed-description">
          <ul>
            {descriptions.map(description => (
              <li key={description}>{description}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flashcard-input-and-result-container">
        <FlashcardInput
          answerChecked={answerChecked}
          checkAnswer={checkAnswer}
          focusedAndBigScreen={focusedAndBigScreen}
          displayedHints={displayedHints}
          answerLanguage={learningLanguage}
        />
        <FlashcardResult answerCorrect={answerCorrect} />
      </div>
    </Flashcard>
  )
}

// Reversed deck (fillin_learn): read the description, type the term. Answers post as the fillin
// exercise in "learn" mode, which is how the backend tells the two directions apart.
const Reversed = ({
  card,
  cardNumbering,
  setSwipeIndex,
  focusedAndBigScreen,
  swipeIndex,
  handleIndexChange,
  answerCard,
  deckSize,
}) => {
  const [flipped, setFlipped] = useState(false)
  const [answerChecked, setAnswerChecked] = useState(false)
  const [answerCorrect, setAnswerCorrect] = useState(null)
  const [infoMessage, setInfoMessage] = useState('')
  const dispatch = useDispatch()
  const intl = useIntl()

  const { glosses, format, _id: id, stage, lemma } = card

  useEffect(() => {
    card.correct = answerCorrect

    if (answerCorrect === true) {
      dispatch(addToCorrectAnswers())
    }
  }, [answerCorrect])

  const flipCard = () => {
    setFlipped(!flipped)
    setAnswerChecked(true)
  }

  // Same leniency as the regular deck, but graded against the lemma instead of the glosses.
  const gradeAnswer = answer => {
    const trimmed = answer.toLowerCase().trim()
    if (lemma.toLowerCase().trim() === trimmed) return { correct: true }

    const normalizedAnswer = normalizeDiacritics(answer).toLowerCase().trim()
    if (normalizeDiacritics(lemma).toLowerCase().trim() === normalizedAnswer) {
      return {
        correct: true,
        message: intl.formatMessage(
          { id: 'pay-attention-to-diacritics' },
          { answer, normalizedCorrect: lemma },
        ),
      }
    }

    if (levenshteinDistance(lemma.toLowerCase().trim(), normalizedAnswer) === 1) {
      return {
        correct: true,
        message: intl.formatMessage(
          { id: 'pay-attention-to-spelling' },
          { answer, levenshteinCorrect: lemma },
        ),
      }
    }

    return { correct: false }
  }

  const checkAnswer = (answer, displayedHints) => {
    if (answer !== '') {
      const { correct, message } = gradeAnswer(answer)
      if (message) setInfoMessage(message)

      answerCard(answer, correct, 'fillin', displayedHints, 'learn')
      setAnswerCorrect(correct)

      if (correct && swipeIndex === deckSize - 1) {
        const endDate = Date.now() + 2 * 1000
        finalConfettiRain(['#bb0000', '#ffffff'], endDate)
      } else if (correct) {
        confettiRain()
      }
    }

    // Hack to get the thumbs up/down icon to render before card flips
    setAnswerChecked(true)
    setTimeout(() => setFlipped(!flipped), 50)
  }

  const cardProps = {
    cardNumbering,
    setSwipeIndex,
    stage,
    format,
    id,
    answerCorrect,
    flipCard,
    focusedAndBigScreen,
    lemma,
  }

  return (
    <ReactCardFlip isFlipped={flipped}>
      <ReversedFront
        glosses={glosses}
        answerChecked={answerChecked}
        checkAnswer={checkAnswer}
        {...cardProps}
      />
      <FlashcardBack
        glosses={glosses}
        flipped={flipped}
        swipeIndex={swipeIndex}
        handleIndexChange={handleIndexChange}
        infoMessage={infoMessage}
        {...cardProps}
      />
    </ReactCardFlip>
  )
}

export default Reversed
