import React, { useRef, useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'
import { setPrevious } from 'Utilities/redux/snippetsReducer'
import Tooltip from './Tooltip'

const chunkWords = (words) => {
  let chunk = []
  let inChunk = false

  return words.reduce((chunks, word) => {
    if (inChunk && !word.chunk) chunk.push(word)
    if (!inChunk && !word.chunk) chunks.push([word])
    if (word.chunk) chunk.push(word)
    if (word.chunk === 'chunk_start') inChunk = true
    if (word.chunk === 'chunk_end') {
      inChunk = false
      chunks.push(chunk)
      chunk = []
    }
    return chunks
  }, [])
}

const ChunkDisplay = ({ chunk, textToSpeech, answers }) => {
  if (chunk.length === 1) {
    return <Word word={chunk[0]} answer={answers[chunk[0].ID]} textToSpeech={textToSpeech} />
  }

  const elements = chunk.map(word => <Word key={word.ID} word={word} answer={answers[word.ID]} textToSpeech={textToSpeech} />)

  return <span className="prev-chunk">{elements}</span>
}

const PlainWord = ({ surface, lemmas, textToSpeech }) => {
  if (surface === '\n\n') {
    return (
      <div style={{ lineHeight: '75%' }}>
        <br />
      </div>
    )
  }

  return (
    <span onClick={() => textToSpeech(surface, lemmas)} className="word-interactive">
      {surface}
    </span>
  )
}

const ExerciseWord = ({ word, textToSpeech, answer }) => {
  const { surface, isWrong, tested, lemmas } = word
  const intl = useIntl()
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

  const answerString = `${intl.formatMessage({ id: 'you-used' })}: ${answer.users_answer}`


  const tooltip = (
    <div>
      {answerString}
    </div>
  )

  return (
    <Tooltip placement="top" tooltipShown={show} trigger="none" tooltip={tooltip} additionalClassnames="tooltip-blue">
      <span
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

const Word = ({ word, textToSpeech, answer }) => {
  const { surface, lemmas } = word

  if (surface === '\n\n') {
    return (
      <div style={{ lineHeight: '75%' }}>
        <br />
      </div>
    )
  }

  if (!answer || !answer.users_answer) {
    return (
      <PlainWord surface={surface} lemmas={lemmas} textToSpeech={textToSpeech} />
    )
  }

  return <ExerciseWord word={word} textToSpeech={textToSpeech} answer={answer} />
}

const PreviousSnippets = ({ textToSpeech }) => {
  const snippets = useSelector(({ snippets }) => snippets)
  const focusedStory = useSelector(({ stories }) => stories.focused)
  const previousAnswers = useSelector(({ practice }) => practice.previousAnswers)
  const snippetsInPrevious = useSelector(({ practice }) => practice.snippetsInPrevious)

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
        <span style={{ lineHeight: '170%' }} key={snippet.snippetid[0]}>
          {snippetsInPrevious.includes(snippet.snippetid[0])
            ? (
              chunkWords(snippet.practice_snippet).map(chunk => (
                <ChunkDisplay answers={previousAnswers} key={chunk[0].ID} chunk={chunk} textToSpeech={textToSpeech} />
              ))
            ) : (
              snippet.practice_snippet.map(word => (
                <PlainWord key={word.ID} textToSpeech={textToSpeech} surface={word.surface} lemmas={word.lemmas} />
              ))
            )
          }
        </span>
      ))}
    </div>
  )
}

export default PreviousSnippets
