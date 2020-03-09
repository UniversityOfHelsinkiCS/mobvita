import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Divider, Segment, Header } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import { getStoryAction } from 'Utilities/redux/storiesReducer'
import { getTranslationAction, clearTranslationAction } from 'Utilities/redux/translationReducer'
import { capitalize, localeOptions, learningLanguageSelector } from 'Utilities/common'
import DictionaryHelp from 'Components/DictionaryHelp'

const SingleStoryView = ({ match }) => {
  const dispatch = useDispatch()
  const { story, pending } = useSelector(({ stories, locale }) => ({ story: stories.focused, pending: stories.pending, locale }))
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(({ user }) => user.data.user.last_trans_language)
  const { id } = match.params
  useEffect(() => {
    dispatch(getStoryAction(id))
    dispatch(clearTranslationAction())
  }, [])
  if (!story) return 'No story (yet?)'

  const handleWordClick = (surfaceWord, wordLemmas, wordId) => {
    // const selectedLocale = localeOptions.find(localeOption => localeOption.code === locale)
    window.responsiveVoice.speak(surfaceWord, `${learningLanguage === 'german' ? 'Deutsch' : capitalize(learningLanguage)} Female`)
    const storyId = story.exercise_setting.story
    dispatch(
      getTranslationAction(
        capitalize(learningLanguage),
        wordLemmas,
        capitalize(dictionaryLanguage),
        storyId,
        wordId,
      ),
    )
  }

  const wordVoice = (word) => {
    if (word.bases) {
      return <span className="word-interactive" key={word.ID} onClick={e => handleWordClick(word.surface, word.lemmas, word.ID)}>{word.surface}</span>
    }
    return word.surface
  }

  if (pending) return null

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ paddingTop: '1em', maxWidth: '1024px' }}>
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
        <Segment>
          {story.paragraph.map(paragraph => (
            <p key={paragraph[0].ID}>
              {paragraph.map(word => wordVoice(word))}
            </p>
          ))}
        </Segment>
      </div>
      <DictionaryHelp />
    </div>
  )
}

export default SingleStoryView
