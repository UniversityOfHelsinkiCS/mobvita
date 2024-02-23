import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { sanitizeHtml } from 'Utilities/common';
import { FormattedMessage, useIntl } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions';

import ReactSlider from 'react-slider'


const OpenEndedQuestion = ({ idx, question, answer, onAnswerChange }) => {
    const handleInputChange = (event) => {
        onAnswerChange(idx, event.target.value);
    };
  
    return (
        <div className="open-ended-question" style={{padding: '0.5em'}}>
            <label style={{ fontWeight: 'bold' }}>{question}</label>
            <textarea 
                id={idx} 
                value={answer} 
                onChange={handleInputChange}
                style={{
                    width: '100%', 
                    height: '30vh', 
                    fontSize: '16px', 
                    padding: '10px',
                }}
            />
        </div>
    );
};

const UsefulSlider = ({ sliderQuestion, sliderValue, setSliderValue, doNotKnow, setDoNotKnow }) => {
    const handleSliderChange = (value) => {
        setSliderValue(value);
    };
    const marks = Array.from({ length: 11 }, (_, i) => i)
  
    return (
        <div className="slider-and-controls-container" style={{
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'stretch',
            padding: '0.5em'
        }}>
            <label style={{ fontWeight: 'bold' }}>{sliderQuestion}</label>
            <div className="space-between bold" style={{
                display: 'flex',
                alignItems: 'end', 
                justifyContent: 'space-between',
            }}>
                <span style={{ textAlign: 'left' }}><FormattedMessage id='not-useful-at-all' /></span>
                <span style={{ textAlign: 'right' }}><FormattedMessage id='very-useful' /></span>
            </div>
            <div className="useful-slider-container" style={{
                marginBottom: '3em'
            }}>
                <ReactSlider
                    className="useful-slider"
                    thumbClassName="exercise-density-slider-thumb"
                    trackClassName="exercise-density-slider-track"
                    onAfterChange={value => handleSliderChange(value)}
                    onSliderClick={value => handleSliderChange(value)}
                    snapDragDisabled={false}
                    markClassName="exercise-density-slider-mark"
                    marks={marks}
                    min={0}
                    max={10}
                    step={1}
                    value={sliderValue}
                    disabled={doNotKnow}
                />
            </div>
            <div style={{ marginTop: '20px' }}>
                <input 
                    type="checkbox" 
                    id="doNotKnowCheckbox" 
                    className="btn-checkbox" 
                    value={doNotKnow}
                    onChange={() => setDoNotKnow(!doNotKnow)}
                    style={{ marginRight: '0.5em' }}
                />
                <label htmlFor="doNotKnowCheckbox" className="btn-label">
                    <FormattedMessage id='do-not-know' />
                </label>
            </div>
        </div>
    );
};
  

