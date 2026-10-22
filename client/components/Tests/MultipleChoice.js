import React from 'react';
import AppButton from 'Components/AppButton';
import { useSelector, useDispatch } from 'react-redux';
import { sanitizeHtml } from 'Utilities/common';
// import { FormattedMessage } from 'react-intl';
// import { nextTestQuestion } from 'Utilities/redux/testReducer';

// `outlineLastChoice`: the last option is "I don't know" — drawn as a green-bordered outline.
const MultipleChoice = ({ exercise, onAnswer, answerPending, outlineLastChoice = false }) => {
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
        .map((choice, index) => {
          const outlined = outlineLastChoice && index === choices.length - 1
          return (
          <div key={choice?.option} style={{ marginBottom: '0.75em' }}>
            <AppButton
              className="test-choice-button"              
              multiline="rounded"
              variant={outlined ? 'tan-outline' : undefined}              
              sx={outlined ? { backgroundColor: 'transparent' } : undefined}
              onClick={!answerPending ? () => onAnswer(choice) : undefined}
            >
              <span className="test-choice-text">{choice?.option}</span>
            </AppButton>
          </div>
          )
        })
      )}

      {/* {showFeedbacks && (
        <AppButton className="test-choice-button" onClick={() => {
          dispatch(nextTestQuestion())
        }}>
          <FormattedMessage id="go-to-next-test-question" />
        </AppButton>
      )} */}
    </div>
  );
};

export default MultipleChoice;
