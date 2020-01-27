import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Divider, Header } from 'semantic-ui-react'
import { getOpponent, competitionStartNow } from 'Utilities/redux/competitionReducer'
import { clearTranslationAction } from 'Utilities/redux/translationReducer'
import { resetCurrentSnippet } from 'Utilities/redux/snippetsReducer'

import { getStoryAction } from 'Utilities/redux/storiesReducer'
import PreviousSnippet from 'Components/CompeteView/PreviousSnippet'
import CurrentSnippet from 'Components/CompeteView/CurrentSnippet'
import End from 'Components/CompeteView/End'

import DictionaryHelp from 'Components/DictionaryHelp'
import { FormattedMessage } from 'react-intl'

const CompeteView = ({ match }) => {
  const { language } = match.params
  const dispatch = useDispatch()
  const storyId = match.params.id
  const { story, startTime, snippets } = useSelector(({ stories, compete, snippets }) => ({ snippets, story: stories.focused, startTime: compete.startTime }))

  const initializeCompetition = async () => {
    await Promise.all([
      dispatch(getStoryAction(language, storyId)),
      dispatch(resetCurrentSnippet(storyId)),
      dispatch(clearTranslationAction()),
      dispatch(getOpponent(storyId)),
    ])
    await dispatch(competitionStartNow())
  }

  useEffect(() => { initializeCompetition() }, [])
  if (!story || !startTime || !snippets.focused) return null

  const currentSnippetNumber = snippets.focused.snippetid[0] + 1

  return (
    <div style={{ paddingTop: '1em' }}>
      <Header>{story.title}</Header>
      {story.url ? <a href={story.url}><FormattedMessage id="Source" /></a> : null}
      <Divider />
      <h1>
        {`${currentSnippetNumber}/${snippets.totalnum}`}
      </h1>
      <PreviousSnippet snippet={snippets.previous} />
      {snippets.previous && currentSnippetNumber === 1
        ? <End />
        : <CurrentSnippet storyId={match.params.id} language={language} />
      }
      <DictionaryHelp />
    </div>
  )
}

export default CompeteView
