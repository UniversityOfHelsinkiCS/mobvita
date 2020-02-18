import React, { useState, useRef, useEffect } from 'react'
import { Overlay } from 'react-bootstrap'
import { useIntl } from 'react-intl'
import { useSelector } from 'react-redux'


const Word = ({ word, textToSpeech, answer }) => {
  const { surface, isWrong, tested, lemmas } = word
  const intl = useIntl()
  const [show, setShow] = useState(false)
  const target = useRef(null)

  let color = ''
  if (tested) {
    color = isWrong ? 'wrong-text' : 'right-text'
  }

  const wordClass = `word-interactive ${color}`

  const handleClick = () => {
    setShow(true)
    textToSpeech(surface, lemmas)
  }

  const handleHide = (e) => {
    if (show) {
      setShow(false)
    }
  }

  const answerString = (answer && answer.users_answer)
    ? `${intl.formatMessage({ id: 'you-used' })}: ${answer.users_answer}`
    : 'You did not answer this one'

  return (
    <>
      <span
        ref={target}
        className={wordClass}
        role="button"
        onClick={handleClick}
        tabIndex={-1}
      >
        {surface}
      </span>

      {show && tested && (
        <Overlay target={target.current} show={show} placement="top" rootClose onHide={handleHide}>
          {({
            placement,
            scheduleUpdate,
            arrowProps,
            outOfBoundaries,
            show: _show,
            ...props
          }) => (
            <div
              {...props}
              className={[color, 'overlay']}
              style={{ ...props.style }}
            >
              {answerString}
            </div>
          )}
        </Overlay>
      )}
    </>
  )
}

const PreviousSnippets = ({ textToSpeech, answers }) => {
  const snippets = useSelector(({ snippets }) => snippets)
  const previous = snippets.previous.filter(Boolean)
  if (previous.length === 0) return null
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
