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

  const [currentCard, setCurrentCard] = useState(null)

  useEffect(() => {
    dispatch(getFlashcards(learningLanguage, dictionaryLanguage))
  }, [])

  useEffect(() => {
    if (cards) setCurrentCard(sample(cards.all))
  }, [cards])

  if (pending || !currentCard) {
    return <div>loading</div>
  }


  const word = {
    root: currentCard.lemma,
    translations: currentCard.glosses,
  }

  return (
    <>
      <Flashcard word={word} />
      <Button variant="primary" onClick={() => setCurrentCard(sample(cards.all))}>
        Random card
      </Button>
    </>
  )
}

export default Flashcards
