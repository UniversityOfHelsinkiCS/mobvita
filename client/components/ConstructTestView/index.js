import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Segment, Input, Divider } from 'semantic-ui-react'
import { learningLanguageSelector } from 'Utilities/common'
import { testConstruction, resetConstructionResults } from 'Utilities/redux/constructionTestReducer'
import { Spinner } from 'react-bootstrap'

const ConstructTestView = () => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)

  const [text, setText] = useState('')

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

  const syntaxHighlight = json => {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

    return json.replace(/(&lt;c[0-9]&gt;.*?&lt;\/c[0-9]&gt;)/g, match => {
      let color = ''

      if (/(&lt;c1&gt;.*?&lt;\/c1&gt;)/.test(match)) color = 'blue'
      if (/(&lt;c2&gt;.*?&lt;\/c2&gt;)/.test(match)) color = 'red'
      if (/(&lt;c3&gt;.*?&lt;\/c3&gt;)/.test(match)) color = 'green'

      return `<span style="color: ${color}">${match.replace(
        /&lt;c[0-9]&gt;(.*?)&lt;\/c[0-9]&gt;/g,
        '$1'
      )}</span>`
    })
  }

  return (
    <div className="cont-tall pt-sm flex-col space-between">
      <div className="justify-center">
        <div className="cont">
          <Segment>
            <div style={{ maxWidth: '550px' }}>
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
              <>
                <Divider />
                <div
                  style={{
                    borderRadius: '7px',
                    padding: '1em',
                    background: '#f5f5f5',
                    minHeight: '500px',
                  }}
                >
                  <div style={{ overflow: 'auto', maxHeight: '1100px' }}>
                    <pre
                      dangerouslySetInnerHTML={{
                        __html: syntaxHighlight(JSON.stringify(patternResults, null, 2)),
                      }}
                    />
                  </div>
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
