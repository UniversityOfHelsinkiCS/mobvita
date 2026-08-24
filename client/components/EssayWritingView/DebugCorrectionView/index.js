// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Divider, Paper } from '@mui/material'
import { learningLanguageSelector } from 'Utilities/common'
import { testCorrection, resetCorrectionResults } from 'Utilities/redux/correctionTestReducer'
import { colors, font, shape } from 'Assets/mui_theme/designTokens'
import AppButton from 'Components/AppButton'
import AppTextField from 'Components/ui/AppTextField'
import Spinner from 'Components/Spinner'
import CorrectedWordDebug from './CorrectedWordDebug'

const DebugCorrectionView = () => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const { corrections, pending } = useSelector(({ correctionTest }) => correctionTest)

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
          <Paper
            elevation={0}
            sx={{
              padding: '1.5em',
              mt: '1.5rem',
              backgroundColor: colors.card,
              color: colors.ink,
              fontFamily: font.family,
              border: 'none',
              borderRadius: '20px',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.10)',
            }}
          >
            <div className="space-between align-center">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75em', width: '550px' }}>
                <div style={{ flex: 1 }}>
                  <AppTextField
                    placeholder="Enter a sentence..."
                    inputProps={{ 'data-cy': 'debug-correction-input' }}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <AppButton
                  onClick={handleClick}
                  data-cy="debug-correction-send-button"
                  sx={{ height: shape.inputHeight, py: 0, flexShrink: 0 }}
                >
                  {pending ? <Spinner inline size={20} /> : 'Send'}
                </AppButton>
              </div>
            </div>
            {corrections && (
              <>
                <div className="mt-nm mb-lg">
                  <Divider sx={{ my: '1em' }} />
                </div>
                <div className="flex-col" style={{ gap: '1em' }}>
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
