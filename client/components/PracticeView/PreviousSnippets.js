import React from 'react'
import { Segment } from 'semantic-ui-react'

const PreviousSnippets = ({ snippets, textToSpeech }) => {
  if (snippets.length === 0) return null

  return (
    <Segment>
      {snippets.map(snippet => snippet.practice_snippet.map((word) => {
        const { surface, ID, isWrong, tested, lemmas } = word
        let color = ''

        if (tested) {
          color = isWrong ? 'firebrick' : 'green'
        }

        return (
          <span
            className="word-interactive "
            role="button"
            onClick={() => textToSpeech(surface, lemmas)}
            key={ID}
            style={{ color }}
            onKeyDown={() => textToSpeech(word.surface, word.lemmas)}
            tabIndex={-1}
          >
            {surface}
          </span>
        )
      }))}
    </Segment>
  )
}

export default PreviousSnippets
