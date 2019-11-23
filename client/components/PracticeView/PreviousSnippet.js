import React from 'react'
import { Segment } from 'semantic-ui-react'

const PreviousSnippet = ({ snippet }) => {

  if (!snippet) return null

  const solutionWord = (word) => {
    const { surface, isWrong } = word
    if (isWrong) {
      return <span style={{ color: 'firebrick' }}>{surface}</span>
    }
    return <span>{surface}</span>
  }

  const { practice_snippet: practices } = snippet

  return (
    <Segment>
      {practices.map(word => solutionWord(word))}
    </Segment>
  )
}

export default PreviousSnippet
