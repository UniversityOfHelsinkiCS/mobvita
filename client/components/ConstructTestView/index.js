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
          <Paper sx={{ padding: '1em' }}>
            <div className="space-between align-center">
              <div style={{ width: '550px' }}>
                <AppTextField
                  endIcon={
                    <AppButton
                      size="sm"
                      onClick={handleClick}
                      data-cy="construct-test-send-button"
                    >
                      {pending ? <Spinner inline /> : 'Send'}
                    </AppButton>
                  }
                  placeholder="Enter a sentence..."
                  inputProps={{ 'data-cy': 'construct-test-input' }}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              {patternResults && (
                <FormControlLabel
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
                      style={{
                        borderRadius: '7px',
                        padding: '1em',
                        background: 'rgb(239, 239, 239)',
                      }}
                    >
                      <div className="bold ml-sm" style={{ fontSize: '1.2em' }}>
                        {resultObj.message}
                      </div>

                      <AppTable density="compact" bordered>
                        <TableBody>
                          <TableRow>
                            <TableCell
                              key={`${resultObj.sentence}-${index}`}
                              className="bold"
                              sx={{ width: '18.75%' }}
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
                        <AppTable density="compact" bordered>
                          <TableBody>
                            {Object.keys(resultObj.table).map(key => (
                              <TableRow>
                                <TableCell key={`${key}`} className="bold" sx={{ width: '18.75%' }}>
                                  {key}
                                </TableCell>
                                <TableCell
                                  key={`${resultObj.table[key]}`}
                                  style={{ color: 'green' }}
                                >
                                  {resultObj.table[key]}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </AppTable>
                      )}
                      <div className="ml-sm mb-lg" style={{ whiteSpace: 'pre-line' }}>
                        {resultObj.matches}
                      </div>
                      {showAnalyses && !isNoChunkResult(resultObj) && (
                        <div className="ml-sm">
                          <Divider sx={{ my: '1em' }} />
                          <div className="bold">Analyses:</div>
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
