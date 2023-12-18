import React from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { sanitizeHtml } from 'Utilities/common';
import useWindowDimensions from 'Utilities/windowDimensions'

const ReadingTestMC = ({ exercise, onAnswer, answerPending, showFeedbacks, closeFeedbacks }) => {
    const { choices, question, prephrase, test_text } = exercise;
    const { feedbacks } = useSelector(({ tests }) => tests);

    const bigScreen = useWindowDimensions().width >= 700

    return (
        <div style={{ display: 'flex' }}>
            {showFeedbacks ? (
                <div style={{ flex: '1', marginRight: '20px' }}>
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
                            dangerouslySetInnerHTML={sanitizeHtml(feedbacks[fb_key])}
                        />
                    ))}
                    <button 
                        className='btn btn-primary'
                        onClick={closeFeedbacks}
                        style={{width: '100%'}}
                    >back-to-reading-question</button>
                </div>
            ) : (
                <>
                    <div style={{ display: bigScreen ? 'flex' : 'block' }}>
                        {/* Left Column */}
                        <div style={{ flex: '1', marginRight: '20px' }}>
                            <div className="test-prephrase">{prephrase}</div>
                            <div className="test-question-context">
                                {test_text && (
                                    <div>
                                        <div className="test-text-main-title" style={{ fontWeight: 'bold', fontSize: '1.5em' }} dangerouslySetInnerHTML={sanitizeHtml(test_text["main_title"])} />
                                        <div className="test-text-second-title" style={{ fontSize: '1.3em' }} dangerouslySetInnerHTML={sanitizeHtml(test_text["second_title"])} />
                                        <div className="test-text" style={{ marginTop: "5px", fontSize: '1.1em', textAlign: 'justify', paddingRight: '0.3em' }} dangerouslySetInnerHTML={sanitizeHtml(test_text["text"])} />
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
                                    style={{ fontSize: '1.3em' }}
                                />
                            )}
                            {choices && (
                                choices.map(choice => (
                                    <div key={choice?.option}>
                                        <Button
                                            className="test-choice-button"
                                            onClick={!answerPending ? () => onAnswer(choice) : undefined}
                                        >
                                            <span style={{ fontSize: '0.7em' }}>{choice?.option}</span>
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ReadingTestMC;
