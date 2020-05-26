import React, { useRef, useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'
import { setPrevious } from 'Utilities/redux/snippetsReducer'
import Tooltip from './Tooltip'
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'

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

const ChunkDisplay = ({ chunk, handleWordClick, answers }) => {
  if (chunk.length === 1) {
    return <Word word={chunk[0]} answer={answers[chunk[0].ID]} handleWordClick={handleWordClick} />
  }

  const elements = chunk.map(word => <Word key={word.ID} word={word} answer={answers[word.ID]} handleWordClick={handleWordClick} />)

  return <span className="prev-chunk">{elements}</span>
}

const PlainWord = ({ surface, lemmas, handleWordClick }) => {
  if (surface === '\n\n') {
    return (
      <div style={{ lineHeight: '75%' }}>
        <br />
      </div>
    )
  }

  return (
    <span onClick={() => handleWordClick(surface, lemmas)} className="word-interactive">
      {surface}
    </span>
  )
}

const ExerciseWord = ({ word, handleWordClick, answer }) => {
  const { surface, isWrong, tested, lemmas } = word
  const intl = useIntl()
  const [show, setShow] = useState(false)

  const learningLanguage = useSelector(learningLanguageSelector)

  let color = ''
  if (tested) {
    color = isWrong ? 'wrong-text' : 'right-text'
  }

  const wordClass = `word-interactive ${color}`

  const handleClick = () => {
    handleWordClick(surface, lemmas)
    setShow(true)
  }

  const tooltip = (
    <div>
      {word.message && <div className="tooltip-green">{word.message}</div>}
      <div className="tooltip-blue">
        {`${intl.formatMessage({ id: 'you-used' })}: `}
        <span style={getTextStyle(learningLanguage)}>{answer.users_answer}</span>
      </div>
    </div>
  )

  return (
    <Tooltip placement="top" tooltipShown={show} trigger="none" tooltip={tooltip}>
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

const Word = ({ word, handleWordClick, answer }) => {
  const { surface, lemmas, tested } = word

  if (surface === '\n\n') {
    return (
      <div style={{ lineHeight: '75%' }}>
        <br />
      </div>
    )
  }

  if (!answer || (!answer.users_answer && answer.users_answer !== '')) {
    return (
      <PlainWord surface={surface} lemmas={lemmas} handleWordClick={handleWordClick} />
    )
  }

  return <ExerciseWord word={word} handleWordClick={handleWordClick} answer={answer} />
}

const PreviousSnippets = ({ handleWordClick }) => {
  const snippets = useSelector(({ snippets }) => snippets)
  const focusedStory = useSelector(({ stories }) => stories.focused)
  const previousAnswers = useSelector(({ practice }) => practice.previousAnswers)
  const snippetsInPrevious = useSelector(({ practice }) => practice.snippetsInPrevious)
  const learningLanguage = useSelector(learningLanguageSelector)

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
    <div style={getTextStyle(learningLanguage)}>
      {previous.map(snippet => (
        <span style={{ lineHeight: '170%' }} key={snippet.snippetid[0]}>
          {snippetsInPrevious.includes(snippet.snippetid[0])
            ? (
              chunkWords(snippet.practice_snippet).map(chunk => (
                <ChunkDisplay answers={previousAnswers} key={chunk[0].ID} chunk={chunk} handleWordClick={handleWordClick} />
              ))
            ) : (
              snippet.practice_snippet.map(word => (
                <PlainWord key={word.ID} handleWordClick={handleWordClick} surface={word.surface} lemmas={word.lemmas} />
              ))
            )
          }
        </span>
      ))}
    </div>
  )
}

export default PreviousSnippets
