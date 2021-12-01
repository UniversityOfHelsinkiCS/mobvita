import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Segment, Input, Divider, Table, Checkbox } from 'semantic-ui-react'
import { learningLanguageSelector } from 'Utilities/common'
import { testConstruction, resetConstructionResults } from 'Utilities/redux/constructionTestReducer'
import { Spinner } from 'react-bootstrap'

const ConstructTestView = () => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)

  const [text, setText] = useState('')
  const [showAnalyses, setShowAnalyses] = useState(false)

  const { patternResults, pending } = useSelector(({ constructionTest }) => constructionTest)

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

  // console.log(patternResults)

  const syntaxHighlight = json => {
    return json.replace(/(<c[0-9]>.*?<\/c[0-9]>)/g, match => {
      let color = ''
      if (/(<c1>.*?<\/c1>)/.test(match)) color = 'blue'
      if (/(<c2>.*?<\/c2>)/.test(match)) color = 'red'
      if (/(<c3>.*?<\/c3>)/.test(match)) color = 'green'

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
                      <Spinner animation="border" variant="primary" size="sm" />
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
                <Divider />

                <div style={{ marginTop: '1.5em' }}>
                  {patternResults.map(resultObj => (
                    <div
                      style={{
                        borderRadius: '7px',
                        padding: '1em',
                        background: '#f5f5f5',
                        marginBottom: '.75em',
                      }}
                    >
                      <div className="bold" style={{ marginLeft: '.5em', fontSize: '1.2em' }}>
                        {patternResults[0].message}
                      </div>

                      <Table size="small" celled>
                        <Table.Body>
                          <Table.Row>
                            <Table.Cell width={3}>
                              <b>Sentence</b>
                            </Table.Cell>
                            <Table.Cell>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: syntaxHighlight(resultObj.sentence),
                                }}
                              />
                            </Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table>
                      {/* {console.log(resultObj.table)} */}
                      <Table size="small" celled>
                        <Table.Body>
                          {Object.keys(resultObj.table).map(key => (
                            <Table.Row>
                              <Table.Cell width={3}>
                                <b>{key}</b>
                              </Table.Cell>
                              <Table.Cell style={{ color: 'green' }}>
                                {resultObj.table[key]}
                              </Table.Cell>
                            </Table.Row>
                          ))}

                        </Table.Body>
                      </Table>
                      <div style={{ margin: '1em .5em 2em .5em', whiteSpace: 'pre-line' }}>
                        {resultObj.matches}
                      </div>
                      {showAnalyses && (
                        <>
                          <Divider />
                          <div className="bold" style={{ marginLeft: '.5em' }}>
                            Analyses:
                          </div>
                          <div style={{ overflow: 'auto', maxHeight: '500px', marginLeft: '.5em' }}>
                            <pre
                              dangerouslySetInnerHTML={{
                                __html: syntaxHighlight(
                                  JSON.stringify(resultObj.analysis, null, 2)
                                ),
                              }}
                            />
                          </div>
                        </>
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
