import React from 'react'
import { Button } from 'react-bootstrap'

const MultipleChoice = ({ exercise, onAnswer }) => {
  const { choices, question, prephrase } = exercise
  return (
    <>
      <div className="test-question">{prephrase}</div>
      <div className="test-question">{question}</div>
      {choices.map(choice => (
        <div key={choice}>
          <Button
            className="test-choice-button"
            onClick={() => onAnswer(choice)}
          >
            {choice}
          </Button>
        </div>
      ))}
    </>
  )
}

export default MultipleChoice
