import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Divider, Segment, Header, Button, Input } from 'semantic-ui-react'

import { getStoryAction } from 'Utilities/redux/storiesReducer'

const PracticeView = ({ match }) => {
  const [answer, setAnswer] = useState({})
  const [randomized, setRandomized] = useState([])
  const [index, setIndex] = useState(0)

  const dispatch = useDispatch()
  const { story } = useSelector(({ stories }) => ({ story: stories.focused }))
  useEffect(() => {
    dispatch(getStoryAction(match.params.id))
  }, [])

  useEffect(() => {
    if (story) {
      const array = []
      story.paragraph[index].map(word => {
        // TODO remove this once we get actual words to change from backend
        if (Math.ceil(Math.random() * 4) === 4 && word.bases) {
          array.push(word.ID)
        }
      })
      setRandomized(array)

    }
  }, [story, index])

  if (!story) return 'No story (yet?)'

  const checkAnswers = () => {
    // TODO send this to backend
    console.log('answer', answer)
    if(story.paragraph[index + 1]) {
      setIndex(index + 1)
    } else {
      setIndex(0)
    }
  }

  const handleChange = (e, ID) => {
    if (!answer[ID]) {
      const modAnswer = {
        ...answer,
        [ID]: e.target.value
      }
      setAnswer(modAnswer)
    } else {
      answer[ID] = e.target.value
    }
  }

  const wordInput = (word) => {
    if (randomized.includes(word.ID)) {
      // TODO turn right answers to green and wrongs to red
      return <Input key={word.ID} onChange={e => handleChange(e, word.ID)}></Input>
    }
    return word.surface
  }
  return (
    <div style={{ paddingTop: '1em' }}>
      <Link to={'/stories'}>Go back to home page</Link>
      <Header>{story.title}</Header>
      <a href={story.url}>{story.url}</a>
      <Divider />
      <Segment>
        {story.paragraph[index].map(word => wordInput(word))}
        <div>
          <Button onClick={checkAnswers}> check answers </Button>
        </div>
      </Segment>
    </div>
  )
}


export default PracticeView