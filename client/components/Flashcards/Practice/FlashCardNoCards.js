import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
import React from 'react'

import SelectLanguage from '../SelectLanguage'

const FlashcardNoCards = ({ setSwipeIndex }) => (
  <div className="flashcard auto">
    <div data-cy="no-flashcards-text" className="flashcard-no-cards">
      <p>
        <FormattedHTMLMessage id="no-flashcards-yet-when-you-practice-a-story-and-click-on-unfamiliar-words-they-will-be-added-to-your" />
      </p>
    </div>
    <div
      className="flashcard-footer"
      style={{
        display: 'flex',
        flexShrink: 0,
        justifyContent: 'center',
        paddingTop: '1em',
        paddingBottom: '2.5em',
      }}
    >
      <SelectLanguage setSwipeIndex={setSwipeIndex} />
    </div>
  </div>
)

export default FlashcardNoCards
