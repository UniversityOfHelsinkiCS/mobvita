import React from 'react'
import Flashcard from './Flashcard'

const Flashcards = () => {
  const word = {
    root: 'jäsä',
    translations: [
      'javascript',
    ],
  }

  return <Flashcard word={word} />
}

export default Flashcards
