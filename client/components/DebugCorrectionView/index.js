
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Segment, Input, Divider, Table, Checkbox } from 'semantic-ui-react'
import { learningLanguageSelector } from 'Utilities/common'
import { testCorrection, resetCorrectionResults } from 'Utilities/redux/correctionTestReducer'
import Spinner from 'Components/Spinner'
import CorrectedWord from './CorrectedWord'


const DebugCorrectionView = () => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const { corrections, corrected, pending } = useSelector(({ correctionTest }) => correctionTest)

  const [text, setText] = useState('')
  const [highlightedWords, setHighLightedWords] = useState([])
  
  useEffect(() => {
    dispatch(resetCorrectionResults())
  }, [])

  const handleClick = () => {
    if (text.length > 0) {
      dispatch(testCorrection(learningLanguage, text))
    }
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleClick()
    }
  }

  

  return (
    <div className="cont-tall pt-sm flex-col space-between">
      <div className="justify-center">
        <div className="cont">
          <Segment>
            <div className="space-between align-center">
              <div style={{ width: '550px' }}>
                <Input
                  action={{
                    content: pending ? (
                      <Spinner inline />
                    ) : (
                      'Send'
                    ),
                    onClick: handleClick,
                  }}
                  placeholder="Enter a sentence..."
                  size="large"
                  fluid
                  onChange={e => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              
            </div>
            {corrections && (
              <>
                <div className="mt-nm mb-lg">
                  <Divider />
                </div>
                <div className="" style={{ gap: '1em' }}>
                  {corrections.map((word, index) => (
                    <CorrectedWord
                      key={index}
                      word={word}
                      highlightedWords={highlightedWords}
                      setHighLightedWords={setHighLightedWords}
                    />
                  ))}
                </div>
              </>

            )}
            
          </Segment>
        </div>
      </div>
    </div>
  )
}

export default DebugCorrectionView
