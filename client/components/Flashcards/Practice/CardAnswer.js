import React from 'react'
import FlashcardResult from './Fillin/FlashcardResult'
import displayedTranslations from './displayedTranslations'

// The answer side of a card: verdict face, the word, then its translations. Shared so the quick
// deck's back reads exactly like the translate deck's and the blue-cards test's.
const CardAnswer = ({ answerCorrect, showVerdict, lemma, glosses, infoMessage }) => (
  <div className="flashcard-back">
    <div className="flashcard-result-slot">
      {showVerdict && <FlashcardResult answerCorrect={answerCorrect} size={80} />}
    </div>
    {infoMessage && <div className="flashcard-back-info">{infoMessage}</div>}
    <h3 className="flashcard-back-lemma">{lemma}</h3>
    <div className="flashcard-back-translations">
      <ul>
        {displayedTranslations(glosses).map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  </div>
)

export default CardAnswer
