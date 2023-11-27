import React from 'react';
import { Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { sanitizeHtml } from 'Utilities/common';
import { FormattedMessage } from 'react-intl';
import { nextTestQuestion } from 'Utilities/redux/testReducer';

const MultipleChoice = ({ exercise, onAnswer, answerPending }) => {
  const { choices, question, prephrase, test_text } = exercise;

  const {
    // currentAnswer,
    feedbacks,
    showFeedbacks,
  } = useSelector(({ tests }) => tests);

  const dispatch = useDispatch();

  return (
    <div>
      <div className="test-prephrase">{prephrase}</div>
      <div className='test-question-context'>
        {test_text && (
          <div>
            <div className="test-text-main-title" style={{ fontWeight: 'bold', fontSize: '1.2em' }} dangerouslySetInnerHTML={sanitizeHtml(test_text["main_title"])} />
            <div className="test-text-second-title" style={{ fontSize: '1.1em' }} dangerouslySetInnerHTML={sanitizeHtml(test_text["second_title"])} />
            <div className="test-text" style={{ marginTop: "5px" }} dangerouslySetInnerHTML={sanitizeHtml(test_text["text"])} />
          </div>
        )}
        {question && (
          <div className="test-question" dangerouslySetInnerHTML={sanitizeHtml(question)} />
        )}
      </div>

      {showFeedbacks ? (
        <div 
          className="test-feedback" 
          style={{ color: 'red' }}
          dangerouslySetInnerHTML={sanitizeHtml(feedbacks[0])} 
        />
        // Object.keys(feedbacks).map(option => (
        //   <div key={option} className="feedback" dangerouslySetInnerHTML={sanitizeHtml(feedbacks[option])} />
        // ))
      ) : (
        choices.map(choice => (
          <div key={choice.option}>
            <Button
              className="test-choice-button"
              onClick={!answerPending ? () => onAnswer(choice) : undefined}
            >
              <span>{choice.option}</span>
            </Button>
          </div>
        ))
      )}

      {showFeedbacks && (
        <Button className="test-choice-button" onClick={() => {
          dispatch(nextTestQuestion())
        }}>
          <FormattedMessage id="go-to-next-test-question" />
        </Button>
      )}
    </div>
  );
};

export default MultipleChoice;
