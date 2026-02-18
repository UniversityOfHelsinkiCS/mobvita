/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-danger */
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Segment, Input, Divider, Table, Checkbox } from 'semantic-ui-react'
import { learningLanguageSelector } from 'Utilities/common'
import { testConstruction, resetConstructionResults } from 'Utilities/redux/constructionTestReducer'
import Spinner from 'Components/Spinner'


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
              {patternResults && (
                <Checkbox
                  toggle
                  label="Show analyses"
                  checked={showAnalyses}
                  onChange={() => setShowAnalyses(!showAnalyses)}
                />
              )}
            </div>

            {patternResults && (
              <>
                <div className="mt-nm mb-lg">
                  <Divider />
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

                      <Table size="small" celled>
                        <Table.Body>
                          <Table.Row>
                            <Table.Cell
                              key={`${resultObj.sentence}-${index}`}
                              className="bold"
                              width={3}
                            >
                              Sentence
                            </Table.Cell>
                            <Table.Cell key={wordHighlight(resultObj.sentence)}>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: wordHighlight(resultObj.sentence),
                                }}
                              />
                            </Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table>

                      {Object.keys(resultObj.table).length > 0 && (
                        <Table size="small" celled>
                          <Table.Body>
                            {Object.keys(resultObj.table).map(key => (
                              <Table.Row>
                                <Table.Cell key={`${key}`} className="bold" width={3}>
                                  {key}
                                </Table.Cell>
                                <Table.Cell
                                  key={`${resultObj.table[key]}`}
                                  style={{ color: 'green' }}
                                >
                                  {resultObj.table[key]}
                                </Table.Cell>
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table>
                      )}
                      <div className="ml-sm mb-lg" style={{ whiteSpace: 'pre-line' }}>
                        {resultObj.matches}
                      </div>
                      {showAnalyses && (
                        <div className="ml-sm">
                          <Divider />
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
          </Segment>
        </div>
      </div>
    </div>
  )
}

export default ConstructTestView
