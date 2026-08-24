/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-danger */
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Paper,
  Divider,
  FormControlLabel,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material'
import { learningLanguageSelector } from 'Utilities/common'
import { colors, font, shape } from 'Assets/mui_theme/designTokens'
import { testConstruction, resetConstructionResults } from 'Utilities/redux/constructionTestReducer'
import Spinner from 'Components/Spinner'
import AppButton from 'Components/AppButton'
import AppSwitch from 'Components/ui/AppSwitch'
import AppTable from 'Components/ui/AppTable'
import AppTextField from 'Components/ui/AppTextField'


const ConstructTestView = () => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const { patternResults, pending } = useSelector(({ constructionTest }) => constructionTest)

  const [text, setText] = useState('')
  const [showAnalyses, setShowAnalyses] = useState(false)

  const consistsOfOnlyWhitespace = text => !!text.match(/^\s+$/g)

  useEffect(() => {
    dispatch(resetConstructionResults())
  }, [])

  const handleClick = () => {
    if (!consistsOfOnlyWhitespace(text) && text.length > 0) {
      dispatch(testConstruction(learningLanguage, text))
    }
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      if (!consistsOfOnlyWhitespace(text) && text.length > 0) {
        dispatch(testConstruction(learningLanguage, text))
      }
    }
  }

  const isNoChunkResult = resultObj => /no chunk found/i.test(resultObj?.message || '')

  const wordHighlight = json => {
    return json.replace(/(<c[0-9]>.*?<\/c[0-9]>)/g, match => {
      let color = ''
      if (/(<c1>.*?<\/c1>)/.test(match)) color = 'blue'
      if (/(<c2>.*?<\/c2>)/.test(match)) color = 'red'
      if (/(<c3>.*?<\/c3>)/.test(match)) color = 'purple'

      return `<span style="color: ${color}">${match.replace(
        /<c[0-9]>(.*?)<\/c[0-9]>/g,
        '$1'
      )}</span>`
    })
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
                    inputProps={{ 'data-cy': 'construct-test-input' }}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <AppButton
                  onClick={handleClick}
                  data-cy="construct-test-send-button"
                  sx={{ height: shape.inputHeight, py: 0, flexShrink: 0 }}
                >
                  {pending ? <Spinner inline size={20} /> : 'Send'}
                </AppButton>
              </div>
              {patternResults && (
                <FormControlLabel
                  sx={{ '& .MuiFormControlLabel-label': { ml: '0.75em' } }}
                  control={
                    <AppSwitch
                      checked={showAnalyses}
                      onChange={() => setShowAnalyses(!showAnalyses)}
                      slotProps={{ input: { 'data-cy': 'construct-test-show-analyses-toggle' } }}
                    />
                  }
                  label="Show analyses"
                />
              )}
            </div>

            {patternResults && (
              <>
                <div className="mt-nm mb-lg">
                  <Divider sx={{ my: '1em' }} />
                </div>

                <div className="flex-col" style={{ gap: '1em' }}>
                  {patternResults.map((resultObj, index) => (
                    <div
                      key={index}
                      style={{
                        borderRadius: '12px',
                        padding: '1em',
                        background: '#fff',
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '1.2em', marginBottom: '0.5em' }}>
                        {resultObj.message}
                      </div>

                      <AppTable density="compact" plain>
                        <TableBody>
                          <TableRow>
                            <TableCell
                              key={`${resultObj.sentence}-${index}`}
                              sx={{ width: '18.75%', fontWeight: 600, color: colors.ink }}
                            >
                              Sentence
                            </TableCell>
                            <TableCell key={wordHighlight(resultObj.sentence)}>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: wordHighlight(resultObj.sentence),
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </AppTable>

                      {Object.keys(resultObj.table).length > 0 && (
                        <AppTable density="compact" plain>
                          <TableBody>
                            {Object.keys(resultObj.table).map(key => (
                              <TableRow>
                                <TableCell
                                  key={`${key}`}
                                  sx={{ width: '18.75%', fontWeight: 600, color: colors.ink }}
                                >
                                  {key}
                                </TableCell>
                                <TableCell
                                  key={`${resultObj.table[key]}`}
                                  style={{ color: colors.ink }}
                                >
                                  {resultObj.table[key]}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </AppTable>
                      )}
                      <div className="mb-lg" style={{ whiteSpace: 'pre-line' }}>
                        {resultObj.matches}
                      </div>
                      {showAnalyses && !isNoChunkResult(resultObj) && (
                        <div>
                          <Divider sx={{ my: '1em' }} />
                          <div style={{ fontWeight: 600 }}>Analyses:</div>
                          <div style={{ overflow: 'auto', maxHeight: '500px' }}>
                            <pre
                              dangerouslySetInnerHTML={{
                                __html: JSON.stringify(resultObj.analysis, null, 2),
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
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

export default ConstructTestView
