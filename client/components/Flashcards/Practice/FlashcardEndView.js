import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getIncompleteStories } from 'Utilities/redux/incompleteStoriesReducer'
import { learningLanguageSelector } from 'Utilities/common'
import FlashcardsEncouragement from 'Components/Encouragements/FlashcardsEncouragement'
import { last } from 'lodash'

const FlashcardEndView = ({ handleNewDeck, deckSize }) => {
  // A bit hacky way to move to next deck with right arrow or enter
  const { correctAnswers, totalAnswers } = useSelector(({ flashcards }) => flashcards)
  const { enable_recmd } = useSelector(({ user }) => user.data.user)
  const dispatch = useDispatch()
  const { vocabularySeen } = useSelector(state => state.user.data.user)
  const { incomplete, loading } = useSelector(({ incomplete }) => ({
    incomplete: incomplete.data,
    loading: incomplete.pending,
  }))
  const learningLanguage = useSelector(learningLanguageSelector)
  const [latestStories, setLatestStories] = useState([])

  console.log(correctAnswers, ' out of ', deckSize)

  useEffect(() => {
    dispatch(
      getIncompleteStories(learningLanguage, {
        sort_by: 'access',
      })
    )
  }, [])

  useEffect(() => {
    if (incomplete.length > 0) {
      const previousStories = []
      for (let i = incomplete.length - 1; i >= 0 && i >= incomplete.length - 3; i--) {
        previousStories.push(incomplete[i])
      }

      setLatestStories(previousStories)
    }
  }, [incomplete])

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
  const [open, setOpen] = useState(enable_recmd)

  if ((RightArrowPress || EnterPress) && !open) {
    handleNewDeck()
  }

  return (
    <div className="flashcard justify-center">
      <div>
        {totalAnswers === deckSize && !loading && (
          <FlashcardsEncouragement
            open={open}
            setOpen={setOpen}
            correctAnswers={correctAnswers}
            deckSize={deckSize}
            enable_recmd={enable_recmd}
            handleNewDeck={handleNewDeck}
            vocabularySeen={vocabularySeen}
            latestStories={latestStories}
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
