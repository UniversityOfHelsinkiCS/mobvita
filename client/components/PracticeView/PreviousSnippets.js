import React from 'react'

const Word = ({ word, textToSpeech }) => {
  const { surface, ID, isWrong, tested, lemmas } = word
  let color = ''

  if (tested) {
    color = isWrong ? 'firebrick' : 'green'
  }

  return (
    <span
      className="word-interactive "
      role="button"
      onClick={() => textToSpeech(surface, lemmas)}
      key={ID}
      style={{ color }}
      onKeyDown={() => textToSpeech(word.surface, word.lemmas)}
      tabIndex={-1}
    >
      {surface}
    </span>
  )
}

const PreviousSnippets = ({ snippets, textToSpeech }) => {
  if (snippets.length === 0) return null

  return (
    <div>
      {snippets.map(snippet => (
        <p>{
        snippet.practice_snippet.map(word => (
          <Word word={word} textToSpeech={textToSpeech} />
        ))}
        </p>
      ))}
    </div>
  )
}

export default PreviousSnippets
