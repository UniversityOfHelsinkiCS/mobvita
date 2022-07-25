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
  const { vocabularySeen } = useSelector(state => state.user.data.user)
  const { incomplete, loading } = useSelector(({ incomplete }) => ({
    incomplete: incomplete.data,
    loading: incomplete.pending,
  }))
  const { enable_recmd } = useSelector(({ user }) => user.data.user)
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const [latestStories, setLatestStories] = useState([])
  const [prevBlueCards, setPrevBlueCards] = useState(null)
  const { storyId } = useParams()

  useEffect(() => {
    dispatch(
      getIncompleteStories(learningLanguage, {
        sort_by: 'access',
      })
    )
    dispatch(getStoriesBlueFlashcards(learningLanguage, dictionaryLanguage))
  }, [])

  useEffect(() => {
    const filteredBlueCards = storyBlueCards.filter(story => story.story_id !== storyId)
    
    if (filteredBlueCards.length > 0) {
      setPrevBlueCards(filteredBlueCards[filteredBlueCards.length - 1])
    }
  }, [storyBlueCards])

  useEffect(() => {
    if (incomplete.length > 0) {
      const latestIncompleteStories = incomplete.filter(
        story => story.last_snippet_id !== story.num_snippets - 1
      )
      const previousStories = []
      for (
        let i = latestIncompleteStories.length - 1;
        i >= 0 && i >= latestIncompleteStories.length - 3;
        i--
      ) {
        previousStories.push(latestIncompleteStories[i])
      }

      setLatestStories(previousStories)
    }
  }, [incomplete])

  useEffect(() => {
    if (blueCardsAnswered.length === deckSize) {
      const answerObj = {
        flashcard_answers: blueCardsAnswered,
      }

      dispatch(answerBluecards(learningLanguage, dictionaryLanguage, answerObj))
    }
  }, [blueCardsAnswered])

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
        {totalAnswers === deckSize && !loading && !storyCardsPending && (
          <FlashcardsEncouragement
            open={open}
            setOpen={setOpen}
            correctAnswers={correctAnswers}
            deckSize={deckSize}
            enable_recmd={enable_recmd}
            handleNewDeck={handleNewDeck}
            vocabularySeen={vocabularySeen}
            latestStories={latestStories}
            prevBlueCards={prevBlueCards}
          />
        )}
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
