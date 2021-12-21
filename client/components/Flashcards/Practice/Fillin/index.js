import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import ReactCardFlip from 'react-card-flip'
import { updateFlashcard } from 'Utilities/redux/flashcardReducer'
import { levenshteinDistance, normalizeDiacritics } from 'Utilities/common'
import { useIntl } from 'react-intl'
import FlashcardFront from './FlashcardFront'
import FlashcardBack from './FlashcardBack'
import Template from '../../Template'

const Fillin = ({
  card,
  cardNumbering,
  setSwipeIndex,
  focusedAndBigScreen,
  swipeIndex,
  editing,
  setEditing,
  answerCard,
}) => {
  const [flipped, setFlipped] = useState(false)
  const [answerChecked, setAnswerChecked] = useState(false)
  const [answerCorrect, setAnswerCorrect] = useState(null)
  const [hints, setHints] = useState(card.hint.map(h => h.hint))
  const [translations, setTranslations] = useState(card.glosses)
  const [infoMessage, setInfoMessage] = useState('')

  const dispatch = useDispatch()
  const intl = useIntl()

  const { glosses, format, _id: id, stage, lemma, phonetics } = card

  const getRemovedHints = () => card.hint.filter(h => !hints.includes(h.hint))
  const getNewHints = unsavedHint => {
    const newSavedHints = hints.filter(h => !card.hint.some(oh => oh.hint === h))
    return unsavedHint ? newSavedHints.concat(unsavedHint) : newSavedHints
  }

  const saveCard = unsavedHint => {
    dispatch(updateFlashcard(id, getRemovedHints(), getNewHints(unsavedHint), translations))
    setAnswerChecked(true)
    setEditing(false)
    if (unsavedHint) setHints(hints.concat(unsavedHint))
  }

  const clearEdit = () => {
    setHints(card.hint.map(h => h.hint))
    setTranslations(card.glosses)
    setAnswerChecked(true)
    setEditing(false)
  }

  const flipCard = () => {
    setFlipped(!flipped)
    setAnswerChecked(true)
  }

  const handleEdit = () => {
    setEditing(true)
  }

  const checkAnswer = answer => {
    if (answer !== '') {
      let correct = glosses.some(
        gloss => gloss.toLowerCase().trim() === answer.toLowerCase().trim()
      )

      const normalizedAnswer = normalizeDiacritics(answer)

      const normalizedCorrect = glosses.find(
        gloss =>
          normalizeDiacritics(gloss).toLowerCase().trim() === normalizedAnswer.toLowerCase().trim()
      )

      const levenshteinCorrect = glosses.find(
        gloss =>
          levenshteinDistance(gloss.toLowerCase().trim(), normalizedAnswer.toLowerCase().trim()) ===
          1
      )

      // Accept if error just in diacritics
      if (!correct && normalizedCorrect) {
        correct = true
        const msg = intl.formatMessage(
          { id: 'pay-attention-to-diacritics' },
          { answer, normalizedCorrect }
        )
        setInfoMessage(msg)
      }

      // Or edit distance is 1
      if (!correct && !normalizedCorrect && levenshteinCorrect) {
        correct = true
        const msg = intl.formatMessage(
          { id: 'pay-attention-to-spelling' },
          { answer, levenshteinCorrect }
        )
        setInfoMessage(msg)
      }

      answerCard(answer, correct, 'fillin')
      setAnswerCorrect(correct)
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
    handleEdit,
    lemma,
    phonetics,
  }

  if (editing) {
    return (
      <Template
        word={card.lemma}
        translations={translations}
        hints={hints}
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
        {...cardProps}
      />
      <FlashcardBack
        glosses={translations}
        flipped={flipped}
        swipeIndex={swipeIndex}
        infoMessage={infoMessage}
        {...cardProps}
      />
    </ReactCardFlip>
  )
}

export default Fillin