const ReadingTestSelfReflect = ({ currentReadingSet, in_control_grp, in_experimental_grp, showSelfReflect, submitSelfReflection }) => {
    const [current, setCurrent] = useState(0);
    const bigScreen = useWindowDimensions().width >= 700;

    let open_ended_questions = []
    if (in_experimental_grp){
        open_ended_questions = [
            "Did the feedback in the previous items change the way you read the texts? In what ways?",
            "Did you get any new ideas about how to answer reading questions?",
            "How does it feel?  What would you change in the exercises to make it easier to use?"
        ]
    }
    if (in_control_grp && !in_experimental_grp){
        open_ended_questions = [
            "How uncertain were you of your answers?",
            "What kind of difficulties did you have? ",
            "What kind of help would you wish for?"
        ]
    }

    const [endSetSliderDoNotKnow, setEndSetSliderDoNotKnow] = useState(false)
    const [endSetSliderValue, setEndSetSliderValue] = useState(null)
    const [openEndedQuestionAnswers, setOpenEndedQuestionAnswers] = useState(
        open_ended_questions.map(() => null)
    );

    const handleAnswerChange = (index, newValue) => {
        const updatedAnswers = [...openEndedQuestionAnswers];
        updatedAnswers[index] = newValue;
        setOpenEndedQuestionAnswers(updatedAnswers);
    };

    const self_reflection_questions = open_ended_questions.map((question, index) => {
        return {
            component: OpenEndedQuestion,
            props: {
                idx: index,
                question: question,
                answer: openEndedQuestionAnswers[index], 
                onAnswerChange: (idx, newValue) => handleAnswerChange(idx, newValue)
            }
        };
    });
    if (in_experimental_grp){
        const endSetUsefulSliderComponent = {
            component: UsefulSlider,
            props: {
                sliderQuestion: "How useful do you think this feedback is now after these tasks?",
                sliderValue: endSetSliderValue, 
                setSliderValue: setEndSetSliderValue,
                doNotKnow: endSetSliderDoNotKnow,
                setDoNotKnow: setEndSetSliderDoNotKnow
            }
        };
        self_reflection_questions.unshift(endSetUsefulSliderComponent);
    }
    
    const submitResponse = () => {
        const open_ended_questions_with_responses = open_ended_questions.map((question, index) => ({
            question: question,
            answer: openEndedQuestionAnswers[index] || ''
        }));
        submitSelfReflection({
            "open_ended_questions": open_ended_questions_with_responses,
            "feedback_usefulness": endSetSliderValue,
            "question_set": currentReadingSet
        })
    }

    const nextSlide = () => {
        if (self_reflection_questions && self_reflection_questions.length > 0) {
            setCurrent(current === self_reflection_questions.length - 1 ? 0 : current + 1);
        }
    };

    const prevSlide = () => {
        if (self_reflection_questions && self_reflection_questions.length > 0) {
            setCurrent(current === 0 ? self_reflection_questions.length - 1 : current - 1);
        }
    };

    const goToSlide = (index) => {
        if (self_reflection_questions && self_reflection_questions.length > 0 && index >= 0 && index < self_reflection_questions.length) {
            setCurrent(index);
        }
    }

    const renderReflection = () => (
        <Draggable cancel=".interactable">
            <div
                style={{
                    position: 'absolute',
                    left: '0%',
                    width: bigScreen ? "100%" : "100%",
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000,
                    padding: "1em",
                    background: "white",
                    borderRadius: "1em",
                    boxShadow: '6px 11px 10px 0px rgba(0, 0, 0, 0.5)',
                }}
            >
                <div className='slider-content'>
                    <button
                        className='left-arrow'
                        onClick={prevSlide}
                        onTouchEnd={prevSlide}
                        disabled={self_reflection_questions.length==0 || current == 0}
                    >
                        <Icon
                            className='left-arrow'
                            name={'chevron left'}
                            style={{ cursor: 'pointer' }}
                        />
                    </button>

                    <div className='content-container' style={
                        {
                            overflowY: 'hidden',
                            overflowX: 'hidden',
                            paddingLeft: '1em',
                            paddingRight: '1em',
                            width: '100%'
                        }
                    }> 
                        <div className='self-reflection-header' style={{
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center'
                        }}>
                            <h3 style={{ textAlign: 'left', margin: 0 }}>
                                <FormattedMessage id='reading-test-end-set-self-reflection-header' />
                            </h3>
                            <button 
                                type="submit" 
                                className="btn btn-primary" 
                                onClick={submitResponse}
                                disabled={!openEndedQuestionAnswers.every(answer => answer !== null && answer.trim() !== '')}
                            >
                                <FormattedMessage id='self-reflection-submit' />
                            </button>
                        </div>
                        <div
                            className='slide-container'
                            style={{
                                height: "100%",
                                alignItems: "center",
                                margin: "10px"
                            }}
                        >
                            <div className='slide active' key={current}>
                                {
                                    React.createElement(
                                        self_reflection_questions[current].component,
                                        { ...self_reflection_questions[current].props, key: current }
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    <button
                        className='right-arrow'
                        onClick={nextSlide}
                        onTouchEnd={nextSlide}
                        disabled={self_reflection_questions.length==0 || current == self_reflection_questions.length - 1}
                    >
                        <Icon
                            className='right-arrow'
                            name={'chevron right'}
                            style={{ cursor: 'pointer' }}
                        />
                    </button>
                </div>
                <div className='pagination'>
                    {self_reflection_questions.map((_, index) => (
                        <span
                            key={index}
                            className={index === current ? 'dot active' : 'dot'}
                            onClick={() => goToSlide(index)}
                            onTouchEnd={() => goToSlide(index)}
                        ></span>
                    ))}
                </div>

                
                {/* <div
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        cursor: 'pointer',
                        zIndex: 1001, // Place it above the feedback
                    }}
                    onClick={closeSelfReflect}
                >
                    <Icon name="close" color="black" size="large" />
                </div> */}
            </div>
        </Draggable>
    );

    return (
        <div style={{ display: 'flex', position: 'relative' }}>
            {showSelfReflect && self_reflection_questions.length > 0 && renderReflection()}
        </div>
    );
};

export default ReadingTestSelfReflect;
