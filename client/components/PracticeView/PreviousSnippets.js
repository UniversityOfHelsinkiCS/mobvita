import React from 'react'
import { Segment } from 'semantic-ui-react'

const PreviousSnippets = ({ snippets }) => {
  if (snippets.length === 0) return null
  // const { practice_snippet: practices } = snippet

  return (
    <Segment>
      {snippets.map(snippet => snippet.practice_snippet.map((word) => {
        const { surface, ID, isWrong, tested } = word
        if (isWrong) return <span key={ID} style={{ color: 'firebrick' }}>{surface}</span>
        if (tested) return <span key={ID} style={{ color: 'green' }}>{surface}</span>
        return <span key={ID}>{surface}</span>
      }))}
    </Segment>
  )
}

export default PreviousSnippets
