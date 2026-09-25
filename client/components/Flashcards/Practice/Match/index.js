import React, { useState, useEffect, useMemo, useRef } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import AppButton from 'Components/AppButton'
import { addToCorrectAnswers, addToTotal } from 'Utilities/redux/flashcardReducer'
import { finalConfettiRain } from 'Utilities/common'

const WRONG_FLASH_MS = 700

// Fisher-Yates; returns a new array so the deck in redux is never reordered in place.
const shuffle = items => {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const describe = card => (Array.isArray(card.glosses) ? card.glosses.join(', ') : card.glosses)

// Matching deck: terms and descriptions in two independently shuffled columns. Pick one from each
// side to pair them; the backend records every attempt as the `match` exercise.
const Match = ({ cards, postAnswer, onCompleted, handleNewDeck }) => {
  const [selected, setSelected] = useState(null)
  const [matched, setMatched] = useState([])
  const [wrong, setWrong] = useState([])
  const wrongTimer = useRef(null)
  const dispatch = useDispatch()

  // Two independent shuffles so the columns never line up; reshuffled only when the deck changes.
  const terms = useMemo(() => shuffle(cards), [cards])
  const descriptions = useMemo(() => shuffle(cards), [cards])
  console.log('descriptions', descriptions)

  useEffect(() => {
    setSelected(null)
    setMatched([])
    setWrong([])
  }, [cards])

  useEffect(() => () => clearTimeout(wrongTimer.current), [])

  const complete = cards.length > 0 && matched.length === cards.length

  useEffect(() => {
    if (!complete) return
    finalConfettiRain(['#bb0000', '#ffffff'], Date.now() + 2 * 1000)
    if (onCompleted) onCompleted()
  }, [complete])

  const resolvePair = (termId, glossId) => {
    const termCard = cards.find(card => card._id === termId)
    const glossCard = cards.find(card => card._id === glossId)
    const correct = termId === glossId

    postAnswer(termCard, {
      answer: describe(glossCard),
      correct,
      exercise: 'match',
      mode: null,
    })
    setSelected(null)
    dispatch(addToTotal())

    if (correct) {
      setMatched(previous => [...previous, termId])
      dispatch(addToCorrectAnswers())
      return
    }

    setWrong([termId, glossId])
    clearTimeout(wrongTimer.current)
    wrongTimer.current = setTimeout(() => setWrong([]), WRONG_FLASH_MS)
  }

  // Same side moves the selection (or clears it when re-picked); the other side resolves a pair.
  const handlePick = (side, card) => {
    if (matched.includes(card._id)) return
    if (selected && selected.side === side && selected.id === card._id) {
      setSelected(null)
      return
    }
    if (!selected || selected.side === side) {
      setSelected({ side, id: card._id })
      return
    }

    const termId = side === 'term' ? card._id : selected.id
    const glossId = side === 'gloss' ? card._id : selected.id
    resolvePair(termId, glossId)
  }

  const itemClass = (side, card) => {
    const base = 'flashcard-match-item'
    if (matched.includes(card._id)) {
      return `${base} ${base}--matched`
    }
    if (wrong.includes(card._id)) {
      return `${base} ${base}--wrong`
    }
    if (selected && selected.side === side && selected.id === card._id) {
      return `${base} ${base}--selected`
    }
    return base
  }

  const renderColumn = (side, items, titleId, cyPrefix) => (
    <div className="flashcard-match-column">
      <div className="flashcard-match-column-title">
        <FormattedMessage id={titleId} />
      </div>
      {items.map(card => (
        <button
          key={card._id}
          type="button"
          className={itemClass(side, card)}
          data-cy={`${cyPrefix}-${card._id}`}
          onClick={() => handlePick(side, card)}
          disabled={matched.includes(card._id)}
        >
          {side === 'term' ? card.lemma : describe(card)}
        </button>
      ))}
    </div>
  )

  return (
    <div className="flashcard-match" data-cy="flashcard-match-board">
      <div className="flashcard-match-board">
        {renderColumn('term', terms, 'flashcard-match-terms', 'flashcard-match-term')}
        {renderColumn(
          'gloss',
          descriptions,
          'flashcard-match-descriptions',
          'flashcard-match-gloss',
        )}
      </div>

      <div className="flashcard-match-footer">
        <span data-cy="flashcard-match-progress">
          <FormattedMessage id="flashcard-match-progress" /> {matched.length} / {cards.length}
        </span>
        {complete && (
          <AppButton variant="primary" data-cy="flashcard-match-new-deck" onClick={handleNewDeck}>
            <FormattedMessage id="next-card-deck" />
          </AppButton>
        )}
      </div>
    </div>
  )
}

export default Match
