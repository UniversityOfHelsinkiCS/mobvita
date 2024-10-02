import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { checkGrammar, updateEssay } from 'Utilities/redux/gecReducer'

const Word = ({ word, isError, edit, index }) => {
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
      {word}
    </span>
  )
}

const GrammarCheck = () => {
  const dispatch = useDispatch()
  const { essay, edits, pending } = useSelector(state => state.gec)
  const [submitted, setSubmitted] = useState(false)

  const handleEssayChange = event => {
    const newValue = event.target.value
    dispatch(updateEssay(newValue))
  }

  const handleGrammarCheck = () => {
    if (essay.trim() !== '') {
      dispatch(checkGrammar(essay))
      setSubmitted(true)
    }
  }

  const renderTextWithHighlights = (text, edits) => {
    const words = text.split(' ')
    let modifiedText = []
    let currentEditIndex = 0
    let currentWordIndex = 0

    // Find matching edits and insert editable inputs
    while (currentWordIndex < words.length) {
      const word = words[currentWordIndex]
      const currentEdit = edits[currentEditIndex]
      const o_start = currentEdit ? currentEdit.o_start : null
      const o_end = currentEdit ? currentEdit.o_end : null

      // Check if the current word is in the range of the edit
      if (currentEdit && currentWordIndex >= o_start && currentWordIndex < o_end) {
        // Wrap the word in an input box if it's within the edit range
        modifiedText.push(
          <Word
            key={currentWordIndex}
            word={word}
            isError={true}
            edit={currentEdit}
            index={currentWordIndex}
          />
        )

        if (currentWordIndex + 1 === o_end) {
          currentEditIndex++
        }
      } else {
        // Regular word (no edit)
        modifiedText.push(
          <span key={currentWordIndex} style={{ marginRight: '5px' }}>
            {word + ' '}
          </span>
        )
      }

      currentWordIndex++
    }

    return modifiedText
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
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', height: '200px', overflowY: 'auto' }}>
          <span>{renderTextWithHighlights(essay, edits[0])}</span>
        </div>
      )}

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
        disabled={pending} // Disable button when pending
      >
        {pending ? '...' : <FormattedMessage id="check-gec-grammar" />}
      </button>
    </div>
  )
}

export default GrammarCheck