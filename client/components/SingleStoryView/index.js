import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Divider, Segment, Header, Button } from 'semantic-ui-react'
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
    dispatch(getStoryAction(learningLanguage, id))
    dispatch(clearTranslationAction())
  }, [])
  if (!story) return 'No story (yet?)'

  const handleWordClick = (surfaceWord, wordLemmas) => {
    // const selectedLocale = localeOptions.find(localeOption => localeOption.code === locale)
    window.responsiveVoice.speak(surfaceWord, `${learningLanguage === 'german' ? 'Deutsch' : capitalize(learningLanguage)} Female`)
    dispatch(getTranslationAction(capitalize(learningLanguage), wordLemmas, capitalize(dictionaryLanguage)))
  }

  const wordVoice = (word) => {
    if (word.bases) {
      return <span className="word-interactive" key={word.ID} onClick={e => handleWordClick(word.surface, word.lemmas)}>{word.surface}</span>
    }
    return word.surface
  }

  if (pending) return null

  return (
    <>
      <div style={{ paddingTop: '1em' }}>
        <Header>
          {story.title}
          <Link to={`/stories/${id}/practice`}>
            <Button color="teal" style={{ minWidth: '8em', margin: '0.5em', float: 'right', display: 'flex' }}>
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
    </>
  )
}

export default SingleStoryView
