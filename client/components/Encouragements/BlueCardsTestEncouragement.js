import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
import { dictionaryLanguageSelector, images, showAllEncouragements } from 'Utilities/common'
import { FormattedMessage } from 'react-intl';
import AppButton from 'Components/AppButton'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getStoriesBlueFlashcards } from 'Utilities/redux/flashcardReducer'
import { useNavigate, useLocation } from 'react-router-dom'

import './Encouragements.css'

/**
 * `layout` picks the surface it is drawn for:
 *   'dialog' (default) - the centred modal: large art, fixed height, side-by-side buttons
 *   'chat'             - inside an assistant bubble: no frame of its own, narrow-column sizing
 */
const BlueCardsTestEncouragement = ({
  setShow,
  storyId,
  storyTitle,
  blueCardCount,
  layout = 'dialog',
}) => {
  const [prevBlueCards, setPrevBlueCards] = useState(null)

  const { storyBlueCards } = useSelector(({ flashcards }) => flashcards)
  const userData = useSelector(state => state.user.data.user)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const inStoryPractice = location.pathname.includes('stories')
  const learningLanguage = userData ? userData.last_used_language : null
  const resolvedStoryId = storyId ?? prevBlueCards?.story_id
  const resolvedStoryTitle = storyTitle ?? prevBlueCards?.title
  const resolvedBlueCardCount = blueCardCount ?? prevBlueCards?.num_of_rewardable_words

  useEffect(() => {
    if (storyId) return

    if (!storyBlueCards) {
      dispatch(getStoriesBlueFlashcards(learningLanguage, dictionaryLanguage))
      return
    }
    if (storyBlueCards.length > 0) {
      // Gives random blue card story from user in scale 0-4
      setPrevBlueCards(storyBlueCards[Math.floor(Math.random() * Math.min(5, storyBlueCards.length))])
    } else {
      navigate('/home')
    }
  }, [storyBlueCards])

  const startTest = () => {
    setShow(false)
    if (resolvedStoryId) {
      navigate(`/flashcards/fillin/test/${resolvedStoryId}`)
    }
  }

  const secondaryTestButton = () => {
    setShow(false)
    if (inStoryPractice) {
      navigate('/home')
    }
  }

  if (!resolvedStoryId && !prevBlueCards && !showAllEncouragements) {
    return null
  }

  const inChat = layout === 'chat'

  const title = (
    <FormattedMessage
      id="blue-cards-test-encouragement-title"
      values={{ nWords: resolvedBlueCardCount }}
    />
  )

  const message = (
    <>
      <FormattedHTMLMessage id="blue-cards-test-encouragement-message" />
      {': '}
      <span style={{ fontStyle: 'italic' }}>{resolvedStoryTitle}</span>
    </>
  )

  const actions = (
    <>
      <AppButton variant="primary" size={inChat ? 'sm' : undefined} type="button" onClick={startTest}>
        <FormattedMessage id="start" />
      </AppButton>
      <AppButton
        variant="secondary"
        size={inChat ? 'sm' : undefined}
        type="button"
        onClick={secondaryTestButton}
      >
        <FormattedMessage
          id={inStoryPractice ? 'home' : 'blue-cards-test-encouragement-dismiss-button'}
        />
      </AppButton>
    </>
  )

  // In the assistant the bubble is the surface, so this renders bare: no container, no fixed
  // height, and sizes that fit the sidebar's narrow column.
  if (inChat) {
    return (
      <div className="encouragement-chat">
        <div className="encouragement-chat-head">
          <img src={images.cardsIcon} alt="" />
          <strong>{title}</strong>
        </div>
        <p className="encouragement-chat-message">{message}</p>
        <div className="encouragement-chat-actions">{actions}</div>
      </div>
    )
  }

  return (
    <div className="encouragement-container">
      <div className="encouragement-message-container">
        <img
          src={images.cardsIcon}
          alt="flashcards"
          style={{ width: 64, height: 64, marginBottom: 24 }}
        />
        <h2>{title}</h2>
        <h5>{message}</h5>
      </div>
      <div className="encouragement-button-group">{actions}</div>
    </div>
  )
}

export default BlueCardsTestEncouragement
