import React, { useEffect, useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { images } from 'Utilities/common'
import { colors } from 'Assets/mui_theme/designTokens'
import FlashcardResult from './FlashcardResult'
import Flashcard from '../Flashcard'
import WordNestLauncher from 'Components/WordNestModal/WordNestLauncher'

// The green "Word Nest" pill used on the flashcard (design-only styling passed to the shared launcher).
export const WORDNEST_PILL_STYLE = {
  display: 'inline-flex',
  alignItems: 'center',
  backgroundColor: colors.green,
  color: colors.ink,
  border: 'none',
  outline: 'none',
  boxShadow: 'none',
  borderRadius: 999,
  padding: '7px 16px',
  fontWeight: 600,
  fontSize: 14,
}

const FlashcardBack = ({
  answerCorrect,
  glosses,
  focusedAndBigScreen,
  flipped,
  swipeIndex,
  infoMessage,
  lemma,
  handleIndexChange,
  translation,
  ...props
}) => {
  const handleEnter = useCallback(event => {
    if (event.keyCode === 13) {
      handleIndexChange(swipeIndex + 1)
    }
  })

  useEffect(() => {
    if (focusedAndBigScreen && flipped) {
      document.addEventListener('keydown', handleEnter, false)

      return () => {
        document.removeEventListener('keydown', handleEnter, false)
      }
    }
  }, [focusedAndBigScreen, flipped])

  const translations = Array.isArray(glosses)
    ? [...new Set(glosses)].map(item => <li key={item}>{item}</li>)
    : glosses

  return (
    <Flashcard {...props}>
      <span
        style={{
          display: 'block',
          textAlign: 'center',
          fontWeight: 600,
          fontSize: '20px',
          paddingBottom: '1em',
          paddingTop: '1em',
          flexShrink: 0,
        }}
      >
        {lemma}
      </span>
      {infoMessage && <div className="justify-center">{infoMessage}</div>}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75em' }}>
        <WordNestLauncher
          lemma={lemma}
          translation={translation}
          icon={images.wordnest}
          label={<FormattedMessage id="word-nest" defaultMessage="Word Nest" />}
          buttonStyle={WORDNEST_PILL_STYLE}
          divStyle={{ display: 'inline-flex' }}
        />
      </div>
      <div className="flashcard-text-container">
        <div className="flashcard-translations">
          <ul>{translations}</ul>
        </div>
      </div>
      <div className="flashcard-input-and-result-container">
        <FlashcardResult answerCorrect={answerCorrect} />
      </div>
    </Flashcard>
  )
}
export default FlashcardBack
