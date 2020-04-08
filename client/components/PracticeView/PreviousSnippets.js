import React, { useRef, useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'
import { setPrevious } from 'Utilities/redux/snippetsReducer'
import Tooltip from './Tooltip'


const Word = ({ word, textToSpeech, answer }) => {
  const { surface, isWrong, tested, lemmas } = word
  const intl = useIntl()
  const target = useRef(null)
  const [show, setShow] = useState(false)


  let color = ''
  if (tested) {
    color = isWrong ? 'wrong-text' : 'right-text'
  }

  const wordClass = `word-interactive ${color}`

  const handleClick = () => {
    textToSpeech(surface, lemmas)
    setShow(true)
  }


  if (!answer || !answer.users_answer) { // Means that this is just a plain word (not an exercise.)
    return (
      <span
        ref={target}
        className={wordClass}
        role="button"
        onClick={handleClick}
        tabIndex={-1}
        onBlur={() => setShow(false)}
      >
        {surface}
      </span>
    )
  }

  const answerString = `${intl.formatMessage({ id: 'you-used' })}: ${answer.users_answer}`


  const tooltip = (
    <div>
      {answerString}
    </div>
  )

  return (
    <Tooltip placement="top" tooltipShown={show} trigger="none" tooltip={tooltip} additionalClassnames="tooltip-blue">
      <span
        ref={target}
        className={wordClass}
        role="button"
        onClick={handleClick}
        tabIndex={-1}
        onBlur={() => setShow(false)}
      >
        {surface}
      </span>
    </Tooltip>
  )
}

const PreviousSnippets = ({ textToSpeech, answers }) => {
  const snippets = useSelector(({ snippets }) => snippets)
  const focusedStory = useSelector(({ stories }) => stories.focused)

  const dispatch = useDispatch()

  const previous = snippets.previous.filter(Boolean)

  useEffect(() => {
    if (previous.length === 0) {
      if (snippets.focused && snippets.focused.snippetid[0] !== 0) {
        const prev = focusedStory.paragraph.map(para => ({ snippetid: [para[0].ID], practice_snippet: para }))
        dispatch(setPrevious(prev.slice(0, snippets.focused.snippetid[0])))
      }
    }
  }, [previous])

  return (
    <div>
      {previous.map(snippet => (
        <p key={snippet.snippetid[0]}>{
          snippet.practice_snippet.map(word => (
            <Word answer={answers[word.ID]} key={word.ID} word={word} textToSpeech={textToSpeech} />
          ))}
        </p>
      ))}
    </div>
  )
}

export default PreviousSnippets
