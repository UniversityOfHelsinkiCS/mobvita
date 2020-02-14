import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Loader } from 'semantic-ui-react'

const Chunks = ({ chunkInput }) => {
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

  return (
    <>
      {chunks.map(chunk => chunkInput(chunk))}
    </>
  )
}

export default Chunks
