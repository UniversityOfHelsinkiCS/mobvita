import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Divider, Segment, Header, Button, Input, Dropdown } from 'semantic-ui-react'

import { getStoryAction } from 'Utilities/redux/storiesReducer'

const PracticeView = ({ match }) => {
  const [answer, setAnswer] = useState({})
  const [randomized, setRandomized] = useState([])
  const [index, setIndex] = useState(0)
  const [randIdx, setRandIdx] = useState(0)
  const [randIdxSnd, setRandIdxSnd] = useState(0)

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
        if (Math.ceil(Math.random() * 5) === 5 && word.bases) {
          array.push(word.ID)
        }
      })

      // TODO also remove this
      const rand = Math.ceil(Math.random() * array.length) - 1

      if (rand - 1 === 0) {
        setRandIdxSnd(rand + 1)
      } else if (rand + 1 === array.length) {
        setRandIdxSnd(rand - 1)
      } else {
        setRandIdxSnd(rand - 1)
      }
      setRandIdx(rand)
      setRandomized(array)

    }
  }, [story, index])

  if (!story) return 'No story (yet?)'

  const checkAnswers = () => {
    // TODO send this to backend
    console.log('answer', answer)

    if (story.paragraph[index + 1]) {
      // TODO GET /snippet/next
      setIndex(index + 1)
    } else {
      // TODO GET /snippet/reset
      setIndex(0)
    }
  }

  const handleClick = (word) => {
    window.responsiveVoice.speak(word, 'Finnish Female')
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
    if (randomized[randIdx] === word.ID) {
      // TODO actual dropdown options
      const options = [{ key: 100000, value: '2', text: word.surface }]
      return <Dropdown key={word.ID} options={options} selection onClick={e => handleClick(word.surface)} />
    } else if (randomized[randIdxSnd] === word.ID) {
      // input without writen hint
      return <Input key={word.ID} onChange={e => handleChange(e, word.ID)} onClick={e => handleClick(word.surface)}></Input>
    } else if (randomized.includes(word.ID)) {
      // TODO turn right answers to green and wrongs to red real base
      return <Input key={word.ID} defaultValue={word.bases.split('|')[0]} onChange={e => handleChange(e, word.ID)} onClick={e => handleClick(word.surface)}></Input>
    }
    return <span className="word-interactive" key={word.ID} onClick={e => handleClick(word.surface)}>{word.surface}</span>
  }
  return (
    <div style={{ paddingTop: '1em' }}>
      <Link to={'/stories'}>Go back to story list</Link>
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