import React from 'react'

const FlashcardText = ({ card, flipped }) => {
  const { glosses, lemma } = card

  const translations = Array.isArray(glosses)
    ? glosses.map(item => <li key={item}>{item}</li>)
    : glosses

  const content = flipped ? <ul id="flashcardTranslations">{translations}</ul> : <h2>{lemma}</h2>

  return (
    <div id="flashcardTextContainer">
      <div id="flashcardText">
        {content}
      </div>
    </div>
  )
}

export default FlashcardText
