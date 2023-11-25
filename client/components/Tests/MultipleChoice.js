import React from 'react'
import { Button } from 'react-bootstrap'
import { sanitizeHtml } from 'Utilities/common'

const MultipleChoice = ({ exercise, onAnswer, answerPending }) => {
  const { choices, question, prephrase, test_text } = exercise

  return (
    <div>
      <div className="test-prephrase">{prephrase}</div>
      <div className='test-question-context'>
        {test_text && (
          <div>
            <div className="test-text-main-title" dangerouslySetInnerHTML={sanitizeHtml(test_text["main_title"])} />
            <div className="test-text-second-title" dangerouslySetInnerHTML={sanitizeHtml(test_text["second_title"])} />
            <div className="test-text" style={{ marginTop: "5px" }} dangerouslySetInnerHTML={sanitizeHtml(test_text["text"])} />
          </div>
        )}
        {question && (
          <div className="test-question" dangerouslySetInnerHTML={sanitizeHtml(question)} />
        )}
      </div>
      
      {choices.map(choice => (
        <div key={choice.option}>
          <Button
            className="test-choice-button"
            onClick={!answerPending ? () => onAnswer(choice) : undefined}
          >
            <span>{choice.option}</span>
          </Button>
        </div>
      ))}
    </div>
  )
}

export default MultipleChoice
