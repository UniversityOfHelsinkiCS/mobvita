import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Divider, Segment, Header } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import {
  getTranslationAction,
  clearTranslationAction,
  setWords,
} from 'Utilities/redux/translationReducer'
import {
  capitalize,
  learningLanguageSelector,
  getTextStyle,
  speak,
  respVoiceLanguages,
} from 'Utilities/common'
import DictionaryHelp from 'Components/DictionaryHelp'
import Spinner from 'Components/Spinner'
import Footer from '../Footer'

const ReadView = ({ match }) => {
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()

  const { story, pending } = useSelector(({ stories, locale }) => ({
    story: stories.focused,
    pending: stories.focusedPending,
    locale,
  }))
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(({ user }) => user.data.user.last_trans_language)
  const autoSpeak = useSelector(({ user }) => user.data.user.auto_speak)
  const { id } = match.params
  useEffect(() => {
    dispatch(getStoryAction(id))
    dispatch(clearTranslationAction())
  }, [])

  if (!story || pending) return <Spinner />

  const voice = respVoiceLanguages[learningLanguage]

  const handleWordClick = (surfaceWord, wordLemmas, wordId) => {
    if (autoSpeak === 'always' && voice) speak(surfaceWord, voice)
    if (wordLemmas) {
      dispatch(setWords(surfaceWord, wordLemmas))
      dispatch(
        getTranslationAction(
          capitalize(learningLanguage),
          wordLemmas,
          capitalize(dictionaryLanguage),
          id,
          wordId
        )
      )
    }
  }

  const wordVoice = word => {
    if (word.bases) {
      return (
        <span
          className="word-interactive"
          key={word.ID}
          onClick={() => handleWordClick(word.surface, word.lemmas, word.ID)}
          onKeyDown={() => handleWordClick(word.surface, word.lemmas, word.ID)}
          role="button"
          tabIndex="-1"
        >
          {word.surface}
        </span>
      )
    }
    if (word.surface === '\n\n') {
      return <br key={word.ID} />
    }
    return word.surface
  }

  const showFooter = width > 640

  return (
    <div>
      <div className="center auto">
        <div className="max-width padding-top-2">
          <Header style={getTextStyle(learningLanguage, 'title')}>
            <span className="padding-right-1">{story.title}</span>
            <Link to={`/stories/${id}/practice`}>
              <Button variant="primary" style={{ float: 'right', marginTop: '0.5em' }}>
                <FormattedMessage id="practice-now" />
              </Button>
            </Link>
          </Header>
          {story.url ? (
            <a href={story.url}>
              <FormattedMessage id="Source" />
            </a>
          ) : (
            <div />
          )}
          <Divider />
          <Segment data-cy="readmode-text" style={getTextStyle(learningLanguage)}>
            {story.paragraph.map(paragraph => (
              <p key={paragraph[0].ID}>{paragraph.map(word => wordVoice(word))}</p>
            ))}
          </Segment>
        </div>
        <DictionaryHelp />
      </div>
      {showFooter && <Footer />}
    </div>
  )
}

export default ReadView
