import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { checkGrammar, updateEssay } from 'Utilities/redux/gecReducer'

const Word = ({ word, isError, edit, index, onEditChange }) => {
  const [hovered, setHovered] = useState(false)

  return isError ? (
    <span
      key={index}
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <input
        type="text"
        defaultValue={edit.o_str}
        placeholder={edit.o_str}
        style={{
          color: 'red',
          fontWeight: 'bold',
          border: '1px solid red',
          padding: '2px',
          margin: '0 2px',
        }}
        onChange={(e) => onEditChange(e.target.value, index)} 
      />
      {hovered && (
        <span
          style={{
            position: 'absolute',
            top: '-25px',
            left: '0',
            backgroundColor: '#333',
            color: '#fff',
            padding: '5px',
            borderRadius: '3px',
            fontSize: '12px',
            zIndex: '10',
            whiteSpace: 'nowrap',
          }}
        >
          {edit.type}
        </span>
      )}
    </span>
  ) : (
    <span key={index} style={{ marginRight: '5px' }}>
      {word}{' '}
    </span>
  )
}

const GrammarCheck = () => {
  const dispatch = useDispatch()
  const { essay, edits, pending, error } = useSelector(state => state.gec)
  const [submitted, setSubmitted] = useState(false)
  const [editedWords, setEditedWords] = useState({})

  const handleEssayChange = event => {
    const newValue = event.target.value
    dispatch(updateEssay(newValue))
  }

  const handleEditChange = (newValue, index) => {
    setEditedWords(prev => ({ ...prev, [index]: newValue }));
  }

  const handleGrammarCheck = async () => {
    const updatedSentences = []
    const sentences = essay.split(/(?<=[.!?])\s+/)

    sentences.forEach((sentence, sentenceIndex) => {
      const words = sentence.split(' ')
      const sentenceEdits = edits[sentenceIndex] || []

      const modifiedWords = words.map((word, wordIndex) => {
        const currentEdit = sentenceEdits.find(edit => 
          wordIndex >= edit.c_start && wordIndex < edit.c_end
        )
        return currentEdit ? editedWords[wordIndex] || word : word
      })

      updatedSentences.push(modifiedWords.join(' ') + (sentence.endsWith(' ') ? ' ' : ''))
    })

    const updatedEssay = updatedSentences.join(' ')
    dispatch(updateEssay(updatedEssay))

    console.log("handleGrammarCheck", updatedEssay)
    if (updatedEssay.trim() !== '') {
      dispatch(checkGrammar(updatedEssay));
      setSubmitted(true);
    }
  }

  const handleReset = () => {
    dispatch(updateEssay(''));
    setEditedWords({}); 
    setSubmitted(false);
  }

  const renderTextWithHighlights = (text, edits) => {
    const sentences = text.split('. ').map((sentence, idx) => ({
      text: sentence,
      index: idx
    }));

    return sentences.map(({ text, index }) => {
      const words = text.split(' ')
      const sentenceEdits = edits[index] || []
      const modifiedSentence = []

      let currentEditIndex = 0
      let currentWordIndex = 0

      while (currentWordIndex < words.length) {
        const word = words[currentWordIndex]
        const currentEdit = sentenceEdits[currentEditIndex]
        const c_start = currentEdit ? currentEdit.c_start : null
        const c_end = currentEdit ? currentEdit.c_end : null

        if (currentEdit && currentWordIndex >= c_start && currentWordIndex < c_end) {
          modifiedSentence.push(
            <Word
              key={`${index}-${currentWordIndex}`}
              word={word}
              isError={true}
              edit={currentEdit}
              index={currentWordIndex}
              onEditChange={handleEditChange}
            />
          )

          if (currentWordIndex + 1 === c_end) {
            currentEditIndex++
          }
        } else {
          modifiedSentence.push(
            <span key={`${index}-${currentWordIndex}`} style={{ marginRight: '5px' }}>
              {word}{' '}
            </span>
          )
        }

        currentWordIndex++
      }

      return (
        <div key={`sentence-${index}`} style={{ marginBottom: '10px' }}>
          {modifiedSentence}
          {index < sentences.length - 1 && '.'}
        </div>
      )
    })
  }

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {!submitted ? (
        <textarea
          style={{
            height: '150px',
            borderColor: '#ccc',
            borderWidth: '1px',
            padding: '10px',
            fontSize: '16px',
            marginBottom: '20px',
            width: '100%',
            resize: 'vertical',
          }}
          value={essay}
          onChange={handleEssayChange}
        />
      ) : (
        <div
          style={{
            marginTop: '20px',
            padding: '10px',
            border: '1px solid #ccc',
            height: '200px',
            overflowY: 'auto',
          }}
        >
          <span>{renderTextWithHighlights(essay, edits)}</span>
        </div>
      )}

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button
          style={{
            backgroundColor: '#007BFF',
            padding: '15px',
            borderRadius: '5px',
            color: 'white',
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={handleGrammarCheck}
          disabled={pending}
        >
          {pending ? '...' : <FormattedMessage id="check-gec-grammar" />}
        </button>

        <button
          style={{
            backgroundColor: '#FF5733',
            padding: '15px',
            borderRadius: '5px',
            color: 'white',
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={handleReset}
        >
          <FormattedMessage id="reset-essay" />
        </button>
      </div>
      {error && <FormattedMessage id="please-try-again" />}
    </div>
  )
}

export default GrammarCheck