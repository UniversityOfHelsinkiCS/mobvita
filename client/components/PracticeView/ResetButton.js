import React from 'react'
import { useDispatch } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { resetCurrentSnippet } from 'Utilities/redux/snippetsReducer'

const ResetButton = ({ storyId, style }) => {
  const dispatch = useDispatch()

  const resetSnippets = () => {
    dispatch(resetCurrentSnippet(storyId))
  }

  return (
    <Button style={style} onClick={resetSnippets}> Restart story </Button>
  )
}

export default ResetButton
