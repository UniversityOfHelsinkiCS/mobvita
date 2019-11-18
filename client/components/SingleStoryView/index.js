import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Divider, Segment, Header, Button } from 'semantic-ui-react'

import { getStoryAction } from 'Utilities/redux/storiesReducer'
import { getTranslationAction, clearTranslationAction } from 'Utilities/redux/translationReducer'
import DictionaryHelp from '../DictionaryHelp'

const SingleStoryView = ({ match }) => {
  const dispatch = useDispatch()
  const { story } = useSelector(({ stories }) => ({ story: stories.focused }))
  useEffect(() => {
    dispatch(getStoryAction(match.params.id))
    dispatch(clearTranslationAction())
  }, [])
  if (!story) return 'No story (yet?)'

  const handleClick = (surfaceWord, wordLemmas) => {
    window.responsiveVoice.speak(surfaceWord, 'Finnish Female')
    dispatch(getTranslationAction('Finnish', wordLemmas))
  }

  const wordVoice = (word) => {
    if (word.bases) {
      return <span className="word-interactive" key={word.ID} onClick={e => handleClick(word.surface, word.lemmas)}>{word.surface}</span>
    }
    return word.surface
  }

  return (
    <>
      <div style={{ paddingTop: '1em' }}>
        <Link to={'/stories'}>Back to story list</Link>

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