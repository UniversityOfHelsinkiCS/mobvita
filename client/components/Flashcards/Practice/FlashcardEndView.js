import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { getIncompleteStories } from 'Utilities/redux/incompleteStoriesReducer'
import { answerBluecards, getStoriesBlueFlashcards } from 'Utilities/redux/flashcardReducer'
import { learningLanguageSelector, dictionaryLanguageSelector } from 'Utilities/common'
import FlashcardsEncouragement from 'Components/Encouragements/FlashcardsEncouragement'

const FlashcardEndView = ({ handleNewDeck, deckSize, open, setOpen, blueCardsAnswered }) => {
  // A bit hacky way to move to next deck with right arrow or enter
  const { correctAnswers, totalAnswers, storyBlueCards, storyCardsPending } = useSelector(
    ({ flashcards }) => flashcards
  )
  const dispatch = useDispatch()
  const { incomplete, loading } = useSelector(({ incomplete }) => ({
    incomplete: incomplete.data,
    loading: incomplete.pending,
  }))
  const { enable_recmd, vocabulary_seen, pending } = useSelector(({ user }) => user.data.user)
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const [latestStories, setLatestStories] = useState([])
  const [prevBlueCards, setPrevBlueCards] = useState(null)
  const { storyId } = useParams()

  const useKeyPress = targetKey => {
    const [keyPressed, setKeyPressed] = useState(false)
    function downHandler({ key }) {
      if (key === targetKey) setKeyPressed(true)
    }

    const upHandler = ({ key }) => {
      if (key === targetKey) setKeyPressed(false)
    }

    useEffect(() => {
      setTimeout(() => {
        window.addEventListener('keydown', downHandler)
        window.addEventListener('keyup', upHandler)
      }, 2000)

      return () => {
        window.removeEventListener('keydown', downHandler)
        window.removeEventListener('keyup', upHandler)
      }
    }, [])

    return keyPressed
  }

  const RightArrowPress = useKeyPress('ArrowRight')
  const EnterPress = useKeyPress('Enter')

  if ((RightArrowPress || EnterPress) && !open) {
    handleNewDeck()
  }

  return (
    <div className="flashcard justify-center">
      <div>
      </div>
      <p style={{ fontWeight: '500', fontSize: '1.2em', padding: '1em' }}>
        <FormattedMessage id="well-done-flashcards" />
      </p>
      <div className="flashcard-input" style={{ flex: 0 }}>
        <Link to="/">
          <Button className="flashcard-button" block variant="outline-primary">
            <FormattedMessage id="return-to-main-page" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default FlashcardEndView
