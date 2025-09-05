import React from 'react'
import { Button } from 'react-bootstrap'
import { sanitizeHtml } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'

const ReadingTestMC = ({
  exercise,
  onAnswer,
  answerPending,
  showFeedbacks,
  showCorrect,
  showSelfReflect,
  questionDone,
}) => {
  const { choices, question, prephrase, test_text: text } = exercise

  const bigScreen = useWindowDimensions().width >= 700

  return (
    <div style={{ display: 'flex', position: 'relative' }}>
      <div style={{ display: bigScreen ? 'flex' : 'block', paddingRight: '1em' }}>
        {/* Left Column */}
        <div style={{ flex: '1', marginRight: '20px' }}>
          <div className="test-prephrase">{prephrase}</div>
          <div className="test-question-context">
            {text && (
              <div>
                <div
                  className="test-text-main-title"
                  style={{ fontWeight: 'bold', fontSize: '1.5em' }}
                  dangerouslySetInnerHTML={sanitizeHtml(text['main_title'])}
                />
                <div
                  className="test-text-second-title"
                  style={{ fontSize: '1.3em' }}
                  dangerouslySetInnerHTML={sanitizeHtml(text['second_title'])}
                />
                <div
                  className="test-text"
                  style={{
                    marginTop: '5px',
                    fontSize: '1.1em',
                    textAlign: 'justify',
                    paddingRight: '0.3em',
                    whiteSpace: 'pre-line',
                  }}
                  dangerouslySetInnerHTML={sanitizeHtml(text['text'])}
                />
              </div>
            )}
          </div>
        </div>
        {/* Right Column */}
        <div style={{ flex: '1' }}>
          {question && (
            <div
              className="test-question"
              dangerouslySetInnerHTML={sanitizeHtml(question)}
              style={{ fontSize: '1.3em', paddingTop: '0', margin: '0 0 0 0' }}
            />
          )}
          {choices &&
            choices.map(choice => (
              <div key={choice?.option}>
                <Button
                  className="test-choice-button"
                  onClick={!answerPending ? () => onAnswer(choice) : undefined}
                  disabled={
                    answerPending ||
                    showFeedbacks ||
                    showSelfReflect ||
                    choice.isSelected ||
                    questionDone
                  }
                  style={{
                    whiteSpace: 'pre-line',
                    lineHeight: '1.0',
                    padding: '0.6em',
                    backgroundColor:
                      showCorrect && choice.is_correct
                        ? 'lightgreen'
                        : choice.isSelected
                          ? choice.is_correct
                            ? 'lightgreen' 
                            : 'lightcoral'
                        : ''
                  }}
                >
                  <span style={{ fontSize: '0.7em' }}>{choice?.option}</span>
                </Button>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default ReadingTestMC
