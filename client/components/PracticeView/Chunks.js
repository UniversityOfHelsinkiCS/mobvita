import React, { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Spinner } from 'react-bootstrap'

import WordInput from './WordInput'

const ChunkInput = ({ chunk, ...props }) => {
  if (chunk.length === 1) {
    return <WordInput word={chunk[0]} {...props} />
  }
  const elements = chunk.map(word => <WordInput key={word.ID} word={word} {...props} />)
  return <span className="chunk">{elements}</span>
}

const Chunks = (props) => {
  const pending = useSelector(({ snippets }) => snippets.pending)
  const chunksComponent = useRef(null)
  const [previousHeight, setPreviousHeight] = useState(0)
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

  useEffect(() => {
    if (chunksComponent.current) {
      setPreviousHeight(chunksComponent.current.clientHeight)
    }
  }, [chunks])

  if (pending) {
    return (
      <div className="spinner-container" style={{ minHeight: previousHeight }}>
        <Spinner animation="border" variant="primary" size="lg" />
      </div>
    )
  }

  return (
    <div ref={chunksComponent}>
      {chunks.map(chunk => <ChunkInput chunk={chunk} {...props} />)}
    </div>
  )
}

export default Chunks
