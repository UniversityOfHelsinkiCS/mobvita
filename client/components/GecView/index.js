import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { checkGrammar, updateEssay } from 'Utilities/redux/gecReducer'

const Word = ({ word, isError }) => {
  return (
    <span style={{ color: isError ? 'red' : 'black', fontWeight: isError ? 'bold' : 'normal' }}>
      {word + ' '}
    </span>
  )
}

const GrammarCheck = () => {
  const dispatch = useDispatch()
  const { essay, edits, pending } = useSelector(state => state.gec)

  const handleEssayChange = (event) => {
    const newValue = event.target.value
    dispatch(updateEssay(newValue))
  }

  const handleGrammarCheck = () => {
    if (essay.trim() !== "") {
      dispatch(checkGrammar(essay))
    }
  }

  const renderTextWithHighlights = (text, edits) => {
    const words = text.split(' ')
    return words.map((word, index) => {
      const isError = edits && edits.some(edit => edit.word === word)
      return <Word key={index} word={word} isError={isError} />
    })
  }

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
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
        disabled={pending}  // Disable button when pending
      >
        {pending ? '...' : <FormattedMessage id="check-gec-grammar" />}
      </button>

      {/* <div style={{ marginTop: '20px', borderColor: '#ccc', borderWidth: '1px', padding: '10px', height: '200px', overflowY: 'auto' }}>
        {pending ? (
          <span>Checking...</span>
        ) : (
          <span>
            {renderTextWithHighlights(essay, edits)}
          </span>
        )}
      </div> */}
    </div>
  )
}

export default GrammarCheck
