import React from 'react'
import { Segment } from 'semantic-ui-react'

const PreviousSnippet = ({ snippet }) => {

  if (!snippet) return null

  const { practice_snippet: practices } = snippet

  return (
    <Segment>
      {practices.map((word) => {
        const { surface, isWrong, _id: id } = word
        if (!isWrong) return <span key={id}>{surface}</span>

        return <span key={id} style={{ color: 'firebrick' }}>{surface}</span>
      })}
    </Segment>
  )
}

export default PreviousSnippet
