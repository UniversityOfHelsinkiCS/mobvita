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
import { learningLanguageSelector, getTextStyle, speak, respVoiceLanguages } from 'Utilities/common'
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

  if (!story || pending) return <Spinner fullHeight />

  const voice = respVoiceLanguages[learningLanguage]

  const handleWordClick = (surfaceWord, wordLemmas, wordId, inflectionRef) => {
    if (autoSpeak === 'always' && voice) speak(surfaceWord, voice)
    if (wordLemmas) {
      dispatch(setWords({ surface: surfaceWord, lemmas: wordLemmas }))
      dispatch(
        getTranslationAction({
          learningLanguage,
          wordLemmas,
          dictionaryLanguage,
          storyId: id,
          wordId,
          inflectionRef,
        })
      )
    }
  }

  const wordVoice = word => {
    if (word.bases) {
      return (
        <span
          className="word-interactive"
          key={word.ID}
          onClick={() => handleWordClick(word.surface, word.lemmas, word.ID, word.inflection_ref)}
          onKeyDown={() => handleWordClick(word.surface, word.lemmas, word.ID, word.inflection_ref)}
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
    <div className="cont-tall flex-col space-between align-center pt-sm">
      <div className="flex mb-nm">
        <Segment data-cy="readmode-text" className="cont" style={getTextStyle(learningLanguage)}>
          <Header style={getTextStyle(learningLanguage, 'title')}>
            <span className="pr-sm">{story.title}</span>
          </Header>
          <div className="flex-reverse space-between align-end">
            <Link to={`/stories/${id}/practice`}>
              <Button variant="primary">
                <FormattedMessage id="practice-now" />
              </Button>
            </Link>
            {story.url && (
              <a href={story.url}>
                <FormattedMessage id="Source" />
              </a>
            )}
          </div>
          <Divider />
          {story.paragraph.map(paragraph => (
            <p key={paragraph[0].ID}>{paragraph.map(word => wordVoice(word))}</p>
          ))}
        </Segment>
        <DictionaryHelp />
      </div>
      {showFooter && <Footer />}
    </div>
  )
}

export default ReadView
