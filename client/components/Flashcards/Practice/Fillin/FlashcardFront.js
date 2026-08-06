import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { learningLanguageSelector, dictionaryLanguageSelector, images } from 'Utilities/common'
import FlashcardInput from './FlashcardInput'
import FlashcardResult from './FlashcardResult'
import FlashcardHint from './FlashcardHint'
import Flashcard from '../Flashcard'
import WordNestLauncher from 'Components/WordNestModal/WordNestLauncher'
import { WORDNEST_PILL_STYLE } from './FlashcardBack'

const FlashcardFront = ({
  answerChecked,
  answerCorrect,
  checkAnswer,
  hints,
  lemma,
  phonetics,
  focusedAndBigScreen,
  stage,
  translation,
  ...props
}) => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const sameLanguage = learningLanguage === dictionaryLanguage
  const fontClass = lemma.length < 15 ? 'flashcard-title' : 'flashcard-title-small'
  const [displayedHints, setDisplayedHints] = useState([])

  return (
    <Flashcard stage={stage} {...props}>
      <div className="flashcard-text-container">
        <h2 data-cy="flashcard-title" className={fontClass}>
          {lemma}
        </h2>
        <h3 className="flashcard-phonetics">{phonetics && phonetics}</h3>
      </div>
      <FlashcardHint
        lemma={lemma}
        hints={hints}
        stage={stage}
        displayedHints={displayedHints}
        setDisplayedHints={setDisplayedHints}
      />
      {!sameLanguage && (
        <div className="flashcard-input-and-result-container">
          <FlashcardInput
            answerChecked={answerChecked}
            checkAnswer={checkAnswer}
            focusedAndBigScreen={focusedAndBigScreen}
            displayedHints={displayedHints}
          />
          <FlashcardResult answerCorrect={answerCorrect} />
        </div>
      )}
      {answerChecked && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.75em' }}>
          <WordNestLauncher
            lemma={lemma}
            translation={translation}
            className="pop-in-word-nest"
            icon={images.wordnest}
            label={<FormattedMessage id="word-nest" defaultMessage="Word Nest" />}
            buttonStyle={WORDNEST_PILL_STYLE}
            divStyle={{ display: 'inline-flex' }}
          />
        </div>
      )}
    </Flashcard>
  )
}

export default FlashcardFront
