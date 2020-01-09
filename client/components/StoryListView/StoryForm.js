import React, { useState } from 'react'
import { Form, Input, Button } from 'semantic-ui-react'
import { useDispatch } from 'react-redux'
import { postStory } from 'Utilities/redux/storiesReducer'
import { capitalize } from 'Utilities/common'

const StoryForm = ({ language }) => {
  const [storyUrl, setStoryUrl] = useState('')
  const dispatch = useDispatch()

  const handleStorySubmit = (event) => {
    event.preventDefault()

    const newStory = {
      language: capitalize(language),
      url: storyUrl,
    }

    dispatch(postStory(newStory))
    setStoryUrl('')
  }

  return (
    <Form onSubmit={handleStorySubmit}>
      <Input
        placeholder="paste url here"
        value={storyUrl}
        onChange={event => setStoryUrl(event.target.value)}
      />
      <Button type="submit">GO!</Button>
    </Form>
  )
}

export default StoryForm
