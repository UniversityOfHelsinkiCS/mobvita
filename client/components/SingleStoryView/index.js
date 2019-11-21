import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Divider, Segment, Header, Button } from 'semantic-ui-react'

import { getStoryAction } from 'Utilities/redux/storiesReducer'
import { getTranslationAction, clearTranslationAction } from 'Utilities/redux/translationReducer'
import { capitalize } from 'Utilities/common'
import DictionaryHelp from '../DictionaryHelp'

const SingleStoryView = ({ match }) => {
  const [language, setLanguage] = useState('')
  const dispatch = useDispatch()
  const { story, pending } = useSelector(({ stories }) => ({ story: stories.focused, pending: stories.pending }))
  useEffect(() => {
    const currentLanguage = window.location.pathname.split('/')[2]
    setLanguage(currentLanguage)
    dispatch(getStoryAction(currentLanguage, match.params.id))
    dispatch(clearTranslationAction())
  }, [])
  if (!story) return 'No story (yet?)'

  const handleClick = (surfaceWord, wordLemmas) => {
    window.responsiveVoice.speak(surfaceWord, `${language === 'german' ? 'Deutsch' : capitalize(language)} Female`)
    dispatch(getTranslationAction(capitalize(language), wordLemmas))
  }

  const wordVoice = (word) => {
    if (word.bases) {
      return <span className="word-interactive" key={word.ID} onClick={e => handleClick(word.surface, word.lemmas)}>{word.surface}</span>
    }
    return word.surface
  }

  if (pending) return null

  return (
    <>
      <div style={{ paddingTop: '1em' }}>
        <Link to={`/stories/${language}`}>Back to story list</Link>

        <Header>{story.title}</Header>
        <a href={story.url}>{story.url}</a>
        <Divider />
        <Segment>
          {story.paragraph.map(paragraph => (
            <div key={paragraph[0].ID}>
              {paragraph.map(word => wordVoice(word))}
            </div>
          ))}
        </Segment>
      </div>
      <DictionaryHelp />
    </>
  )
}

export default SingleStoryView