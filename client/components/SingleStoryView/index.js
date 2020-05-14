import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Divider, Segment, Header } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import {
  getTranslationAction,
  clearTranslationAction,
  setWords,
} from 'Utilities/redux/translationReducer'
import { capitalize, learningLanguageSelector, getTextStyle, speak } from 'Utilities/common'
import DictionaryHelp from 'Components/DictionaryHelp'
import Spinner from 'Components/Spinner'
import Footer from '../Footer'

const SingleStoryView = ({ match }) => {
  const dispatch = useDispatch()
  const { story, pending } = useSelector(({ stories, locale }) => ({ story: stories.focused, pending: stories.focusedPending, locale }))
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(({ user }) => user.data.user.last_trans_language)
  const autoSpeak = useSelector(({ user }) => user.data.user.auto_speak)
  const { id } = match.params
  useEffect(() => {
    dispatch(getStoryAction(id))
    dispatch(clearTranslationAction())
  }, [])

  if (!story || pending) return <Spinner />

  const handleWordClick = (surfaceWord, wordLemmas, wordId) => {
    if (autoSpeak === 'always') speak(surfaceWord, learningLanguage)
    if (wordLemmas) {
      dispatch(setWords(surfaceWord, wordLemmas))
      dispatch(
        getTranslationAction(
          capitalize(learningLanguage),
          wordLemmas,
          capitalize(dictionaryLanguage),
          id,
          wordId,
        ),
      )
    }
  }

  const wordVoice = (word) => {
    if (word.bases) {
      return <span className="word-interactive" key={word.ID} onClick={e => handleWordClick(word.surface, word.lemmas, word.ID)}>{word.surface}</span>
    }
    return word.surface
  }

  return (
    <div>
      <div className="center auto">
        <div className="max-width padding-top-2" style={getTextStyle(learningLanguage)}>
          <Header>
            {story.title}
            <Link to={`/stories/${id}/practice`}>
              <Button variant="primary" style={{ float: 'right', marginTop: '0.5em' }}>
                <FormattedMessage id="practice-now" />
              </Button>
            </Link>
          </Header>
          {story.url ? <a href={story.url}><FormattedMessage id="Source" /></a> : <div />}
          <Divider />
          <Segment style={getTextStyle(learningLanguage)}>
            {story.paragraph.map(paragraph => (
              <p key={paragraph[0].ID}>
                {paragraph.map(word => wordVoice(word))}
              </p>
            ))}
          </Segment>
        </div>
        <DictionaryHelp />
      </div>
      <Footer />
    </div>
  )
}

export default SingleStoryView
