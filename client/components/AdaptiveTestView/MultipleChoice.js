import React from 'react'
import { Button } from 'react-bootstrap'
import { sanitizeHtml } from 'Utilities/common'


const MultipleChoice = ({ exercise, onAnswer, answerPending }) => {
  const { choices, question, prephrase } = exercise

  return (
    <div>
      <div className="test-prephrase">
        {prephrase}
      </div>
      { question && (
        <div className="test-question" dangerouslySetInnerHTML={sanitizeHtml(question)} />
      )}
      {choices.map(choice => (
        <div key={choice}>
          <Button
            className="test-choice-button"
            onClick={!answerPending ? (() => onAnswer(choice)) : undefined}
          >
            <span>
              {choice}
            </span>
          </Button>
        </div>
      ))}
    </div>
  )
}

export default MultipleChoice
