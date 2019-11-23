import React from 'react'
import { Segment } from 'semantic-ui-react'

const PreviousSnippet = ({ snippet }) => {

  if (!snippet) return null

  const { practice_snippet: practices } = snippet

  return (
    <Segment>
      {practices.map((word) => {
        const { surface, tested, isWrong, _id: id, ID } = word
        if (!isWrong && !tested) return <span key={ID}>{surface}</span>
        if (!isWrong) return <span key={ID} style={{ color: 'green' }}>{surface}</span>
        return <span key={ID} style={{ color: 'firebrick' }}>{surface}</span>
      })}
    </Segment>
  )
}

export default PreviousSnippet
