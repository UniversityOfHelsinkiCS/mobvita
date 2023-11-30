import React from 'react';
import { Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { sanitizeHtml } from 'Utilities/common';
// import { FormattedMessage } from 'react-intl';
// import { nextTestQuestion } from 'Utilities/redux/testReducer';

const MultipleChoice = ({ exercise, onAnswer, answerPending }) => {
  const { choices, question, prephrase, test_text } = exercise;

  const {
    feedbacks,
  } = useSelector(({ tests }) => tests);

  // const dispatch = useDispatch();

  return (
    <div>
      <div className="test-prephrase">{prephrase}</div>
      <div className='test-question-context'>
        {test_text && (
          <div>
            <div className="test-text-main-title" style={{ fontWeight: 'bold', fontSize: '1.5em' }} dangerouslySetInnerHTML={sanitizeHtml(test_text["main_title"])} />
            <div className="test-text-second-title" style={{ fontSize: '1.3em' }} dangerouslySetInnerHTML={sanitizeHtml(test_text["second_title"])} />
            <div className="test-text" style={{ marginTop: "5px", fontSize: '1.1em', textAlign: 'justify', paddingRight: '0.3em' }} dangerouslySetInnerHTML={sanitizeHtml(test_text["text"])} />
          </div>
        )}
        {question && (
          <div className="test-question" dangerouslySetInnerHTML={sanitizeHtml(question)} />
        )}
      </div>

      {Object.keys(feedbacks).map((fb_key, index) => (
        <div 
          key={fb_key} 
          style={{
            color: 'red',
            marginBottom: '0.5em',
            borderBottom: index < Object.keys(feedbacks).length - 1 ? '1px solid black' : 'none', 
            paddingBottom: '0.5em', 
            whiteSpace: 'pre-line',
          }} 
          className="feedback" 
          dangerouslySetInnerHTML={sanitizeHtml(feedbacks[fb_key])} />
      ))}

      {choices && (choices
        // .filter(choice => choice?.isSelected != true)
        .map(choice => (
          <div key={choice?.option}>
            <Button
              className="test-choice-button"
              onClick={!answerPending ? () => onAnswer(choice) : undefined}
            >
              <span style={{ fontSize: '0.77em' }}>{choice?.option}</span>
            </Button>
          </div>
        ))
      )}

      {/* {showFeedbacks && (
        <Button className="test-choice-button" onClick={() => {
          dispatch(nextTestQuestion())
        }}>
          <FormattedMessage id="go-to-next-test-question" />
        </Button>
      )} */}
    </div>
  );
};

export default MultipleChoice;
