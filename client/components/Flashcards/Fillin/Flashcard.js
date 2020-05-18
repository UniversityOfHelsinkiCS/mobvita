import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactCardFlip from 'react-card-flip'
import { recordFlashcardAnswer, updateFlashcard } from 'Utilities/redux/flashcardReducer'
import FlashcardTemplate from '../FlashcardTemplate'
import FlashcardFront from './FlashcardFront'
import FlashcardBack from './FlashcardBack'
import Template from '../Template'

const Flashcard = ({ card, cardIndex, setSwipeIndex, focusedAndBigScreen, swipeIndex }) => {
  const [flipped, setFlipped] = useState(false)
  const [editing, setEditing] = useState(false)
  const [answerChecked, setAnswerChecked] = useState(false)
  const [answerCorrect, setAnswerCorrect] = useState(null)
  const [word, setWord] = useState(card.lemma)
  const [hints, setHints] = useState(card.hint.map(h => h.hint))
  const [translations, setTranslations] = useState(card.glosses)

  const { sessionId } = useSelector(({ flashcards }) => flashcards)

  const dispatch = useDispatch()

  useEffect(() => {
    setFlipped(false)
    setAnswerChecked(false)
    setAnswerCorrect(null)
  }, [card])

  const {
    glosses,
    format,
    lemma,
    _id: id,
    story,
    lan_in: inputLanguage,
    lan_out: outputLanguage,
    stage,
  } = card

  const getRemovedHints = () => card.hint.filter(h => !hints.includes(h.hint))
  const getNewHints = () => hints.filter(h => !card.hint.some(ch => ch.hint === h))

  const saveCard = () => {
    dispatch(updateFlashcard(id, getRemovedHints(), getNewHints(), translations))
    setAnswerChecked(true)
    setEditing(false)
  }

  const clearEdit = () => {
    setWord(card.lemma)
    setHints(card.hint.map(h => h.hint))
    setTranslations(card.glosses)
    setEditing(false)
  }

  const flipCard = () => {
    setFlipped(!flipped)
    setAnswerChecked(true)
  }

  const handleEdit = () => {
    setEditing(true)
  }

  const checkAnswer = (answer) => {
    if (answer !== '') {
      const correct = glosses.includes(answer.toLowerCase()).toString()
      const answerDetails = {
        flashcard_id: id,
        correct,
        answer,
        exercise: 'fillin',
        mode: 'trans',
        story,
        lemma,
        session_id: sessionId,
      }
      dispatch(recordFlashcardAnswer(inputLanguage, outputLanguage, answerDetails))
      setAnswerCorrect(correct)
    }
    flipCard()
  }

  const cardProps = {
    cardIndex,
    setSwipeIndex,
    stage,
    format,
    id,
    answerCorrect,
    flipCard,
    focusedAndBigScreen,
    handleEdit,
  }

  if (editing) {
    return (
      <Template
        word={word}
        translations={translations}
        hints={hints}
        setWord={setWord}
        setTranslations={setTranslations}
        setHints={setHints}
        saveAction={saveCard}
        clearAction={clearEdit}
        editing
      />
    )
  }

  return (
    <ReactCardFlip isFlipped={flipped}>
      <FlashcardFront
        answerChecked={answerChecked}
        checkAnswer={checkAnswer}
        hints={hints}
        lemma={word}
        {...cardProps}
      />
      <FlashcardBack
        glosses={translations}
        flipped={flipped}
        swipeIndex={swipeIndex}
        {...cardProps}
      />
    </ReactCardFlip>
  )
}

export default Flashcard
