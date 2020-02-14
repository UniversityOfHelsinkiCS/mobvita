import React from 'react'
import { useSelector } from 'react-redux'
import { Loader } from 'semantic-ui-react'

const Chunks = ({ chunkInput }) => {
  const snippets = useSelector(({ snippets }) => snippets)

  const chunks = []
  let chunk = []
  let inChunk = false

  if (!snippets.focused || snippets.pending) {
    return (
      <div>
        <Loader active />
      </div>
    )
  }

  snippets.focused.practice_snippet.forEach((word) => {
    if (word.chunk) {
      if (word.chunk === 'chunk_start') {
        chunk.push(word)
        inChunk = true
      } else if (word.chunk === 'chunk_end') {
        inChunk = false
        chunk.push(word)
        chunks.push(chunk)
        chunk = []
      }
    } else if (!inChunk) {
      chunks.push([word])
    } else {
      chunk.push(word)
    }
  })

  return (
    <>
      {chunks.map(chunk => chunkInput(chunk))}
    </>
  )
}

export default Chunks
