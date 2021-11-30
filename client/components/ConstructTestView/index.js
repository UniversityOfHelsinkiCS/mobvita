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

  const handleClick = () => {
    dispatch(testConstruction(learningLanguage, text))
  }

  useEffect(() => {
    dispatch(resetConstructionResults())
  }, [])

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
                  <div style={{ overflow: 'auto', maxHeight: '1000px' }}>
                    <pre>{JSON.stringify(patternResults, null, 2)}</pre>
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
