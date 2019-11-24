import React from 'react'
import { Segment } from 'semantic-ui-react'

const PreviousSnippet = ({ snippet }) => {

  if (!snippet) return null

  const { practice_snippet: practices } = snippet

  return (
    <Segment>
      {practices.map((word) => {
        const { surface, ID, mark } = word
        if (mark === 'wrong') return <span key={ID} style={{ color: 'firebrick' }}>{surface}</span>
        if (mark === 'correct') return <span key={ID} style={{ color: 'green' }}>{surface}</span>
        return <span key={ID}>{surface}</span>
      })}
    </Segment>
  )
}

export default PreviousSnippet
