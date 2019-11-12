import React from 'react'
import { useDispatch } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { resetCurrentSnippet } from 'Utilities/redux/snippetsReducer'

const ResetButton = ({ storyId }) => {
  const dispatch = useDispatch()

  const resetSnippets = () => {
    dispatch(resetCurrentSnippet(storyId))
  }

  return (
    <Button onClick={resetSnippets}> Reset to Zero </Button>
  )
}

export default ResetButton
