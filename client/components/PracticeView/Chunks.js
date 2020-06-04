import React, { useRef, useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
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
  const snippets = useSelector(({ snippets }) => snippets)
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
  }, shallowEqual)

  useEffect(() => {
    if (chunksComponent.current) {
      setPreviousHeight(chunksComponent.current.clientHeight)
    }
  }, [chunks])

  if (snippets.pending) {
    return (
      <div className="spinner-container" style={{ minHeight: previousHeight }}>
        <Spinner animation="border" variant="primary" size="lg" />
      </div>
    )
  }

  return (
    <div ref={chunksComponent}>
      {chunks.map(chunk => <ChunkInput key={chunk[0].ID} chunk={chunk} {...props} />)}
    </div>
  )
}

export default Chunks
