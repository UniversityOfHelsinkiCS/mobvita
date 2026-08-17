
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Divider, Paper } from '@mui/material'
import { learningLanguageSelector } from 'Utilities/common'
import { testCorrection, resetCorrectionResults } from 'Utilities/redux/correctionTestReducer'
import AppButton from 'Components/AppButton'
import AppTextField from 'Components/ui/AppTextField'
import Spinner from 'Components/Spinner'
import CorrectedWordDebug from './CorrectedWordDebug'


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
          <Paper sx={{ padding: '1em' }}>
            <div className="space-between align-center">
              <div style={{ width: '550px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                  <AppTextField
                    placeholder="Enter a sentence..."
                    inputProps={{ 'data-cy': 'debug-correction-input' }}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <AppButton data-cy="debug-correction-send-button" onClick={handleClick}>
                    {pending ? <Spinner inline /> : 'Send'}
                  </AppButton>
                </Box>
              </div>

            </div>
            {corrections && (
              <>
                <div className="mt-nm mb-lg">
                  <Divider sx={{ my: '1em' }} />
                </div>
                <div className="" style={{ gap: '1em' }}>
                  {corrections.map((word, index) => (
                    <CorrectedWordDebug
                      key={index}
                      word={word}
                      highlightedWords={highlightedWords}
                      setHighLightedWords={setHighLightedWords}
                    />
                  ))}
                </div>
              </>

            )}

          </Paper>
        </div>
      </div>
    </div>
  )
}

export default DebugCorrectionView
