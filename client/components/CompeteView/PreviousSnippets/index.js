import React, { useMemo, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'
import { setPrevious } from 'Utilities/redux/snippetsReducer'
import PlainWord from 'Components/CommonStoryTextComponents/PlainWord'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'

const PreviousSnippets = () => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const { snippetsInPrevious, previousAnswers } = useSelector(({ practice }) => practice)
  const focusedStory = useSelector(({ stories }) => stories.focused)
  const { previous, focusedSnippet, pending } = useSelector(({ snippets }) => {
    const { focused: focusedSnippet, pending } = snippets
    const previous = snippets.previous.filter(Boolean)
    return { previous, focusedSnippet, pending }
  }, shallowEqual)

  const dispatch = useDispatch()

  const createOldSnippets = () => {
    const prev = focusedStory.paragraph.map(para => ({
      snippetid: [para[0].ID],
      practice_snippet: para,
    }))

    const initialPrevSnippets = prev.slice(0, focusedSnippet.snippetid[0])
    dispatch(setPrevious(initialPrevSnippets))
  }

  useEffect(() => {
    if (previous.length === 0 && focusedSnippet && focusedSnippet.snippetid[0] !== 0 && !pending) {
      createOldSnippets()
    }
  }, [previous])

  const oldPreviousSnippets = useMemo(
    () =>
      previous
        .filter(
          snippet => !snippetsInPrevious.includes(snippet.snippetid[snippet.snippetid.length - 1])
        )
        .map(snippet =>
          snippet.practice_snippet.map(word => <PlainWord key={word.ID} word={word} />)
        ),
    [focusedStory, previous.length === 0]
  )

  const sessionPreviousSnippets = useMemo(
    () =>
      previous
        .filter(snippet =>
          snippetsInPrevious.includes(snippet.snippetid[snippet.snippetid.length - 1])
        )
        .map(snippet => (
          <TextWithFeedback
            snippet={snippet.practice_snippet}
            answers={previousAnswers}
            mode="practice"
          />
        )),
    [previous]
  )

  return (
    <div className="pt-nm" style={getTextStyle(learningLanguage)}>
      {oldPreviousSnippets}
      {sessionPreviousSnippets}
    </div>
  )
}

export default PreviousSnippets
