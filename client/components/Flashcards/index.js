import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFlashcards } from 'Utilities/redux/flashcardReducer'
import { Button } from 'react-bootstrap'
import { learningLanguageSelector, dictionaryLanguageSelector } from 'Utilities/common'
import { sample } from 'lodash'
import Flashcard from './Flashcard'

const Flashcards = () => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { cards, pending } = useSelector(({ flashcards }) => flashcards)
  const [flipped, setFlipped] = useState(false)

  const [currentCard, setCurrentCard] = useState(null)

  useEffect(() => {
    dispatch(getFlashcards(learningLanguage, dictionaryLanguage))
  }, [])

  useEffect(() => {
    if (cards) setCurrentCard(sample(cards.all))
  }, [cards])

  useEffect(() => {
    setFlipped(false)
  }, [currentCard])

  if (pending || !currentCard) {
    return <div>loading</div>
  }

  const changeCard = () => {
    setFlipped(false)
    setCurrentCard(sample(cards.all))
  }

  return (
    <>
      <Flashcard card={currentCard} flipped={flipped} setFlipped={setFlipped} />
      <Button variant="primary" onClick={() => changeCard()}>
        Random card
      </Button>
    </>
  )
}

export default Flashcards
