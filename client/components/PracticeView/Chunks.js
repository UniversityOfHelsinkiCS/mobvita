import React from 'react'
import { useSelector } from 'react-redux'
import { Spinner } from 'react-bootstrap'

const Chunks = ({ chunkInput }) => {
  const pending = useSelector(({ snippets }) => snippets.pending)
  const chunks = useSelector(({ snippets }) => {
    if (!snippets.focused) {
      return []
    }

    let chunk = []
    let inChunk = false

    return snippets.focused.practice_snippet.reduce((chunks, word) => {
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
  })

  if (pending) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" variant="primary" size="lg" />
      </div>
    )
  }

  return (
    <>
      {chunks.map(chunk => chunkInput(chunk))}
    </>
  )
}

export default Chunks
